var PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-67ecdaa8-02df-46ef-b5d8-ffee960babef',
    subscribeKey: 'sub-c-977a2210-426a-11ea-afe9-722fee0ed680',
    secretKey: 'sec-c-NTM2MThmNTEtYzgyZC00MzY1LWJlNjMtNTQ0YmQ5NmIxYjBm',
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN:'BLOCKCHAIN'
};

class PubSub {
    constructor({blockchain}) {
        this.blockchain = blockchain;

        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    listener(){
        return{
            message:(messageObject)=>{
                const {channel , message} = messageObject;

                const parsedMessage = JSON.parse(message);

                if(channel === CHANNELS.BLOCKCHAIN){
                    this.blockchain.replaceChain(parsedMessage);
                }

                console.log(`Message Recieved. Channel : ${channel} . Message: ${message}`);
            }
        }
    }

    publish({channel,message}){
        this.pubnub.unsubscribe({channels:[channel]},()=>{
            this.pubnub.publish({channel,message},()=>{
                this.pubnub.subscribe({channels:[channel]})
            });
        });
        
    }

    broadcastChain(){
        this.publish({channel:CHANNELS.BLOCKCHAIN,message:JSON.stringify(this.blockchain.chain)});
    }
}

module.exports = PubSub;