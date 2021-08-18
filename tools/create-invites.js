const {ethers, providers} = require('ethers');
const fs = require("fs");
require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY;
const dataStorage = JSON.parse(fs.readFileSync('../src/smart/build/contracts/GetLoginStorage.json'));
const logicStorage = JSON.parse(fs.readFileSync('../src/smart/build/contracts/GetLoginLogic.json'));

//https://sokol.poa.network
//77

//https://rpc.xdaichain.com/
//100


const chainId = 77;
const provider = new providers.JsonRpcProvider('https://sokol.poa.network');
// const chainId = 100;
// const provider = new providers.JsonRpcProvider('https://rpc.xdaichain.com');
const signer = new ethers.Wallet(privateKey).connect(provider);
const dataAddress = dataStorage.networks[chainId].address;
// const dataContractInstance = new ethers.Contract(dataAddress, dataStorage.abi, signer);
const logicAddress = logicStorage.networks[chainId].address;

const ethHumanPrice = '0.001';
const inviteEth = ethers.utils.parseEther(ethHumanPrice);

async function run() {
    let estimateGasLimit;

    console.log('chainId', chainId);
    console.log('Signer address', signer.address);
    console.log('dataAddress', dataAddress);
    console.log('logicAddress', logicAddress);

    console.log('Getting gas price...');
    const gasPrice = await provider.getGasPrice();
    console.log('gasPrice', gasPrice.toString());
    console.log('Getting logic address...');
    // logicAddress = await dataContractInstance.logicAddress();
    const logicContractInstance = new ethers.Contract(logicAddress, logicStorage.abi, signer);

    const addresses = [
        // '0x52D974Bf887e8A26bACFA39c73E61c35A4299065'
        // '0x80C7062a672585106aE963065BDc6bee60bC8830',
        // '0xE0325606237A4833222b3681a392e372Ec3cd1FF',
        // '0xb6209075afC93a824B6C7398e8fF19cD5248A884',
        // '0x90c3b13DA8a5bd92e08F3441F6D585F26276938d',
        // '0x7E82C2Fa0Bac7928D71C2759E3506F123B19f195',
        // '0x156B9f91F1971a8b7df69f9D7Db40Bfa03BB58aE',
        // '0x06149B798210433c4a1901dC23ff609D8F0Aa121',
        // '0x24060AB200341992F1dCdAE9122e29ecf4b7Aed6',
        // '0x2aF66982b9FdE574C59B5aa9074539Ba93B8199b',
        // '0xCAdf89166078720759041c593BB25BF0E225Fc12',
        // '0x1F40A39f561dC5064cf8a1dECc8E537E0847ac49',
        // '0x00796673A4f4440FD55ed32e3900262F49A4e859'
        '0xC648bC79eE66bb92A5E43E8Aa3D98f830a31fb8d'
    ];
    const txParams = {
        // todo calc sum for each invite
        value: inviteEth,
        gasPrice: gasPrice
    };

    console.log('Calc estimate gasLimit');
    estimateGasLimit = await logicContractInstance.estimateGas.createInvite(addresses, txParams);
    console.log('estimateGasLimit', estimateGasLimit.toString());

    try {
        console.log('Creating invites...', ethHumanPrice, inviteEth.toString());
        const invites = await logicContractInstance.createInvite(addresses, {
            ...txParams,
            gasLimit: estimateGasLimit
        });

        console.log('Tx sent. Hash', invites.hash);
        const result = await invites.wait();
        console.log('Complete!');
    } catch (e) {
        console.log('Error while waiting', e);
    }
}

run().then();
