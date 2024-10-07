// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ROKSAWEB is Ownable, ReentrancyGuard {
    struct User {
        address referrer;
        uint96 id;
        uint152 totalReferralBonusEarned;
        uint32 currentLevel;
        bool isExist;
        uint64 lastPlacedPosition;
    }

    struct GlobalPool {
        uint112 placeCount;
        uint64 poolCount;
        uint8 currentLevel;
        uint64 lastPlacedPosition;
        bool isShiftedToNextPool;
        mapping(uint112 => address) lastUserPlaced;
    }

    IERC20 public token;
    address public _firstId;
    uint96 public userIdCounter;
    uint16 private constant _commission = 10;
    uint256 private constant _maxIndividualLevelDepth = 11;

    event ReferralBonus(address indexed referrer, uint indexed amount);
    event GlobalBonus(
        address indexed referrer,
        uint indexed amount,
        uint indexed poolCount
    );
    event PutToReferralTree(
        address indexed user,
        address indexed referrer,
        uint indexed level
    );
    event LinkedToRefTree(
        uint indexed level,
        uint indexed place,
        address indexed user
    );
    event PutToGlobalPool(
        uint indexed poolCount,
        address referredUser,
        address referrer
    );
    event LinkedToGlobalPool(
        uint indexed level,
        uint indexed place,
        uint indexed poolCount
    );
    event WithdrawBalance(
        address indexed user,
        uint256 indexed amount,
        uint256 time
    );

    mapping(address => User) public users;
    mapping(address => mapping(uint => GlobalPool)) public globalPools;
    mapping(uint => address[]) public poolUsers;

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
        _firstId = 0xFBc2DC59099Df95dc07353c602B70904c11d9707;
        _saveUserInfo(_firstId, address(0));
        _initGlobalPool(_firstId);
    }

    /***
     * @function registerUser
     * @param address referrer (address of a referrer)
     * @param uint256 tokenAmt (Amount to be submitted as registration)
     * @dev a user will be charged 40 USDT to be registered
     */
    function registerUser(address referrer) public nonReentrant {
        require(
            !users[msg.sender].isExist,
            "ROKSAWEB:: User is already registered."
        );

        if (referrer == address(0)) referrer = _firstId;
        else require(users[referrer].isExist, "ROKSAWEB:: Referrer do not exists.");
        /** Mapped user detail in the 'users' mapping as a registration */
        _saveUserInfo(msg.sender, referrer);
        /** pull token from registered user wallet */
        token.transferFrom(msg.sender, address(this), 40 ether);
        /** Place referredUser in each referrer pool */
        _placeInReferrerPool(msg.sender, referrer, 1);
        _initGlobalPool(msg.sender);
    }

    /***
     * @function _initGlobalPool
     * @param address _user (msg.sender)
     * @dev Called function via Registration to init user in a global pool
     */
    function _initGlobalPool(address _user) private {
        globalPools[_user][1].poolCount = 1;
        globalPools[_user][1].currentLevel = 1;
        poolUsers[1].push(_user);
        if (_user != _firstId) _placeInGlobalPool(_user, _firstId, 1);
    }

    /***
     * @function _saveUserInfo
     * @param address _referredUser (User whos is registering)
     * @param address _referrer (coming by referrence)
     * @dev saving user info into users mapping
     */
    function _saveUserInfo(address _referredUser, address _referrer) private {
        users[_referredUser].id = ++userIdCounter;
        users[_referredUser].isExist = true;
        if (_referrer != address(0)) users[_referredUser].referrer = _referrer;
    }

    /***
     * @function _placeInReferrerPool
     * @param address _referredUser (a user referred by a referrer)
     * @param address _referrer
     * @dev place a user in referrer individual pool
     */
    function _placeInReferrerPool(
        address _referredUser,
        address _referrer,
        uint64 _level
    ) private {
        /** Pull out referrer info from users mapping */
        User memory user = users[_referrer];
        /** Add user in referrer pool & distribute referralBonus accordingly. */
        _addInReferrerPool(user, _referrer, _referredUser);
        if (_level <= _maxIndividualLevelDepth)
            _distributeRegisteredFunds(_referrer, _level);
        /** increase count to distribute 1.5 token only, initial will be owner only at 0 */
        _level++;

        /** by default, It should be 14 as initial value is 0 (referrer) level */
        /** recurssion to align that user in parent id pool */
        if (user.referrer != address(0))
            _placeInReferrerPool(_referredUser, user.referrer, _level);
    }

    /***
     * @function _addInReferrerPool
     * @param user (User referrer)
     * @param address -> _referredUser (a user referred by a referrer)
     * @param address -> referrer
     * @dev Add referrerUser in a particular referrer pool
     */
    function _addInReferrerPool(
        User memory user,
        address _referrer,
        address _referredUser
    ) private {
        /** Add to Referrer Pool  */
        uint32 _maxPositionsInEachLevel = uint32(2 ** user.currentLevel);
        /** Reset level and Positions according to the fulfilment of place */
        if (user.lastPlacedPosition == _maxPositionsInEachLevel) {
            if (user.currentLevel < _maxIndividualLevelDepth) {
                users[_referrer].currentLevel = user.currentLevel + 1;
                users[_referrer].lastPlacedPosition = 1;
            }
        } else {
            /** By default, increment level position */
            users[_referrer].lastPlacedPosition =
                users[_referrer].lastPlacedPosition +
                1;
        }

        emit PutToReferralTree(
            _referredUser,
            _referrer,
            users[_referrer].currentLevel
        );
        emit LinkedToRefTree(
            users[_referrer].currentLevel,
            users[_referrer].lastPlacedPosition,
            _referredUser
        );
    }

    /***
     * @function _distributeRegisteredFunds
     * @param address _referrer (address of a each referrer)
     * @dev distribute fund to each referrer recursively.
     */
    function _distributeRegisteredFunds(
        address _referrer,
        uint64 _level
    ) private {
        uint256 _referralBonus = 2 ether;
        if (_level == 1) _referralBonus = 15 ether;
        /** Calculate client's commission and deduct from referralBonus */
        uint256 _clientCommission = mulDiv(_referralBonus, _commission, 100);
        _referralBonus -= _clientCommission;
        /** Update totalEarnedBonus by each referrer for reference in future */
        users[_referrer].totalReferralBonusEarned += uint152(_referralBonus);
        /** send referralBonus to referrer till 15 level, and
         *  send commission to client's wallet */
        token.transfer(_referrer, _referralBonus);
        token.transfer(_firstId, _clientCommission);

        emit ReferralBonus(_referrer, _referralBonus);
    }

    /***
     * @function mulDiv
     * @param value
     * @param percentage
     * @param denominator
     */
    function mulDiv(
        uint256 value,
        uint256 percentage,
        uint256 denominator
    ) public pure returns (uint256) {
        return (value * percentage) / denominator;
    }

    /***
     * @function _placeInGlobalPool
     * @param address _referredUser (Referred by _referrer)
     * @param address _referrer
     * @param uint256 _placeCount (User placed at which position in global pool in each user tree)
     */
    function _placeInGlobalPool(
        address _referredUser,
        address _referrer,
        uint256 _poolCount
    ) private {
        uint112 _placeCount = uint112(0);

        if (_referredUser != _referrer) {
            _addReferredUserToGlobalPool(
                _referredUser,
                _referrer,
                uint96(_poolCount)
            );

            for (
                uint112 i = globalPools[_referrer][_poolCount].placeCount;
                i >= 1;
                i = (i - 1) / 2
            ) {
                if (i != globalPools[_referrer][_poolCount].placeCount) {
                    _placeCount = i;
                }
            }

            address _nextRef = globalPools[_referrer][_poolCount]
                .lastUserPlaced[_placeCount];

            if ((_referredUser == _nextRef) || (_nextRef == address(0))) {
                uint ind = 0;
                address distributionAddress = address(0);

                for (
                    uint a = globalPools[_firstId][_poolCount].placeCount;
                    a > 0;
                    a = (a - 1) / 2
                ) {
                    distributionAddress = address(0);
                    if (_poolCount > 1 && ind < 4) {
                        distributionAddress = poolUsers[_poolCount][
                            (a - 1) / 2
                        ];
                    } else if (_poolCount == 1 && ind < 2) {
                        distributionAddress = poolUsers[_poolCount][
                            (a - 1) / 2
                        ];
                    }

                    if (distributionAddress != address(0))
                        _distributeGlobalFunds(distributionAddress, _poolCount);

                    ind = ind + 1;
                }

                return;
            }

            _placeInGlobalPool(_referredUser, _nextRef, _poolCount);
        }
    }

    /***
     * @function _distributeGlobalFunds
     * @param addressdistributionAddress (down to top addresses)
     * @param uint _poolCount (Number of pools count)
     */
    function _distributeGlobalFunds(
        address distributionAddress,
        uint256 _poolCount
    ) private {
        uint _amount = uint(0);
        uint _clientCommission = uint(0);
        GlobalPool storage globalUser = globalPools[distributionAddress][_poolCount];

        if (_poolCount == 1) {
            if (globalUser.currentLevel == 1) {
                _amount = 2 ether;
                _clientCommission = mulDiv(_amount, _commission, 100);
                _amount -= _clientCommission;

                token.transfer(distributionAddress, _amount);
                token.transfer(_firstId, _clientCommission);
            }
        } else {
            if (
                (globalUser.currentLevel == 1) ||
                (globalUser.currentLevel == 2) ||
                (globalUser.currentLevel == 3)
            ) {
                _amount = 2 ether;
                _clientCommission = mulDiv(_amount, _commission, 100);
                _amount -= _clientCommission;

                token.transfer(distributionAddress, _amount);
                token.transfer(_firstId, _clientCommission);
            
            } else if (globalUser.currentLevel == 4) {
                if (globalUser.placeCount < 29) {
                    _amount = 6 ether;
                    _clientCommission = mulDiv(_amount, _commission, 100);
                    _amount -= _clientCommission;

                    token.transfer(distributionAddress, _amount);
                    token.transfer(_firstId, _clientCommission);
                }
            }
        }

        emit GlobalBonus(distributionAddress, _amount, _poolCount);
        emit GlobalBonus(_firstId, _clientCommission, _poolCount);
    }

    /***
     * @function _addReferredUserToGlobalPool
     * @param GlobalPool storage globalUser (Info of _referrer)
     * @param address _referredUser (Referred by _referrer)
     * @param address _referrer
     * @dev called function inside _placeInGlobalPool
     */
    function _addReferredUserToGlobalPool(
        address _referredUser,
        address _referrer,
        uint96 _poolCount
    ) private {
        uint192 _maxPositionsInEachLevel = uint192(
            2 ** globalPools[_referrer][_poolCount].currentLevel
        );

        uint32 _maxGlobalLevelDepth = _poolCount == 1 ? 2 : 4;

        if (
            globalPools[_referrer][_poolCount].lastPlacedPosition <
            _maxPositionsInEachLevel
        ) {
            /** By default, increment level position */
            globalPools[_referrer][_poolCount].lastPlacedPosition += 1;
        } else {
            globalPools[_referrer][_poolCount].currentLevel += 1;
            globalPools[_referrer][_poolCount].lastPlacedPosition = 1;
        }
        /** Reset level and Positions according to the fulfilment of place */
        if (
            globalPools[_referrer][_poolCount].lastPlacedPosition ==
            _maxPositionsInEachLevel
        ) {
            _pushToNextLevel(_maxGlobalLevelDepth, _referrer, _poolCount);
        }

        globalPools[_referrer][_poolCount].placeCount += 1;
        globalPools[_referrer][_poolCount].lastUserPlaced[
            globalPools[_referrer][_poolCount].placeCount
        ] = _referredUser;

        emit PutToGlobalPool(_poolCount, _referredUser, _referrer);
        emit LinkedToGlobalPool(
            globalPools[_referrer][_poolCount].currentLevel,
            globalPools[_referrer][_poolCount].lastPlacedPosition,
            _poolCount
        );
    }

    /***
     * @function _pushToNextLevel
     * @param globalUser (info of global _refferrer)
     * @param address _referrer
     * @param uint256 _maxLevelSize
     */
    function _pushToNextLevel(
        uint256 _maxLevelSize,
        address _referrer,
        uint96 _poolCount
    ) private {
        if (
            (globalPools[_referrer][_poolCount].currentLevel == _maxLevelSize)
        ) {
            _poolCount += 1;
            globalPools[_referrer][_poolCount].poolCount = uint64(_poolCount);
            globalPools[_referrer][_poolCount].currentLevel = 1;
            if (
                globalPools[_referrer][_poolCount - 1].isShiftedToNextPool ==
                false
            ) {
                globalPools[_referrer][_poolCount - 1]
                    .isShiftedToNextPool = true;
                poolUsers[_poolCount].push(_referrer);
                _placeInGlobalPool(_referrer, _firstId, _poolCount);
            }
        }
    }

    /***
     * @function withdrawLeftBalance
     * @param address _user
     * @notice only hit by owner, if there is any balance will get withdraw
     */
    function withdrawLeftBalance(address _user) public onlyOwner nonReentrant {
        uint256 _value = token.balanceOf(address(this));
        if (_value > 0) {
            token.transfer(_user, _value);
            emit WithdrawBalance(_user, _value, block.timestamp);
        }
    }
}