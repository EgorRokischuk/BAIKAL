import axios from 'axios';
import { useCookies } from 'react-cookie';

export const http = axios.create({
	withCredentials: true,
	baseURL: __API_URL__,
});

http.interceptors.request.use(
	(config) => {
		const [cookies] = useCookies();
		const token = cookies.get('token');

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

http.interceptors.response.use(
	function (response) {
		if (response.status == 200) {
			return response;
		}

		return response;
	},
	function (error) {
		return Promise.reject(error);
	},
);
