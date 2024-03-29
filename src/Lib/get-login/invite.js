import Logger from "./logger";
import {createWallet} from "./utils";

const {ethers} = require('ethers');

export const INVITE_CREATE_WALLET = 'invite_create_wallet';
export const INVITE_REGISTER_WALLET = 'invite_register_wallet';
export const INVITE_ALLOW_BZZ = 'invite_allow_bzz';
export const INVITE_TRANSFER_BZZ = 'invite_transfer_bzz';

export default class Invite extends Logger {
    constructor(crypto, contract, tokenContract) {
        super();

        /**
         *
         * @type {crypto}
         */
        this.crypto = crypto;

        /**
         *
         * @type {contract}
         */
        this.contract = contract;

        /**
         * @type {Contract}
         */
        this.tokenContract = tokenContract;
    }

    setTokenContract(tokenContract) {
        this.tokenContract = tokenContract;
    }

    async getInviteInfo(invitePrivateKey, changePasswordInstance = null) {
        const account = await this.crypto.getAccountFromInvite(invitePrivateKey);
        const data = await this.contract.getInvite(account.address);
        const isInviteReset = await this.contract.getInviteReset(data.registeredUsername);
        data.isPossibleToRecover = false;
        data.balanceEth = this.crypto.web3.utils.fromWei(await this.crypto.web3.eth.getBalance(account.address));
        // todo G1 - commented because Revert error
        // if (changePasswordInstance) {
        //     data.recoveryPriceEth = await changePasswordInstance.getEstimatePriceResetPassword(invitePrivateKey);
        // }
        data.recoveryPriceEth = '0.001';

        if (isInviteReset) {
            data.isPossibleToRecover = !data.isActive && data.registeredUsername !== '0x0000000000000000000000000000000000000000000000000000000000000000';
        }

        return data;
    }

    /**
     * Create one invite with ETH + BZZ
     * @param sendBalance
     * @param sendBzz
     * @returns {Promise<Account>}
     */
    async createInvite(sendBalance = '0.1', sendBzz = '0') {
        sendBalance = sendBalance.toString();
        const {web3} = this.crypto;

        this.log(INVITE_CREATE_WALLET);
        const wallet = createWallet(web3);

        this.log(INVITE_REGISTER_WALLET);
        let tx = await this.contract.createInvites([wallet.address], sendBalance);

        // todo validate with BN. parseFloat isn't correct for all numbers, but in most it is OK
        if (parseFloat(sendBzz) > 0) {
            const amount = ethers.utils.parseUnits(sendBzz, 16);
            this.log(INVITE_ALLOW_BZZ);
            tx = await this.tokenContract.approve(wallet.address, amount);
            await tx.wait();

            this.log(INVITE_TRANSFER_BZZ);
            await this.tokenContract.transfer(wallet.address, amount);
            await tx.wait();
        }

        return wallet;
    }

    async getPrice() {
        const {web3} = this.crypto;

        const newDecryptedWallet = createWallet(web3);
        let data = await this.contract.prepareTx('createInvite',
            {...this.contract.sendTxDefault, balanceEther: 'all'},
            newDecryptedWallet.address);

        return web3.utils.fromWei(await this.contract.calculateEstimateGas(data));
    }
}
