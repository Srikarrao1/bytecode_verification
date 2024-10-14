const { ethers } = require('ethers');

// Connect to an Ethereum RPC provider
const provider = new ethers.JsonRpcProvider('https://gtc-dataseed.gtcscan.io');

// Function to calculate the constructor arguments length and extract them
async function calculateConstructorArgsLength(creationTx, constructorInputs) {
  let totalLength = 0;

  constructorInputs.forEach((input) => {
    if (input.type === 'uint256' || input.type === 'address' || input.type === 'bool') {
      // Fixed-length types: 32 bytes = 64 hex characters
      totalLength += 64;
    } else if (input.type === 'string' || input.type === 'bytes') {
      // Dynamic-length types:
      totalLength += 64; // Pointer (32 bytes)
      totalLength += 64; // Length field (32 bytes)
      totalLength += 64; // Minimum data length (32 bytes)
    }
  });

  // Extract the encoded constructor arguments from the creation transaction
  const encodedArgs = creationTx.slice(-totalLength);
  return encodedArgs;
}

// Function to fetch transaction data and extract constructor arguments
async function extractConstructorArgs(txHash, abi) {
  try {
    console.log(`Fetching transaction data for: ${txHash}`);

    // Fetch the transaction using its hash
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      console.error('Transaction not found!');
      return;
    }

    console.log('Transaction Data:', tx.data);

    // Extract encoded constructor arguments using the helper function
    const encodedArgs = await calculateConstructorArgsLength(tx.data, abi);

    console.log('Encoded Constructor Arguments:', encodedArgs);
    console.log(`Constructor Arguments Length: ${encodedArgs.length / 2} bytes`);

    return encodedArgs;
  } catch (error) {
    console.error('Error extracting constructor arguments:', error);
  }
}

// Example usage
(async () => {
  const txHash = '0x8946019549c6286678b39881c0440a33f9de4d6e19f33945d5a9e8c4f7b5f82d'; // Example transaction hash

  const abi = [
    { internalType: 'string', name: '_name', type: 'string' },
    { internalType: 'string', name: '_symbol', type: 'string' },
    { internalType: 'uint256', name: '_decimals', type: 'uint256' },
    { internalType: 'uint256', name: '_supply', type: 'uint256' },
    { internalType: 'address', name: 'tokenOwner', type: 'address' }
  ];

  await extractConstructorArgs(txHash, abi);
})();