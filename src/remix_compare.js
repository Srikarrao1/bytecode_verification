const { ethers } = require("ethers");
const path = require("path");
const fs = require("fs");
const keccak256 = require('keccak256');
const Web3 = require('web3');
const { Buffer } = require('node:buffer');


const remixBytecode = '0x608060405234801561001057600080fd5b50600436106100ea5760003560e01c806370a082311161008c578063a9059cbb11610066578063a9059cbb14610261578063d73dd62314610291578063dd62ed3e146102c1578063f2fde38b146102f1576100ea565b806370a08231146101f55780638da5cb5b1461022557806395d89b4114610243576100ea565b806323b872dd116100c857806323b872dd1461015b578063313ce5671461018b57806342966c68146101a957806366188463146101c5576100ea565b806306fdde03146100ef578063095ea7b31461010d57806318160ddd1461013d575b600080fd5b6100f761030d565b60405161010491906116fc565b60405180910390f35b610127600480360381019061012291906117b7565b61039b565b6040516101349190611812565b60405180910390f35b61014561048d565b604051610152919061183c565b60405180910390f35b61017560048036038101906101709190611857565b610493565b6040516101829190611812565b60405180910390f35b6101936108b7565b6040516101a0919061183c565b60405180910390f35b6101c360048036038101906101be91906118aa565b6108bd565b005b6101df60048036038101906101da91906117b7565b610bc5565b6040516101ec9190611812565b60405180910390f35b61020f600480360381019061020a91906118d7565b610e56565b60405161021c919061183c565b60405180910390f35b61022d610e9f565b60405161023a9190611913565b60405180910390f35b61024b610ec3565b60405161025891906116fc565b60405180910390f35b61027b600480360381019061027691906117b7565b610f51565b6040516102889190611812565b60405180910390f35b6102ab60048036038101906102a691906117b7565b6111dc565b6040516102b89190611812565b60405180910390f35b6102db60048036038101906102d6919061192e565b6113d8565b6040516102e8919061183c565b60405180910390f35b61030b600480360381019061030691906118d7565b61145f565b005b6004805461031a9061199d565b80601f01602080910402602001604051908101604052809291908181526020018280546103469061199d565b80156103935780601f1061036857610100808354040283529160200191610393565b820191906000526020600020905b81548152906001019060200180831161037657829003601f168201915b505050505081565b600081600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161047b919061183c565b60405180910390a36001905092915050565b60035481565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036104cd57600080fd5b600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482111561054f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161054690611a1a565b60405180910390fd5b600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482111561060e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060590611a86565b60405180910390fd5b61066082600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461161990919063ffffffff16565b600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506106f582600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461164090919063ffffffff16565b600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506107c782600260008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461161990919063ffffffff16565b600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516108a4919061183c565b60405180910390a3600190509392505050565b60065481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461094b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161094290611af2565b60405180910390fd5b600160008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548111156109ee576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109e590611b5e565b60405180910390fd5b610a58600160008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482611619565b600160008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610ac860035482611619565b60038190555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca582604051610b34919061183c565b60405180910390a2600073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610bba919061183c565b60405180910390a350565b600080600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905080831115610cd6576000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610d6a565b610ce9838261161990919063ffffffff16565b600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b8373ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051610e43919061183c565b60405180910390a3600191505092915050565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60058054610ed09061199d565b80601f0160208091040260200160405190810160405280929190818152602001828054610efc9061199d565b8015610f495780601f10610f1e57610100808354040283529160200191610f49565b820191906000526020600020905b815481529060010190602001808311610f2c57829003601f168201915b505050505081565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610fc1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fb890611bf0565b60405180910390fd5b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115611043576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161103a90611c82565b60405180910390fd5b61109582600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461161990919063ffffffff16565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061112a82600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461164090919063ffffffff16565b600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516111ca919061183c565b60405180910390a36001905092915050565b600061126d82600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461164090919063ffffffff16565b600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040516113c6919061183c565b60405180910390a36001905092915050565b6000600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146114ed576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114e490611af2565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361155c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161155390611d14565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008282111561162c5761162b611d34565b5b81836116389190611d92565b905092915050565b600080828461164f9190611dc6565b90508381101561166257611661611d34565b5b8091505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156116a657808201518184015260208101905061168b565b60008484015250505050565b6000601f19601f8301169050919050565b60006116ce8261166c565b6116d88185611677565b93506116e8818560208601611688565b6116f1816116b2565b840191505092915050565b6000602082019050818103600083015261171681846116c3565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061174e82611723565b9050919050565b61175e81611743565b811461176957600080fd5b50565b60008135905061177b81611755565b92915050565b6000819050919050565b61179481611781565b811461179f57600080fd5b50565b6000813590506117b18161178b565b92915050565b600080604083850312156117ce576117cd61171e565b5b60006117dc8582860161176c565b92505060206117ed858286016117a2565b9150509250929050565b60008115159050919050565b61180c816117f7565b82525050565b60006020820190506118276000830184611803565b92915050565b61183681611781565b82525050565b6000602082019050611851600083018461182d565b92915050565b6000806000606084860312156118705761186f61171e565b5b600061187e8682870161176c565b935050602061188f8682870161176c565b92505060406118a0868287016117a2565b9150509250925092565b6000602082840312156118c0576118bf61171e565b5b60006118ce848285016117a2565b91505092915050565b6000602082840312156118ed576118ec61171e565b5b60006118fb8482850161176c565b91505092915050565b61190d81611743565b82525050565b60006020820190506119286000830184611904565b92915050565b600080604083850312156119455761194461171e565b5b60006119538582860161176c565b92505060206119648582860161176c565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806119b557607f821691505b6020821081036119c8576119c761196e565b5b50919050565b7f4e6f7420656e6f7567682062616c616e63652000000000000000000000000000600082015250565b6000611a04601383611677565b9150611a0f826119ce565b602082019050919050565b60006020820190508181036000830152611a33816119f7565b9050919050565b7f616c6c6f77616e6365206e6f7420616374697661746520000000000000000000600082015250565b6000611a70601783611677565b9150611a7b82611a3a565b602082019050919050565b60006020820190508181036000830152611a9f81611a63565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000611adc602083611677565b9150611ae782611aa6565b602082019050919050565b60006020820190508181036000830152611b0b81611acf565b9050919050565b7f534b4f3a206275726e20616d6f756e7420657863656564732062616c616e6365600082015250565b6000611b48602083611677565b9150611b5382611b12565b602082019050919050565b60006020820190508181036000830152611b7781611b3b565b9050919050565b7f5374616e64617264546f6b656e3a207472616e7366657220746f20746865207a60008201527f65726f2061646472657373000000000000000000000000000000000000000000602082015250565b6000611bda602b83611677565b9150611be582611b7e565b604082019050919050565b60006020820190508181036000830152611c0981611bcd565b9050919050565b7f5374616e64617264546f6b656e3a207472616e7366657220616d6f756e74206560008201527f7863656564732062616c616e6365000000000000000000000000000000000000602082015250565b6000611c6c602e83611677565b9150611c7782611c10565b604082019050919050565b60006020820190508181036000830152611c9b81611c5f565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000611cfe602683611677565b9150611d0982611ca2565b604082019050919050565b60006020820190508181036000830152611d2d81611cf1565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611d9d82611781565b9150611da883611781565b9250828203905081811115611dc057611dbf611d63565b5b92915050565b6000611dd182611781565b9150611ddc83611781565b9250828201905080821115611df457611df3611d63565b5b9291505056fea264697066735822122061535e42909970c3cd6a2c311989a7ce2e50ec351b5a3a953b390f1dc3230d8e64736f6c63430008180033';

