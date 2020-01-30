var PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-bb3f4a89-fd23-4bb5-88be-31ff7a676691',
    subscribeKey: 'sub-c-2f1250d6-4368-11ea-84be-3662be881406',
    secretKey: 'sec-c-MzgzNGUxNDYtODk3MS00Mzk4LTg1ZjctYWFiYzY1OWUwZWZj',
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({ blockchain, transactionPool }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

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
                        this.blockchain.replaceChain(parsedMessage);
                        break;
                    case CHANNELS.TRANSACTION:
                        this.transactionPool.setTransaction(parsedMessage);
                        break;
                    default:
                        return;
                }

                console.log(`Message Recieved. Channel : ${channel} . Message: ${message}`);
            }
        }
    }

    publish({ channel, message }) {
        this.pubnub.unsubscribe({ channels: [channel] }, () => {
            this.pubnub.publish({ channel, message }, () => {
                this.pubnub.subscribe({ channels: [channel] })
            });
        });

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