import { describe } from "mocha";
import hre from "hardhat";
import { assert } from "chai";
import { SimpleStorage } from "../../typechain-types";

describe("SimpleStorage", () => {
	let SimpleStorageContract: SimpleStorage;
	beforeEach(async () => {
		SimpleStorageContract = await hre.ethers.deployContract(
			"SimpleStorage",
			[]
		);
	});

	it("Should start with a favorite number of 0", async () => {
		const currentValue = await SimpleStorageContract.retrieve();
		const expectedValue = "0";
		assert.equal(currentValue.toString(), expectedValue);
	});
	it("Should update when we call store", async () => {
		const expectedValue = "7";
		const transactionResponse = SimpleStorageContract.store(expectedValue);
		(await transactionResponse).wait(1);
		const currentValue = await SimpleStorageContract.retrieve();
		assert.equal(currentValue.toString(), expectedValue);
	});
});
