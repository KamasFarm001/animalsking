import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RaffleModuleBuilder = buildModule("RaffleModuleBuilder", (m) => {
	const raffleContract = m.contract("Raffle", []);
	return { raffleContract };
});

export default RaffleModuleBuilder;
