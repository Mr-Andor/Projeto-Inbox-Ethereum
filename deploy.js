const fs = require('fs');
const path = require('path');
 
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
 
//const {abi, bytecodeObject} = require('../compile');
const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'gen', 'abi.json')));
const bytecodeObject = fs.readFileSync(path.resolve(__dirname, 'gen', 'bytecode.bin'));
 
const provider = new HDWalletProvider(
    'soul shell blush dilemma exchange toy network album stamp debate prefer odor',  //PRECISA INSERIR SEU MNEMONICO AQUI
    'https://rinkeby.infura.io/v3/125d264629a74ac891762b10f196c1b6'
);
 
const web3 = new Web3(provider);
 
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
 
    const result = await new web3.eth.Contract(abi)
    .deploy({ data: '0x' + bytecodeObject, arguments: ['Hello world!'] }) // add 0x bytecode
    .send({ from: accounts[0] }); // remove 'gas'
 
    console.log('Contract deployed to', result.options.address);
}
 
deploy();