import axios from "axios";

const WEBSITE_URL = process.env.WEBSITE_URL;

const apiConfig = axios.create({
	baseURL: WEBSITE_URL,
	timeout: 1000 * 30,
	validateStatus(status) {
		return status >= 200 && status < 500;
	},
});
export default apiConfig;
