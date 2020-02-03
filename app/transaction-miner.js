const Transaction = require('../wallet/transaction');

class TransactionMiner {

    constructor({ blockchain, transactionPool, wallet, pubSub }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubSub;
    }

    mineTransactions() {
        //get the transaction pools valid transactions
        const validTransactions = this.transactionPool.validTransactions();

        //generate the miners reward
        validTransactions.push(
            Transaction.rewardTransaction({ minerWallet: this.wallet })
        );

        //add a block consisting of these transactions to the blockchain
        this.blockchain.addBlock({ data: validTransactions })

        //broadcast the updated blockchain
        this.pubsub.broadcastChain();

        //clear the pool
        this.transactionPool.clear();
    }
}

module.exports = TransactionMiner;