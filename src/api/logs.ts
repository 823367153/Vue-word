import request from '@/utils/request'

//查询
export function loginLogs(data) {
	return request({
		url: '/admin/log/login',
		method: 'get',
		params: data
	})
}
//查询
export function operLogs(data) {
	return request({
		url: '/admin/log/oper',
		method: 'get',
		params: data
	})
}


