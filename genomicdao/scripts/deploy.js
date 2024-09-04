async function deploy() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const pcspToken = await ethers.getContractFactory("PostCovidStrokePrevention");
    const pcspTokenContract = await pcspToken.deploy();
    await pcspTokenContract.waitForDeployment();
    const pcspTokenAddress = await pcspTokenContract.getAddress();
    console.log("PostCovidStrokePrevention deployed to address:", pcspTokenAddress);

    const geneNFT = await ethers.getContractFactory("GeneNFT");
    const geneNFTContract = await geneNFT.deploy();
    await geneNFTContract.waitForDeployment();
    const geneNFTAddress = await geneNFTContract.getAddress();
    console.log("GeneNFT deployed to address:", geneNFTAddress);

    const controller = await ethers.getContractFactory("Controller");
    const controllerContract = await controller.deploy(geneNFTAddress, pcspTokenAddress);
    const controllerAddress = await controllerContract.getAddress();
    console.log("Controller deployed to address:", controllerAddress);

}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
