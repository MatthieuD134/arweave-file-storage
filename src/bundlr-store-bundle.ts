import Bundlr from "@bundlr-network/client";
import { getArweaveKey, retrieveArguments } from "./utils";
import fs from "fs";
import mime from "mime";
import { ArweaveSigner, bundleAndSignData, createData } from "arbundles";

async function bundlrStoreBundle() {
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

    // #3 retrieve arweave key
    const arweaveKey = getArweaveKey();
    const signer = new ArweaveSigner(arweaveKey);

    // #4 connect to a bundlr node
    const bundlr = new Bundlr("https://node2.bundlr.network", "arweave", arweaveKey);

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

    // #6 upload the bundle via bundlr
    try {
        const response = await bundlr.upload(
            bundle.getRaw(),
            {
                tags: [
                    { name: "Bundle-Format", value: "binary" },
                    { name: "Bundle-Version", value: "2.0.0" }
                ]
            }
        );
        console.log(`Data uploaded ==> https://arweave.net/${response.id}`);
        console.log(bundle.getIds().map((id, index) => ({ file: files[index], media: `https://arweave.net/${id}`})));
        console.log(response);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}

bundlrStoreBundle();