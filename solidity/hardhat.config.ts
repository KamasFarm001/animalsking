import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "solidity-coverage";

const GANACHE_RPC_URL = vars.get("GANACHE_RPC_URL") || "";
const PRIVATE_KEY = vars.get("PRIVATE_KEY") || "";

const config: HardhatUserConfig = {
	solidity: "0.8.24",
	defaultNetwork: "hardhat",
	gasReporter: {
		enabled: false,
		outputFile: "gas-report.txt",
		noColors: true,
		// currency: "USD",
		// coinmarketcap:'' //coinmarketcap api key
		// token:"MATIC" //cost in matic token
	},

	networks: {
		ganache: {
			url: GANACHE_RPC_URL,
			accounts: [PRIVATE_KEY],
			chainId: 1337,
		},

		localhost: {
			// run npx hardhat node for this
			url: "http://127.0.0.1:8545/",
			accounts: [
				"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
			],
			chainId: 31337,
		},
	},
};

export default config;
