const fs = require('fs');
const path = require('path');

// Function to remove Solidity metadata (identified by the 0xa264 marker)
function removeMetadata(bytecode) {
    const metadataStart = bytecode.indexOf('a264'); // Find the starting point of metadata (0xa264)
    return metadataStart !== -1 ? bytecode.slice(0, metadataStart) : bytecode;
}

// Read the on-chain bytecode (replace this with your actual on-chain bytecode)
const onChainBytecode = '0x6080604052348015600f57600080fd5b506004361060325760003560e01c806324fb21db146037578063b0c3d4fe146051575b600080fd5b603f60005481565b60405190815260200160405180910390f35b603f605c3660046062565b60081b90565b600060208284031215607357600080fd5b503591905056fea26469706673582212202e32d52aa432896ece54086bc7e1027a534652f9012d098f306fb0da66fa810a64736f6c634300081b0033';

// Read the local bytecode from the compiled artifact
const artifactPath = path.join(__dirname, '../artifacts/contracts/bitwise.sol/BitwiseExample.json');
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const localBytecode = artifact.deployedBytecode || artifact.bytecode; // Use deployed bytecode or fallback to bytecode

// Remove metadata from both on-chain and local bytecodes
const onChainBytecodeNoMeta = removeMetadata(onChainBytecode);
const localBytecodeNoMeta = removeMetadata(localBytecode);

console.log('On-chain bytecode (no metadata):', onChainBytecodeNoMeta);
console.log('Local bytecode (no metadata):', localBytecodeNoMeta);

console.log('On-chain bytecode length (no metadata):', onChainBytecodeNoMeta.length);
console.log('Local bytecode length (no metadata):', localBytecodeNoMeta.length);

if (onChainBytecodeNoMeta === localBytecodeNoMeta) {
    console.log('Bytecodes match exactly when ignoring metadata!');
} else {
    console.log('Bytecodes do not match. Analyzing differences...');
    const firstDiff = findFirstDifference(onChainBytecodeNoMeta, localBytecodeNoMeta);
    console.log('First differing position:', firstDiff);
    console.log('On-chain bytecode around differing position:', onChainBytecodeNoMeta.slice(firstDiff - 10, firstDiff + 10));
    console.log('Local bytecode around differing position:', localBytecodeNoMeta.slice(firstDiff - 10, firstDiff + 10));
}

// Helper function to find the first differing position between two bytecodes
function findFirstDifference(str1, str2) {
    const minLength = Math.min(str1.length, str2.length);
    for (let i = 0; i < minLength; i++) {
        if (str1[i] !== str2[i]) {
            return i;
        }
    }
    return minLength;
}