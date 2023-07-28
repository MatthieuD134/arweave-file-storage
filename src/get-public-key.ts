import Arweave from 'arweave';
import { getArweaveKey } from './utils';

const arweave = Arweave.init({});

const wallet = getArweaveKey();

arweave.wallets.getAddress(wallet).then((address) => {
    console.log(address);
});
