var PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-444f3e79-ed36-4459-a797-74ccd8677ae1',
    subscribeKey: 'sub-c-04de9e8e-43ed-11ea-8383-962d7bb31541',
    secretKey: 'sec-c-MGFmYjNjYjAtNTU0Zi00OTg2LTk1ZjctNjljNzg4YTgwMmIz',
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({ blockchain, transactionPool,wallet }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;

        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    listener() {
        return {
            message: (messageObject) => {
                const { channel, message } = messageObject;

                const parsedMessage = JSON.parse(message);

                switch (channel) {
                    case CHANNELS.BLOCKCHAIN:
                        this.blockchain.replaceChain(parsedMessage,true,()=>{
                            this.transactionPool.clearBlockchainTransactions({
                                chain : parsedMessage
                            });
                        });
                        break;
                    case CHANNELS.TRANSACTION:
                        if(!this.transactionPool.existingTransaction({
                            inputAddress : this.wallet.publicKey
                        })){
                            this.transactionPool.setTransaction(parsedMessage);
                        }
                        break;
                    default:
                        return;
                }

                console.log(`Message Recieved. Channel : ${channel} . Message: ${message}`);
            }
        }
    }

    publish({ channel, message }) {
        this.pubnub.publish({ message, channel });
        // this.pubnub.unsubscribe({ channels: [channel] }, () => {
        //     this.pubnub.publish({ channel, message }, () => {
        //         this.pubnub.subscribe({ channels: [channel] })
        //     });
        // });

    }

    broadcastChain() {
        this.publish({ channel: CHANNELS.BLOCKCHAIN, message: JSON.stringify(this.blockchain.chain) });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

module.exports = PubSub;