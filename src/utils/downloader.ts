import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

const service = axios.create({
	baseURL: window.config.VUE_APP_BASE_API, // url = base url + request url
	withCredentials: true,
	responseType: "blob"
});
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
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

service.interceptors.response.use(response => {
	const blob = new Blob([response.data]);
	const name = headerName(response);
	download(blob, name);
	return response;
});

function headerName(response) {
	const disposition = response.headers["content-disposition"];
	if(disposition) {
		return decodeURI(disposition.slice(disposition.lastIndexOf("filename") + 9).trim())
	} else {
		return "导出.xlsx"
	}
}

function download(blob, name) {
	const linkNode = document.createElement("a");
	linkNode.style.display = "none";
	linkNode.href = URL.createObjectURL(blob);
	linkNode.download = name;
	document.body.appendChild(linkNode);
	linkNode.click();
	URL.revokeObjectURL(linkNode.href);
	document.body.removeChild(linkNode);
}

export default service;