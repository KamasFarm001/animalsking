import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const fundMeModuleBuilder = buildModule("FundMeModuleBuilder", (m) => {
	const fundMeContract = m.contract("FundMe", [
		"0x694AA1769357215DE4FAC081bf1f309aDC325306",
	]);
	return { fundMeContract };
});

export default fundMeModuleBuilder;
