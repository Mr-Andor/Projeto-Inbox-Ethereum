const path = require('path');
const fs = require('fs');
const solc = require('solc');
 
const filePath = path.resolve(__dirname, 'contract', 'Inbox.sol');
const source = fs.readFileSync(filePath, 'utf8');
 
const compilerInput = {
    language: 'Solidity',
    sources: {
        'Inbox': {
            content: fs.readFileSync(filePath, 'utf8')
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [
                    'abi',
                    'evm.bytecode' //evm = ethereum virtual machine
                ]
            }
        }
    }
};
 
const compiledContract = JSON.parse(solc.compile(JSON.stringify(compilerInput)));
if (compiledContract.errors) {
    compiledContract.errors.forEach(err => console.log(err.formattedMessage));
}
 
const contract = compiledContract.contracts['Inbox'].Inbox;
// console.log(contract);
const abi = contract.abi;
const bytecodeObject = contract.evm.bytecode.object;
fs.writeFileSync('gen/abi.json', JSON.stringify(abi, null, 2));
fs.writeFileSync('gen/bytecode.bin', bytecodeObject);
 
// Also export them in case you want to require this file
exports.abi = abi;
exports.bytecodeObject = bytecodeObject;