const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');

const provider = new Web3.providers.HttpProvider("http://localhost:8545")
const web3 = new Web3(provider);

web3.eth.getAccounts().then((accounts) => {
    const code = fs.readFileSync('Voting.sol').toString();
    const compiledCode = solc.compile(code);

    const byteCode = compiledCode.contracts[':Voting'].bytecode;
    const abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);

    const deployTransactionObject = {
        data: byteCode,
        from: accounts[0],
        gas: 4700000
    };

    let deployedContract;

    const MyContract = new web3.eth.Contract(abiDefinition, deployTransactionObject);

    MyContract.deploy({
        arguments: [[web3.utils.asciiToHex("bulma"),
        web3.utils.asciiToHex("vegeta"),
        web3.utils.asciiToHex("goku")]]
    })
        .send((err, hash) => {
            if (err)
                console.log("Error: " + err)
            else
                console.log("TX Hash: " + hash);
        })
        .then(result => {
            deployedContract = result;
            deployedContract.setProvider(provider);

        //     return deployedContract.methods
        //         .getList()
        //         .call();
        // })
        // .then(voteesList => {
        //     voteesList.map(votee => {
        //         console.log(votee + ' - ' + web3.utils.hexToAscii(votee));
        //     });
        })
        .then(() => {
            // console.log(deployedContract);
            
            return deployedContract.methods
                .totalVotesFor(web3.utils.asciiToHex('vegeta'))
                .call();
        })
        .then((result) => {
            console.log('Vegeta has ' + result);
        })
        .then(result => {
            return deployedContract.methods
                .voteForCandidate(web3.utils.asciiToHex("vegeta"))
                .send();
        })
        .then(() => {
            return deployedContract.methods
                .totalVotesFor(web3.utils.asciiToHex("vegeta"))
                .call();
        }).then(vegetaVoteResult => {
            console.log('Vegeta now has ' + vegetaVoteResult);
            // console.log(deployedContract);
        });
});