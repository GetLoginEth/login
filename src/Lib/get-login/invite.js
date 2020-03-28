import Logger from "./logger";
import {createWallet} from "./utils";

export const INVITE_CREATE_WALLET = 'invite_create_wallet';
export const INVITE_REGISTER_WALLET = 'invite_register_wallet';


export default class Invite extends Logger {
    constructor(crypto, contract) {
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
    }

    async getInviteInfo(invitePrivateKey) {
        const account = await this.crypto.getAccountFromInvite(invitePrivateKey);
        const data = await this.contract.getInvite(account.address);
        const isInviteReset = await this.contract.getInviteReset(data.registeredUsername);
        data.isPossibleToRecover = false;
        data.balanceEth = this.crypto.web3.utils.fromWei(await this.crypto.web3.eth.getBalance(account.address));
        if (isInviteReset) {
            data.isPossibleToRecover = !data.isActive && data.registeredUsername !== '0x0000000000000000000000000000000000000000000000000000000000000000';
        }

        return data;
    }

    /**
     *
     * @param sendBalance
     * @returns {Promise<Account>}
     */
    async createInvite(sendBalance = '0.1') {
        const {web3} = this.crypto;

        this.log(INVITE_CREATE_WALLET);
        const wallet = createWallet(web3);

        this.log(INVITE_REGISTER_WALLET);
        await this.contract.createInvite(wallet.address, sendBalance);

        return wallet;
    }
}
