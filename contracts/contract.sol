// contracts/MyContract.sol
pragma solidity ^0.8.27;

contract MyContract {
    uint public value;

    constructor(uint _value) {
        value = _value;
    }
}