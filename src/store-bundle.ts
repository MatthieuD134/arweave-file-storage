import fs from "fs";
import { getArweaveKey, retrieveArguments } from "./utils";
import mime from 'mime';
import { Arweave, ArweaveSigner, bundleAndSignData, createData } from "arbundles";

async function storeBundle() {
    // #1 retrieve all files/folders to store, from the arguments passed in command line
    const argv = retrieveArguments();
    const files = argv._;
    
    if (files.length === 0) {
        console.error('No file to store');
        process.exit(1);
    }

    if (files.length === 1) {
        console.error('Cannot create bundle with only one file');
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
    const arweave = Arweave.init(
        argv.local ? {
            host: '127.0.0.1',
            port: 1984,
            protocol: 'http'
        }: {
            host: 'arweave.net',
            port: 443,
            protocol: 'https'
      });

    // #4 Load our key from the .env file
    const arweaveKey = getArweaveKey();
    const signer = new ArweaveSigner(arweaveKey);

    // #4 Check out wallet balance. We should probably fail if too low? 
    const arweaveWallet = await arweave.wallets.jwkToAddress(arweaveKey);
    const arweaveWalletBallance = await arweave.wallets.getBalance(arweaveWallet);

    console.log("Wallet: " + arweaveWallet);
    console.log("Balance: " + arweaveWalletBallance);

    // #5 Create a bundle
    const bundle = await bundleAndSignData(
        bufferArray.map((buffer,index) => createData(
            buffer,
            signer, 
            {
                tags: [
                    { name: "App-Name", value: "ans104-tests" },
                    { name: "Content-Type", value: bufferTypes[index] }
                ]
            }
        )),
        signer
    );

    // #6 Create a transaction for the bundle
    const transaction = await bundle.toTransaction(
        {},
        arweave,
        arweaveKey
    );

    await arweave.transactions.sign(transaction, arweaveKey);

    const response = await arweave.transactions.post(transaction);

    if (response.status === 400) {
        console.error("Transaction failed");
        console.log(response);
        process.exit(1);
    }

    console.log("Transaction sent: " + response.status);
    console.log("Transaction ID: " + transaction.id);
}

storeBundle();