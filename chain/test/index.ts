import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Auth, Auth__factory } from "../typechain";

describe("Auth", () => {
  let AuthFactory: Auth__factory;
  let auth: Auth;
  let addrs: Array<SignerWithAddress>;

  beforeEach(async () => {
    AuthFactory = await ethers.getContractFactory("Auth");
    auth = await AuthFactory.deploy();
    await auth.deployed();

    addrs = await ethers.getSigners();
  });

  describe("Contract Basics", () => {
    it("Should return zeroed bytes for the intial claim mappings", async () => {
      const randomAddress = ethers.Wallet.createRandom().address;
      expect(await auth.claims(randomAddress, randomAddress)).to.equal("0x");
    });

    it("Should return a set claim for a set provided address", async () => {
      const thisAdddress = await addrs[0].getAddress();
      const randomAddress = ethers.Wallet.createRandom().address;
      const randomBytes = ethers.utils.randomBytes(32);

      const setBytes = await auth.setClaim(randomAddress, randomBytes);
      await setBytes.wait();

      const byteHash = await auth.claims(thisAdddress, randomAddress);

      // Initial value must be hexlified..
      expect(byteHash).to.equal(ethers.utils.hexlify(randomBytes));
    });
  });
});
