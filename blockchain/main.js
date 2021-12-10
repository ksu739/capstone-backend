const crypto = require('crypto');
class Block {
   constructor(index, data, prevHash) {
       this.index = index;
       this.timestamp = this.timestamp();
       this.data = data;
       this.prevHash = prevHash;
       this.hash=this.getHash();
   }

   timestamp() {
    var sampleTimestamp = Date.now(); 
    var date = new Date(sampleTimestamp);
    var year = date.getFullYear().toString().slice(-2); 
    var month = ("0" + (date.getMonth() + 1)).slice(-2); 
    var day = ("0" + date.getDate()).slice(-2); 
    var hour = ("0" + date.getHours()).slice(-2); 
    var minute = ("0" + date.getMinutes()).slice(-2); 
    var second = ("0" + date.getSeconds()).slice(-2); 
    var returnDate = year + "." + month + "." + day + ". " + hour + ":" + minute + ":" + second;
    return returnDate;
   }

   getHash() {
       var encript=JSON.stringify(this.data) + this.prevHash + this.index + this.timestamp;
       var hash=crypto.createHmac('sha256', "secret")
       .update(encript)
       .digest('hex');
       // 해시값 sha(JSON.stringify(this.data) + this.prevHash + this.index + this.timestamp);
       return hash;
   }
}


class BlockChain {
   constructor() {
       this.chain = [];
   }

   addBlock(data) {
       let index = this.chain.length;
       let prevHash = this.chain.length !== 0 ? this.chain[this.chain.length - 1].hash : 0;
       let block = new Block(index, data, prevHash);
       this.chain.push(block);
   }

   deleteBlock(data) {
    if (head == null) {
        console.log("삭제할 블록이 존재하지 않습니다.");
        }
    else {
        current = head;
        while (current.data != data) {
            current = current.next;
        }
        prevHash = current.prevHash;
        Hash = current.Hash;
        prevHash.Hash;
        Hash.prevHash;
        } 
    }    

   chainIsValid(){ //해시값 검사
           for(var i=0;i<this.chain.length;i++){
               if(this.chain[i].hash !== this.chain[i].getHash())
                   return false;
               if(i > 0 && this.chain[i].prevHash !== this.chain[i-1].hash)
                   return false;
           }
           return true;
       }
}


const BChain = new BlockChain();
BChain.addBlock({name: "홍지민", studentnum: 20194501, phone: "010-1234-5675"});
BChain.addBlock({name: "박세미", studentnum: 20194501, phone: "010-1234-5676"});
BChain.addBlock({name: "현다은", studentnum: 20194502, phone: "010-1234-5677"});
BChain.addBlock({name: "이원영", studentnum: 20194503, phone: "010-1234-5678"});
console.dir(BChain,{depth:null})


console.log("Validity of this blockchain: ", BChain.chainIsValid());

