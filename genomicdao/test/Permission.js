const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AccessController", async function () {
    async function deployAccessControlFixture() {
        const [owner, addr1, addr2, addr3] = await ethers.getSigners();

        const accessController = await ethers.deployContract("$AccessControl");
        const docId1 = "doc1";
        if (await accessController.connect(owner).verifyOwner(docId1) === false) {
            await accessController.connect(owner).$registerDoc(docId1);
        }

        return { accessController, owner, addr1, addr2, addr3}
    }

    it('should allow owner access', async function () {
        const {accessController, owner, addr1, addr2} = await loadFixture(deployAccessControlFixture);

        const docId1 = "doc1";

        expect(await accessController.verifyAccess(owner.address, docId1)).to.equal(true);
    });

    it('should allow shared access', async function () {
        const { accessController, owner, addr1, addr2, addr3} = await loadFixture(deployAccessControlFixture);
        const docId1 = "doc1";
        await accessController.connect(owner).grantAccess(addr3.address, docId1);
        expect(await accessController.verifyAccess(addr3.address, docId1)).to.equal(true);
    });


    it('should not allow access without granted', async function () {
        const {accessController, owner, addr1 , addr2} = await loadFixture(deployAccessControlFixture);

        const docId1 = "doc1";

        expect(await accessController.verifyAccess(addr2.address, docId1)).to.equal(false);
    });
});

