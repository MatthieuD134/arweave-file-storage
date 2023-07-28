import mime from "mime";
import { getArweaveKey, retrieveArguments } from "./utils";
import Bundlr from "@bundlr-network/client";


async function bundlrStoreFile() {
    // #1 retrieve single file, from the arguments passed in command line
    const file = retrieveArguments()[0];

    if (file === undefined) {
        console.error('No file to store');
        process.exit(1);
    }

    // #2 Add a custom tag that tells the gateway how to serve this file to a browser
    const type = mime.getType(file);
    if(type === null) {
        console.error(`Cannot determine the type of ${file}`);
        process.exit(1);
    }
    const tags = [{ name: "Content-Type", value: type }];

    // #3 retrieve arweave key
    const arweaveKey = getArweaveKey();

    // #4 connect to a bundlr node
    const bundlr = new Bundlr("https://node2.bundlr.network", "arweave", arweaveKey);

    // #5 store the file
    try {
        const response = await bundlr.uploadFile(file, { tags });
        console.log(`File uploaded ==> https://arweave.net/${response.id}`);
        console.log(response);
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}

bundlrStoreFile();