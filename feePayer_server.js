const Caver = require('caver-js');
const caver = new Caver('https://api.baobab.klaytn.net:8651');
const feePayerAddress = "FEEPAYER_ADDRESS";
const feePayerPrivateKey = "FEEPAYER_PRIVATEKEY";

// add fee payer account
caver.klay.accounts.wallet.add(feePayerPrivateKey, feePayerAddress);

var net = require('net');


feePayerSign = (senderRawTransaction, socket) => {
    // fee payer
    caver.klay.sendTransaction({
      senderRawTransaction: senderRawTransaction,
      feePayer: feePayerAddress,
    })
    .on('transactionHash', function(hash){
        console.log('transactionHash', hash);
    })
    .on('receipt', function(receipt){
        console.log('receipt', receipt);
        socket.write('Tx hash is '+ receipt.transactionHash);
        socket.write('Sender Tx hash is '+ receipt.senderTxHash);
    })
    .on('error', console.error); // If an out-of-gas error, the second parameter is the receipt.
}

var server = net.createServer(function(socket) {
    console.log('Client is connected ...');
    socket.write('This is fee delegating service');
    socket.write('Fee payer is ' + feePayerAddress);
    socket.on('data', function(data) {
        console.log('Received data from client:', data.toString());
        feePayerSign(data.toString(), socket);
    });
});

server.listen(1337, '127.0.0.1');
console.log('Fee delegate service started ...');