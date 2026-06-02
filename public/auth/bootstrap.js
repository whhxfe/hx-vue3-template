/**
 * 认证引导程序
 * 在 Vue 应用初始化之前运行，确保 URL 中的 token 被持久化到 sessionStorage
 * 路由守卫会从 sessionStorage 读取 token 并完成后续认证流程
 */
(function () {
	var url = new URL(window.location.href)
	var token = url.searchParams.get("token")
	if (!token) return
	if (sessionStorage.getItem("auth_token") === token) return
	sessionStorage.setItem("auth_token", token)
})()
