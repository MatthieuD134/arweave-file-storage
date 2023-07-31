# Arweave File Upload Methods

This repository contains scripts for uploading files to Arweave using different methods available. Arweave is a decentralized storage platform that allows you to store data on a permanent and decentralized blockchain.

## Prerequisites

Before running the scripts, make sure you have the following installed on your machine:

- Node.js (version 14 or higher)
- Yarn or NPM (Yarn is preferred)

## Installation

1. Clone this repository to your local machine.
2. Navigate to the repository directory using the terminal/command prompt.
3. Install the required dependencies by running the following command:

```bash
yarn install
```
or

```bash
npm install
```

## Usage

before running any command, be sure to build the project with the following command:

```bash
yarn build
```

### Running a Local Arweave Instance
To store a single file on Arweave, use the following command:

```bash
yarn run-arlocal
```

This command will start a local Arweave node using arlocal. It will also send funds to the wallet associated with your Arweave key, allowing you to perform test transactions on the local instance.

### 1. Storing a Single File to Arweave

To store a single file on Arweave, use the following command:

```bash
yarn store-file <path_to_file> [--local] 
```

Replace <path_to_file> with the path to the file you want to upload.

The '--local' flag is an optional flag that can be used with this command. When this flag is present, the script will use the local Arweave instance started by arlocal instead of interacting with the main Arweave network. This is useful for testing and development purposes, as it allows you to perform transactions on your local instance without incurring actual costs on the main network.

### 2. Storing Multiple Files as a Bundle to Arweave

To store multiple files as a bundle on Arweave, use the following command:

```bash
yarn store-bundle [--local] <path_to_file1> <path_to_file2> ... <path_to_fileN>
```

Replace <path_to_file1>, <path_to_file2>, etc., with the paths to the files you want to include in the bundle. The minimum number of files required for a bundle is two.

### 3. Using Bundlr to Store a Single File to Arweave
To store a single file on Arweave using the Bundlr library, use the following command:

```bash
yarn bundlr-store-file <path_to_file>
```
Replace <path_to_file> with the path to the file you want to upload.

### 4. Using Bundlr to Store a Bundle to Arweave
To store multiple files as a bundle on Arweave using the Bundlr library, use the following command:

```bash
yarn bundlr-store-bundle <path_to_file1> <path_to_file2> ... <path_to_fileN>
```
Replace <path_to_file1>, <path_to_file2>, etc., with the paths to the files you want to include in the bundle. The minimum number of files required for a bundle is two.

### 5. Watching Transaction Status
To watch the status of a transaction on Arweave, use the following command:

```bash
yarn watch-tx <transaction_id>
```
Replace <transaction_id> with the ID of the transaction you want to monitor.

### 6. Generating a New Arweave Key Pair
To generate a new Arweave key pair, use the following command:

```bash
yarn generate-key
```

### 7. Getting the Public Address of an Arweave Key
To get the public address associated with an Arweave key, use the following command:

```bash
yarn get-public-key
```

## Configuration
Before running the scripts that interact with Arweave, make sure to configure your Arweave key by setting the ARWEAVE_KEY environment variable. You can do this by creating a .env file in the root of this repository and adding the following content:

```makefile
ARWEAVE_KEY=<your_arweave_key>
```
Replace <your_arweave_key> with your actual Arweave key in JSON format.

## Dependencies

The following dependencies are used in this repository:

- @bundlr-network/client: The Bundlr client library for interacting with Arweave nodes.
- arbundles: A library for creating bundles and signing data on Arweave.
- dotenv: For loading environment variables from the .env file.
- mime: For determining the MIME type of files.
- arweave: The Arweave SDK for interacting with the Arweave blockchain.
- arlocal: A tool for running a local Arweave instance for testing and development purposes.

## License
This repository is licensed under the MIT License. Feel free to use and modify the code as needed.

## Disclaimer
Please use these scripts responsibly and ensure that you have the necessary permissions to upload files to Arweave. Be aware of any costs associated with transactions on the Arweave blockchain. The authors of this repository are not responsible for any misuse or damages caused by using these scripts.