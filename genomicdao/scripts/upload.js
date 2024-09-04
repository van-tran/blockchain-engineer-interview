const { ethers, BigNumber } = require('hardhat');
// const { ethers } = require ("hardhat");
const abi = require("../artifacts/contracts/Controller.sol/Controller.json").abi;
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Provider
// const provider = new ethers.JsonRpcProvider(API_URL);
const controllerAddress = "0xE5FF0eaa2562d68E7DD1708D3aAd86B5Ed89Ecf5"

async function main() {


    // Provider
    const provider = new ethers.JsonRpcProvider(API_URL);

// Signer
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract
    const controllerContract = new ethers.Contract(controllerAddress, abi, signer);

    // try uploading doc
    const docId = "docx123456789";
    const response = await controllerContract.uploadData(docId);
    console.log("response:", JSON.stringify(response));

    const response2 = await controllerContract.getDoc(docId);
    console.log("response2: ", response2);

    // TODO : find library for JSON-RPC API
    // const sessionId = response.value;
    // console.log("Session ID:", sessionId);
    //
    //
    // await controllerContract.confirm(docId, "0x1234567890abcdef", "proof", sessionId, 2);
    //
    // const contentHash = await controllerContract.getDoc(docId);
    // console.log("Content Hash:", contentHash);

}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });