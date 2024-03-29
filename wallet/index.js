const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');
const Transaction = require('./transaction');

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        this.keypair = ec.genKeyPair();

        this.publicKey = this.keypair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keypair.sign(cryptoHash(data));
    }

    createTransaction({ recipient, amount, chain }) {

        if (chain) {
            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey
            })
        }

        if (amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }


        return new Transaction({ senderWallet: this, recipient, amount });
    }

    static calculateBalance({ chain, address }) {
        let hasConductedTransaction = false;
        let outputsTotal = 0;

        for (let i = chain.length - 1; i > 0; i--) {
            const block = chain[i];

            for (let transaction of block.data) {
                const addressOutput = transaction.outputMap[address];

                if (transaction.input.address === address) {
                    hasConductedTransaction = true;
                }

                if (addressOutput) {
                    outputsTotal += addressOutput;
                }

            }

            if (hasConductedTransaction) {
                break;
            }

        }
        return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;
    }
}

module.exports = Wallet;