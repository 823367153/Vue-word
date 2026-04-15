import OSS from 'ali-oss'
import axios from 'axios'

const region = 'oss-cn-beijing'
const bucket = 'zfatt'
const parallel = 3
const partSize = 1024 * 1024

let client = null
/**
 * 获取STS Token
 * 
 * accessKeyId
 * accessKeySecret
 * expiration
 * securityToken
 */
let credentials

async function loadCredential() {
	const {
		data
	} = await axios.get(`${window.config.VUE_APP_OSS_API}/api/sts`)
	credentials = data
}

// 创建OSS Client
async function initOSSClient() {
	await loadCredential()
	const {
		securityToken,
		accessKeyId,
		accessKeySecret
	} = credentials
	const info = {
		accessKeyId: accessKeyId,
		accessKeySecret: accessKeySecret,
		stsToken: securityToken,
		region: region,
		bucket: bucket
	}
	client = new OSS(info)
}

/**
 * 检查是否过期
 */
export const keepSTSAlive = async() => {
	if(!client) await initOSSClient()
	// 未过期
	if(new Date(credentials.expiration) > new Date()) return true
	client.cancel()
	await initOSSClient()
}

/**
 * 简单上传
 * @param {String} key oss key
 * @param {File} file 文件
 */
export async function put(key, file) {
	await keepSTSAlive();
	return client.put(key, file)
}
/**
 * 上传
 * @param {String} key 文件key
 * @param {String|File} file 文件
 * @param {Function} progress 进度回调函数
 */
export async function putProgress(key, file, progress,cancel) {
	if(window.config.VUE_IS_LOCAL) {
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();
		let param = new FormData()
		param.append('path', key);
		param.append('file', file);
		cancel(source);
		return axios.post(window.config.VUE_APP_BASE_API + '/admin/user/adminUser/uploadFile', param, {
			headers: {
				'Content-Type': 'multipart/form-data'
			},
			onUploadProgress: function(progressEvent) {
				let percent = progressEvent.loaded / progressEvent.total;
				if(progress) {
					progress(percent);
				}
			},
			cancelToken: source.token
		})
	} else {
		await keepSTSAlive()
		let param = {};
		if(progress) {
			param = {
				parallel: parallel,
				partSize: partSize,
				progress: async(p, ck) => {
					await keepSTSAlive()
					progress(p, ck)
				}
			}
		}
		return client.multipartUpload(key, file, param)
	}
}
/**
 * 分片上传
 * @param {String} key 文件key
 * @param {String|File} file 文件
 * @param {Function} progress 进度回调函数
 */
export async function createMultipartUpload(key, file, progress) {
	await keepSTSAlive()
	const param = {
		parallel: parallel,
		partSize: partSize,
		progress: async(p, ck) => {
			await keepSTSAlive()
			progress(p, ck)
		}
	}
	return client.multipartUpload(key, file, param)
}

/**
 * 断点续传
 * @param {String|File} file 文件
 * @param {Object} checkpoint 断点信息
 * @param {Function} progress 进度回调函数
 */
export async function resumeMultipartUpload(file, checkpoint, progress) {
	await keepSTSAlive()
	const param = {
		parallel: parallel,
		partSize: partSize,
		checkpoint: checkpoint,
		progress: async(p, ck) => {
			await keepSTSAlive()
			progress(p, ck)
		}
	}
	return client.multipartUpload(checkpoint.uploadId, file, param)
}

/**
 * 暂停上传
 */
export function suspendUpload() {
	if(client) client.cancel()
}

/**
 * 删除文件
 * @param {String} key 文件路径
 */
export const deleteObject = async key => {
	await keepSTSAlive()
	return client.delete(key)
}

/**
 * 删除多个文件
 * @param {Array} keys 文件路径
 */
export const deleteMulti = async keys => {
	await keepSTSAlive()
	return client.deleteMulti(keys)
}

/**
 * 列举指定前缀后的下一级文件及目录(100个)
 * @param {String} prefix oss 路径前缀
 */
export const listChild = async prefix => {
	await keepSTSAlive()
	return client.list({
		prefix: prefix,
		delimiter: '/'
	})
}

/**
 * 列举指定前缀后所有文件(100个)
 * @param {String} prefix oss 路径前缀
 */
export async function listObjects(prefix) {
	await keepSTSAlive()
	return client.list({
		prefix: prefix
	})
}