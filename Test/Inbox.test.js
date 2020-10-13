require('events').EventEmitter.defaultMaxListeners = 15;
 
const assert = require('assert'); //requisita o módulo de assert
const fs = require('fs'); //FileSystem, path, etc...
const path = require('path');
 
const ganache = require('ganache-cli'); 
const Web3 = require('web3'); 
const web3 = new Web3(ganache.provider());
 
const {abi, bytecodeObject} = require('../compile');
 
const INITIAL_MSG = 'Hello world!';
 
let accounts;
let inbox;
 
beforeEach(async () => { //beforeEach vai ser chamado antes de cada teste do describe, ele deve ser async pois deve esperar pelos contratos serem validados
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts(); //Carregamos conta pré-criadas com saldo para teste disponibilizadas e colocamos a referência disso em uma variável
 
    // Use one of these accounts to deploy the contract
    inbox = await new web3.eth.Contract(abi) //Começamos o deploy do contrato passando o abi.json como parâmetro de config
        .deploy({
            data: bytecodeObject,  //recebe a conta convertida em um bytecode
            arguments: [INITIAL_MSG], //recebe a mensagem como parâmetro para o construtor do contrato
        })
        .send({
            from: accounts[0], //seleciona a primeira conta do array
            gas: '1000000' // e define o custo da operação
        });
});
 
describe('Inbox', () => { //describe é uma coletânea de it
    it('deploys a contract', () => { //cada it é um teste 
        assert.ok(inbox.options.address); // Verifica se o contrato possui um endereço, isso é, foi deployado com sucesso
    });
 
    it('has a default message', async () => {
        const message = await inbox.methods.message().call(); //faz uma chamada para a função de get e assinala o valor dessa chamada em uma constante
        assert.strictEqual(message, INITIAL_MSG); // compara se o valor da constante é igual ao valor que quisemos assinalar
    });
 
    it('can change the message', async () => {
        await inbox.methods.setMessage('bye').send({ from: accounts[0] }); //realiza um set
        const message = await inbox.methods.message().call(); //assinalamos o get como valor de uma constante
        assert.strictEqual(message, 'bye'); // fazemos uma comparação com o valor de nosso set
    });
});