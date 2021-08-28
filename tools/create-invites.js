const {ethers, providers} = require('ethers');
const fs = require("fs");
require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY;
const tokenAddress = process.env.TOKEN_ADDRESS;
const dataStorage = JSON.parse(fs.readFileSync('../src/smart/build/contracts/GetLoginStorage.json'));
const logicStorage = JSON.parse(fs.readFileSync('../src/smart/build/contracts/GetLoginLogic.json'));
const tokenData = JSON.parse(fs.readFileSync('../src/smart-bzz/build/contracts/Token.json'));

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
const bzzInstance = new ethers.Contract(tokenAddress, tokenData.abi, signer);

const ethInviteHuman = '0.03'; // in reality poa ~0.007 (without bzz transfer and without session creation)
// 0.01 for FD session balance + FD session creation price??? + ~0.007 to signup without invite + bzz transfer to session price
const bzzInviteSumHuman = '0.1';
const ethInvite = ethers.utils.parseEther(ethInviteHuman);
const bzzInviteSum = ethers.utils.parseUnits(bzzInviteSumHuman, 16);

async function run() {
    let estimateGasLimit;
    let ethBalance;
    let bzzBalance;

    console.log('chainId', chainId);
    console.log('Signer address', signer.address);
    ethBalance = await signer.getBalance();
    bzzBalance = await bzzInstance.balanceOf(signer.address);
    console.log('Signer ETH/xDai balance', ethers.utils.formatUnits(ethBalance));
    console.log('Signer BZZ/testBZZ balance', ethers.utils.formatUnits(bzzBalance, 16));
    console.log('dataAddress', dataAddress);
    console.log('logicAddress', logicAddress);

    console.log('Getting gas price...');
    const gasPrice = await provider.getGasPrice();
    console.log('gasPrice', gasPrice.toString());
    console.log('Getting logic address...');
    // logicAddress = await dataContractInstance.logicAddress();
    /**
     *
     * @type {ethers.Contract | R}
     */
    const logicContractInstance = new ethers.Contract(logicAddress, logicStorage.abi, signer);

    const addresses = [
        '0x52D974Bf887e8A26bACFA39c73E61c35A4299065',
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
        // '0xC648bC79eE66bb92A5E43E8Aa3D98f830a31fb8d'
    ];
    const txParams = {
        // todo calc sum for each invite
        value: ethInvite,
        gasPrice: gasPrice
    };

    console.log('Calc estimate gasLimit');
    estimateGasLimit = await logicContractInstance.estimateGas.createInvite(addresses, txParams);
    console.log('estimateGasLimit', estimateGasLimit.toString());

    try {
        console.log('Creating invites...', ethInviteHuman, ethInvite.toString());
        const invites = await logicContractInstance.createInvite(addresses, {
            ...txParams,
            gasLimit: estimateGasLimit
        });

        console.log('Tx sent. Hash', invites.hash);
        const result = await invites.wait();

        // todo this loop isn't ok for mass tx (too slow). Use SWARM practice to send mass ERC20 txs
        for (let i = 0; i < addresses.length; i++) {
            const address = addresses[i];
            console.log(`Approve ${bzzInviteSumHuman} BZZ for ${address}...`);
            let tx = await bzzInstance.approve(address, bzzInviteSum);
            await tx.wait();
            console.log(`Send ${bzzInviteSumHuman} BZZ to ${address}...`);
            tx = await bzzInstance.transfer(address, bzzInviteSum);
            await tx.wait();
        }
        console.log('Complete!');
    } catch (e) {
        console.log('Error while waiting', e);
    }
}

run().then();
