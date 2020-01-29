const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });

        this.chain.push(newBlock)
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const { timestamp, lasthash, hash, data,nonce,difficulty } = chain[i];

            const actualLastHash = chain[i - 1].hash;

            const lastDifficulty = chain[i-1].difficulty;

            if (lasthash !== actualLastHash) {
                return false;
            }

            const validHash = cryptoHash(timestamp, lasthash, data,nonce,difficulty);

            if (hash !== validHash) {
                return false;
            }

            if(Math.abs(lastDifficulty-difficulty)>1){
                return false ;
            }

        }

        return true;
    }

    replaceChain(chain){
      if(chain.length <= this.chain.length){
          console.error('The incomming chain must be longer');
          return;
      }
      if(!Blockchain.isValidChain(chain)){
          console.error('The incoiming chain must be valid');
          return;
      }

      console.log('replacing chain with',chain);
      this.chain = chain;
    }

}

module.exports = Blockchain;