import hre, { ethers } from "hardhat";
import { FundMe } from "../../typechain-types";
import { assert, expect } from "chai";
import { validateHeaderValue } from "http";

describe("FundMe", async () => {
	let FundMeDeployment: Promise<FundMe>;
	const sendValue = ethers.parseEther("1"); //1 eth
	beforeEach(async () => {
		FundMeDeployment = hre.ethers.deployContract("FundMe", [
			"0x694AA1769357215DE4FAC081bf1f309aDC325306",
		]);
	});

	describe("fund", () => {
		it("it fails if you don't send enough eth", async () => [
			expect((await FundMeDeployment).fund()).to.be.reverted,
		]);
	});
	describe("withdraw", async () => {
		beforeEach(async () => {
			(await FundMeDeployment).fund({ value: sendValue });
		});
		it("withdraw Eth from a single sounder", async () => {
			//Arrange
			//Act
			//Assert
		});
	});
});
