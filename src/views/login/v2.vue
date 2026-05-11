<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import type { FormInstance } from "element-plus"
import * as sysApi from "@/api/auth"
import { useSysStore } from "@/store"

const accountImg = new URL("@/assets/images/login/account.png", import.meta.url).href
const passwordImg = new URL("@/assets/images/login/password.png", import.meta.url).href

const bgVideos = [
	new URL("@/assets/media/1.mp4", import.meta.url).href,
	new URL("@/assets/media/2.mp4", import.meta.url).href,
	new URL("@/assets/media/3.mp4", import.meta.url).href
]

const loginStyles = ["1", "2", "3"] as const

const sysStore = useSysStore()
const sysConfig = SYS_CONFIG
const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const loginLoading = ref(false)
const loginStyle = ref<"1" | "2" | "3">("1")

const loginParams = reactive({
	username: "super",
	password: "super"
})

const loginRules = {
	username: [{ required: true, message: "请输入账号" }],
	password: [{ required: true, message: "请输入密码" }]
}

const currentBgClass = computed(() => `login_bg_${loginStyle.value}`)
const currentVideoSrc = computed(() => bgVideos[Number(loginStyle.value) - 1] || bgVideos[0])

const login = async () => {
	try {
		await formRef.value!.validate()
		loginLoading.value = true

	const res = await sysApi.login({
			username: loginParams.username,
			password: loginParams.password
		})

		// 使用 setTokenAsync 原子操作：存 token 并拉取用户信息
		await sysStore.setTokenAsync(res.data.info)

		const redirect = route.query.redirect
		router.replace((redirect as string) || "/")
	} catch (e) {
		console.error(e)
	} finally {
		loginLoading.value = false
	}
}

const changeStyle = () => {
	const currentIndex = loginStyles.indexOf(loginStyle.value)
	loginStyle.value = loginStyles[(currentIndex + 1) % loginStyles.length] as typeof loginStyle.value
	localStorage.setItem("loginStyle", loginStyle.value)
}

onMounted(() => {
	const saved = localStorage.getItem("loginStyle")
	if (saved && loginStyles.includes(saved as typeof loginStyles[number])) {
		loginStyle.value = saved as typeof loginStyle.value
	}
})
</script>

<template>
	<div class="login-v">
		<div class="change-btn" @click="changeStyle">
			<el-icon :style="{ color: loginStyle === '2' ? '#000' : '#fff' }"><Operation /></el-icon>
		</div>
		<transition name="fade-slide" mode="out-in">
			<div :class="currentBgClass" :key="loginStyle">
				<video autoplay muted loop playsinline preload="auto">
					<source :src="currentVideoSrc" type="video/mp4" />
				</video>
				<div class="login_form_bg">
					<div class="login_form_bg_title">
						<img class="logo" src="@/assets/images/common/logo.png" />
						统一认证中心
					</div>
					<el-form ref="formRef" :model="loginParams" :rules="loginRules" @keyup.enter="login">
						<el-form-item prop="username">
							<el-input class="login-input" size="small" v-model="loginParams.username" placeholder="请输入账号">
								<template #prefix>
									<img class="input_icon" :src="accountImg" />
								</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="password">
							<el-input class="login-input" size="small" show-password v-model="loginParams.password" placeholder="请输入密码">
								<template #prefix>
									<img class="input_icon" :src="passwordImg" />
								</template>
							</el-input>
						</el-form-item>
						<el-form-item>
							<el-button class="login-btn" size="small" @click="login">登录</el-button>
						</el-form-item>
					</el-form>
					<a class="download" :href="sysConfig.CHROME_DOWNLOAD_URL">
						推荐使用浏览器
						<img class="download_icon" src="@/assets/images/login/gogle.png" />
					</a>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped lang="scss">
.login-v {
	width: 100%;
	height: 100%;
	position: relative;

	.change-btn {
		cursor: pointer;
		z-index: 100;
		position: absolute;
		top: 20px;
		right: 20px;
	}

	.login_bg_1,
	.login_bg_2,
	.login_bg_3 {
		width: 100%;
		height: 100%;
		position: relative;

		video {
			position: absolute;
			width: 100%;
			height: 100%;
			inset: 0;
			object-fit: cover;
			z-index: -1;
			pointer-events: none;
		}

		.login_form_bg {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			flex-shrink: 0;
			right: 100px;
			margin-left: 100px;
			width: 480px;
			height: 500px;
			background-color: rgba(10, 35, 61, 0.2);
			border: 2px solid rgba(255, 255, 255, 0.5);
			border-radius: 20px;
			backdrop-filter: blur(15px);
			padding: 60px;

			.login_form_bg_title {
				margin: 20px 0 40px 0;
				width: 100%;
				height: 60px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 24px;
				font-weight: 700;
				text-align: center;
				color: #fff;

				.logo {
					width: 60px;
					margin-right: 10px;
				}
			}
		}
	}

	.login_bg_2 video {
		object-position: bottom center;
	}
}

.login-input {
	width: 100%;
	height: 48px;

	:deep(.el-input__inner) {
		width: 100%;
		height: 100%;
		font-size: 16px;
		color: #000;
		padding-left: 50px;

		&::placeholder {
			font-size: 16px;
			color: #000;
		}
	}
}

.login-btn {
	width: 100%;
	height: 48px;
	color: white;
	background-image: linear-gradient(180deg, #00d6ff, #006aff);
	border: none;
	font-size: 18px;

	:deep(span) {
		font-size: 18px;
		color: #fff;
	}
}

.input_icon {
	height: 100%;
	width: 20px;
	object-fit: contain;
	margin-left: 14px;
}

.download {
	font-size: 14px;
	color: #fff;
	display: flex;
	align-items: center;
	cursor: pointer;
}

.download_icon {
	width: 23px;
	height: 23px;
	object-fit: cover;
	margin-left: 3px;
}
</style>