const abi = 
[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_symbol",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_decimals",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_supply",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "tokenOwner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "burner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Burn",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseApproval",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseApproval",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]


// Load the contract artifact
const artifactPath = path.join(__dirname, '../artifacts/contracts/srikar.sol/APS.json');
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const localBytecode = artifact.deployedBytecode || artifact.bytecode; 

// Function to extract function selectors from ABI
function extractFunctionSelectorsFromABI(abi) {
    return abi
        .filter(item => item.type === 'function')
        .map(fn => {
            const functionSignature = `${fn.name}(${fn.inputs.map(i => i.type).join(',')})`;
            const hash = keccak256(functionSignature); // Get the keccak256 hash
            
            // Get the first 4 bytes (8 hex chars) as selector
            return `0x${hash.slice(2, 10)}`; 
        });
}

// Function to extract function selectors from bytecode
function extractFunctionSelectorsFromBytecode(bytecode) {
    const selectors = [];
    const cleanBytecode = bytecode.replace(/^0x/, ''); 
    // Iterate over the bytecode to extract function selectors
    for (let i = 0; i < cleanBytecode.length; i += 64) { 
        const selector = cleanBytecode.slice(i, i + 8); 
        if (selector) {
            selectors.push(`0x${selector}`); 
        }
    }
    return selectors;
}

// Function to compare function selectors from ABI with bytecode
function compareSelectors(abiSelectors, bytecodeSelectors) {
    const unmatchedSelectors = abiSelectors.filter(sel => !bytecodeSelectors.includes(sel));
    return unmatchedSelectors.length === 0
        ? "All function selectors match between ABI and bytecode."
        : `Unmatched selectors: ${unmatchedSelectors.join(', ')}`;
}

// Step 1: Extract function selectors from ABI
const abiSelectors = extractFunctionSelectorsFromABI(artifact.abi);

// Step 2: Extract function selectors from local bytecode
const localBytecodeSelectors = extractFunctionSelectorsFromBytecode(localBytecode);

// Step 3: Extract function selectors from on-chain bytecode 
const onChainBytecodeSelectors = extractFunctionSelectorsFromBytecode(remixBytecode); 



// // Compare and log results
// console.log("Comparing Local Bytecode with ABI:");
let localresult = compareSelectors(abiSelectors, localBytecodeSelectors);

// console.log("Comparing On-Chain Bytecode with ABI:");
let onchainresult = compareSelectors(abiSelectors, onChainBytecodeSelectors);

if (localresult === onchainresult) {
    console.log("✔️ **Bytecode matched and verified successfully with function signatures**");
} else {
    console.log("✖️ **Bytecode match failed**");
}


console.log("Local Bytecode Selectors:", localBytecodeSelectors);
console.log("On-Chain Bytecode Selectors:", onChainBytecodeSelectors);
