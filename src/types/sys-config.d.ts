interface MAP_CONFIG {
	normalUrl?: string // 瓦片图层 url
	satelliteUrl?: string // 卫星图层 url
	center?: [number, number] // 地图中心点
	zoom?: number // 地图缩放级别
	maxZoom?: number // 地图最大缩放级别
	minZoom?: number // 地图最小缩放级别
	scrollWheelZoom?: boolean // 是否启用滚轮缩放，默认启用
}

interface SYS_CONFIG {
	SYSTEM_NAME: string
	API_BASE_URL: string
	API_PREFIX: string
	CHROME_DOWNLOAD_URL: string
	MODEL_PLATFORM_URL: string
	HOME_URL: string
	LAYOUT_MENU_MODE: "vertical" | "horizontal"
}

declare const SYS_CONFIG: SYS_CONFIG
declare const MAP_CONFIG: MAP_CONFIG
