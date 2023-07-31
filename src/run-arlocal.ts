import ArLocal from 'arlocal';
import Arweave from "arweave";
import { getArweaveKey } from './utils';

(async () => {
    const arLocal = new ArLocal();

    // Start is a Promise, we need to start it inside an async function.
    await arLocal.start();

    // Send funds to the wallet.
    const arweave = Arweave.init({
        host: '127.0.0.1',
        port: 1984,
        protocol: 'http'
    });

    const arweaveKey = getArweaveKey();

    const arweaveWallet = await arweave.wallets.jwkToAddress(arweaveKey);
    const walletAddress = await arweave.wallets.getAddress(arweaveKey);

    await arweave.api
          .get(
            `mint/${walletAddress}/1000000000000`
          )
          .catch((error) => console.error(error));
    

    const arweaveWalletBallance = await arweave.wallets.getBalance(arweaveWallet);

    console.log("AR Local started!");
    console.log("Wallet: " + arweaveWallet);
    console.log("Balance: " + arweaveWalletBallance);
})();