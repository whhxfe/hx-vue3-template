const SYS_CONFIG = {
	SYSTEM_NAME: "V3 开发平台", // 默认系统名称
	API_BASE_URL: "http://192.168.10.1:3000", // 后台url
	// API_BASE_URL: "http://10.100.201.69:3000", // ip
	// API_BASE_URL: "http://192.168.7.65:8011", // 后台url
	// API_BASE_URL: "http://192.168.7.14:8011", // 后台url
	// API_BASE_URL: "http://192.168.6.58:38011", // 后台url
	MAP_URL: "http://192.168.6.68:9080/normalMap",
	ICONIFY_CDN_URL: "http://localhost:3333",
	IMAGE_CDN_URL: "https://img.iconify.design",
	API_PREFIX: "/wzsys",
	HOME_URL:"/"
}

const MAP_CONFIG = {
	normalUrl: "http://192.168.6.68:9080/normalMap",
	satelliteUrl: "http://localhost:5555/satellite",
	center: [114.536107, 30.431758],
	zoom: 11,
	maxZoom: 12,
	minZoom: 3,
	width: "100%",
	height: "100%"
}

;(() => {
	let testUrl = localStorage.getItem("testUrl")
	if (testUrl) {
		SYS_CONFIG.API_BASE_URL = testUrl
	}
})()
