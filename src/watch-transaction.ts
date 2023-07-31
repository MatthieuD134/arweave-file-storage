import Arweave from "arweave";
import { retrieveArguments } from "./utils";
import { TransactionStatusResponse } from "arweave/node/transactions";

async function watchTransaction() {
    // #1 get the transaction id to watch for from the command line
    const argv = retrieveArguments();
    const transactionId = argv._[0];

    // #2 initialize Arweave
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