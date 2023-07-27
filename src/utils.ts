import { JWKInterface } from "arweave/node/lib/wallet";
import * as dotenv from 'dotenv';

dotenv.config();

export function retrieveArguments() {
    return process.argv.slice(2);
}

export function getArweaveKey() {
    // get key from env variable, with dotenv
    const key = process.env.ARWEAVE_KEY!;
    return JSON.parse(key) as JWKInterface;
}