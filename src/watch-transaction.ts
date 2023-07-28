import Arweave from "arweave";
import { retrieveArguments } from "./utils";
import { TransactionStatusResponse } from "arweave/node/transactions";

async function watchTransaction() {
    // #1 get the transaction id to watch for from the command line
    const transactionId = retrieveArguments()[0];

    // #2 initialize Arweave
    const arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https'
    });

    // #3 watch for the transaction status
    let status: TransactionStatusResponse = {
        status: 0,
        confirmed: null
    }
    while (status.status !== 200 || status.confirmed === null || status.confirmed.number_of_confirmations < 5) {
        status = await arweave.transactions.getStatus(transactionId);
        console.log(status);
        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    console.log("TRANSACTION CONFIRMED!");
}

watchTransaction();