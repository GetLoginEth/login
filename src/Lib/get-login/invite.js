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

    async createInvite(sendBalance = '0.1') {
        const {web3} = this.crypto;

        this.log(INVITE_CREATE_WALLET);
        const wallet = createWallet(web3);

        this.log(INVITE_REGISTER_WALLET);
        await this.contract.createInvite(wallet.address, sendBalance);

        return wallet;
    }
}
