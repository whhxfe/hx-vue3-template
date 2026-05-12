import axios, {
	type AxiosInstance,
	type InternalAxiosRequestConfig,
	type AxiosResponse,
	type AxiosRequestConfig
} from "axios"
import { ElMessage, ElMessageBox } from "element-plus"
import router from "@/router"
import { useSysStore } from "@/store"
export const service: AxiosInstance = axios.create({
	// baseURL: window.SYS_CONFIG.API_BASE_URL + window.SYS_CONFIG.API_PREFIX,
	baseURL: SYS_CONFIG.API_BASE_URL + SYS_CONFIG.API_PREFIX,
	// baseURL:SYS_CONFIG.API_PREFIX,
	timeout: 60000
})

// 请求拦截器
service.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// 可以在这里添加请求头，如 token
		const token = sessionStorage.getItem("auth_token")
		if (token) {
			config.headers = config.headers || {}
			config.headers.token = `${token}`
		}
		return config
	},
	error => {
		console.error(error)
		return Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	(response: AxiosResponse) => {
		const res = response.data
		if (res.state == 6000) {
			ElMessage({
				message: response.data?.message || "请求失败",
				grouping: true,
				type: "error"
			})
	} else if (res.state === 10000) {
			const sysStore = useSysStore()
			sysStore.logout()
			router.push('/login')
		}
		return response.data
	},
	error => {
		console.error("err" + error)
		return Promise.reject(error)
	}
)
// 封装 get 请求
const get = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
	return service.get(url, { params, ...config })
}

// 封装 post 请求
const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
	return service.post(url, data, config)
}

// 封装 put 请求
const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
	return service.put(url, data, config)
}

// 封装 delete 请求
const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
	return service.delete(url, config)
}

const request = {
	get,
	post,
	put,
	del
}

export default request
