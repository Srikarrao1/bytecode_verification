const Web3 = require('web3');

// Create a new instance of Web3 with the HttpProvider
const web3 = new Web3(new Web3.providers.HttpProvider('https://gtc-dataseed.gtcscan.io'));



// Function to fetch contract address from a transaction hash
async function getContractAddressFromTxHash(txHash) {
    try {
        // Fetch the transaction receipt
        const receipt = await web3.eth.getTransactionReceipt(txHash);
        
        // Check if the transaction created a contract
        if (receipt && receipt.contractAddress) {
            console.log('Contract Address:', receipt.contractAddress);
            console.log('Transaction Data:', receipt.data);
            return receipt.contractAddress;
        } else {
            console.error('No contract address found for this transaction hash.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching transaction receipt:', error);
        return null;
    }
}

// Function to fetch on-chain bytecode
async function getOnChainBytecode(contractAddress) {
    try {
        // Fetch bytecode from the provided contract address
        const bytecode = await web3.eth.getCode(contractAddress);
        console.log('On-Chain Bytecode:', bytecode);
        return bytecode;
    } catch (error) {
        console.error('Error fetching on-chain bytecode:', error);
        return null;
    }
}

// Example: Replace with an actual transaction hash of a contract creation
const txHash = '0x68675cf30e7e0b8455b08b0bb362a3a47762d3ff8b005aa8885210bf3a366b22';  // Replace with an actual transaction hash

// Fetch the contract address from the transaction hash and then fetch the bytecode
getContractAddressFromTxHash(txHash).then(contractAddress => {
    if (contractAddress) {
        return getOnChainBytecode(contractAddress);
    }
}).catch(err => {
    console.error('Error:', err);
});

module.exports = { getContractAddressFromTxHash, getOnChainBytecode };