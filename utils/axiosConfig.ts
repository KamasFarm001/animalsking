import axios from "axios";

const NEXT_PUBLIC_WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL;

const apiConfig = axios.create({
	baseURL: NEXT_PUBLIC_WEBSITE_URL,
	timeout: 1000 * 30,
	validateStatus(status) {
		return status >= 200 && status < 500;
	},
});
export default apiConfig;
