import fs from "fs";
import { getArweaveKey, retrieveArguments } from "./utils";
import Arweave from "arweave";
import mime from 'mime';

async function storeFiles() {
    // #1 retrieve all files/folders to store, from the arguments passed in command line
    const files = retrieveArguments();

    if (files.length === 0) {
        console.error('No file to store');
        process.exit(1);
    }
    
    // #2 check that all files or folder exist
    const bufferArray = files.map((file) => {
        try {
            return fs.readFileSync(file);
        } catch (err) {
            console.error(`Could not find file: ${file}`);
            process.exit(1);
        }
    });

    // get the type for all files
    const bufferTypes = files.map((file) => {
        const type = mime.getType(file);
        if (type === null) {
            console.error(`Could not find type for file: ${file}`);
            process.exit(1);
        }
        return type;
    });

    // #3 Make a connection to Arweave server; following standard example.
    const arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https'
      });

    // #4 Load our key from the .env file
    const arweaveKey = getArweaveKey();

    // #4 Check out wallet balance. We should probably fail if too low? 
    const arweaveWallet = await arweave.wallets.jwkToAddress(arweaveKey);
    const arweaveWalletBallance = await arweave.wallets.getBalance(arweaveWallet);

    console.log("Wallet: " + arweaveWallet);
    console.log("Balance: " + arweaveWalletBallance);

    // #5 Core flow: create a transaction, upload and wait for the status!
    const uriArray = await Promise.all(bufferArray.map(async (buffer, index) => {
        const transaction = await arweave.createTransaction({
            data: buffer,
        }, arweaveKey);

        transaction.addTag('Content-Type', bufferTypes[index]);

        await arweave.transactions.sign(transaction, arweaveKey);
        const response = await arweave.transactions.post(transaction);
        const status = await arweave.transactions.getStatus(transaction.id)
        if (status.status !== 200 || status.confirmed === null || status.confirmed.number_of_confirmations === 0) {
            console.error(`Transaction ${transaction.id} failed with status code ${status.status}`)
            process.exit(1);
        }
        console.log(`Completed transaction ${transaction.id} with status code ${status.status} and ${status.confirmed.number_of_confirmations} confirmations`)
        console.log(`https://www.arweave.net/${transaction.id}?ext=${mime.getExtension(bufferTypes[index])}`)

        return `https://www.arweave.net/${transaction.id}?ext=${mime.getExtension(bufferTypes[index])}`;
    }));

    return uriArray;
}

storeFiles().then((res) => {console.log("Done!", res)});