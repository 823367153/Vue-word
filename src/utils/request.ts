import axios from 'axios';
import type {
	AxiosRequestConfig,
	AxiosResponse
} from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

export interface HttpResponse < T = unknown > {
	status: number;
	message: string;
	code: number;
	data: T;
}

// create an axios instance
const service = axios.create({
	baseURL: window.config.VUE_APP_BASE_API, // url = baseURL + request url
	withCredentials: true, // send cookies when cross-domain requests
	timeout: -1 // request timeout
})

service.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		// let each request carry token
		// this example using the JWT token
		// Authorization is a custom headers key
		// please modify it according to the actual situation
		const token = getToken();
		if(token) {
			if(!config.headers) {
				config.headers = {};
			}
			config.headers.Authorization = `Bearer ${token}`;
			config.headers.token = token;
		}
		return config;
	},
	(error) => {
		// do something
		return Promise.reject(error);
	}
);
// add response interceptors
service.interceptors.response.use(
	(response: AxiosResponse < HttpResponse > ) => {
		const res = response.data;
		if(res.code != "200") {
			if(res.code == '500') {
				Message.error({
					content: res.message || '系统错误',
				});
			}
			if(res.code == '403') {
				Message.warning({
					content: res.message ,
				});
				return
			}
			if([401].includes(res.code)) {
				Modal.error({
					title: '提示',
					content: '登录超时，请重新登录后访问！',
					okText: '确定',
					async onOk() {
						const userStore = useUserStore();
						await userStore.logout();
						window.location.reload();
					},
				});
			}
			return res;
		}
		return res;
	},
	(error) => {
		Message.error({
			content: '网络连接失败，请稍后重试！',
			duration: 2 * 1000,
		});
		return Promise.reject(error);
	}
);

export default service

