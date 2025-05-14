import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const StorageModule = buildModule("SimpleStorageModule", (m) => {
	const storageContract = m.contract("SimpleStorage", []);
	return { storageContract };
});

export default StorageModule;
