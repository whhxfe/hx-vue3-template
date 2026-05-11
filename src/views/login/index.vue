<template>
	<div class="login_bg">
		<img class="logo" src="@/assets/images/common/logo.png" />
		<div class="title">{{ sysConfig.SYSTEM_NAME }}</div>
		<div class="login_form_bg">
			<div class="login_form_bg_title">系统登陆</div>
			<el-form ref="formRef" :model="loginParams" :rules="loginRule" @keyup.enter.native="login()">
				<el-form-item label="" prop="accountId">
					<el-input class="login-input" size="small" v-model="loginParams.accountId" placeholder="请输入账号">
						<img slot="prefix" class="input_icon" src="@/assets/images/login/account.png" />
					</el-input>
				</el-form-item>
				<el-form-item label="" prop="password">
					<el-input class="login-input" size="small" show-password v-model="loginParams.password" placeholder="请输入密码">
						<img slot="prefix" class="input_icon" src="@/assets/images/login/password.png" />
					</el-input>
				</el-form-item>
				<el-form-item label="">
					<el-button class="login-btn" size="small" @click="login()">登录</el-button>
				</el-form-item>
			</el-form>
			<a class="download" :href="sysConfig.CHROME_DOWNLOAD_URL"
				>推荐使用浏览器<img class="download_icon" src="@/assets/images/login/gogle.png"
			/></a>
		</div>
	</div>
</template>

<script lang="ts" setup name="Login">
import { ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import type { FormInstance } from "element-plus"
import * as sysApi from "@/api/sys"
import { useSysStore } from "@/store"
const sysStore = useSysStore()
const sysConfig = SYS_CONFIG
const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const loginLoading = ref(false)
const loginParams = ref({
	accountId: "hxtest",
	password: "123456"
})

const loginRule = ref({
	accountId: [
		{
			required: true,
			message: "请输入账号"
		}
	],
	password: [
		{
			required: true,
			message: "请输入密码"
		}
	]
})

const login = async () => {


	try {
		let valid = await formRef.value!.validate()
		if (valid) {
			loginLoading.value = true

			let data = {
				accountId: loginParams.value.accountId,
				password: loginParams.value.password
			}


			let res  = await sysApi.login(data)

			sysStore.setToken(res.data.info)

			sysStore.setUserInfo(res.data)
			if (route.query.redirect) {
				router.replace(`${route.query.redirect}`)
			} else {
				router.replace("/")
			}
		}
	} catch (e) {
		console.error(e)
	} finally {
		loginLoading.value = false
	}
}
</script>

<style lang="scss" scoped>
.login_bg {
	background-image: url("~/images/login/login_bg.png");
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-size: 100% 100%;
	background-repeat: no-repeat;
}
.login_form_bg {
	background-image: url("~/images/login/login_form_bg.png");
	width: 496px;
	height: 400px;
	background-size: 100% 100%;
	background-repeat: no-repeat;
	position: relative;
}
.logo {
	width: 100px;
	height: 100px;
	margin-bottom: 21px;
	object-fit: contain;
	margin-top: 70px;
}
.title {
	background-image: linear-gradient(0deg, #d3e8ff, #ffffff);
	font-weight: bold;
	font-size: 44px;
	text-shadow: 4px 0px 9px rgba(0, 0, 0, 0.15);
	margin-bottom: 102px;
	line-height: 44px;
	text-align: center;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}
.login_form_bg_title {
	font-size: 16px;
	text-align: center;
	background-image: linear-gradient(0deg, #78e8ff, #ffffff);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	font-weight: bold;
	margin-bottom: 59px;
	padding-top: 16px;
}

.login-input {
	width: 100%;
	height: 48px;

	::v-deep .el-input__inner {
		width: 100%;
		height: 100%;
		background: rgba(14, 20, 42, 0.25);
		font-size: 16px;
		color: #fff;
		border: 1px solid #028ec9;
		padding-left: 50px;
		box-shadow: inset 0 0 0 30px rgba(14, 20, 42, 0.25);
	}

	::v-deep .el-input__inner::-webkit-input-placeholder {
		font-size: 16px;
		color: #ffffff !important;
	}
	::v-deep .el-input__inner:-moz-placeholder {
		font-size: 16px;
		color: #ffffff !important;
	}
	::v-deep .el-input__inner::-moz-placeholder {
		font-size: 16px;
		color: #ffffff !important;
	}
	::v-deep .el-input__inner:-ms-input-placeholder {
		font-size: 16px;
		color: #ffffff !important;
	}
}

.login-btn {
	width: 368px;
	height: 48px;
	color: white;
	background-image: linear-gradient(180deg, #00d6ff, #006aff);
	border: none;
	font-size: 18px;
	::v-deep span {
		font-size: 18px;
		color: #fff;
	}
}

::v-deep .el-form-item {
	margin-bottom: 25px;
	display: flex;
	align-items: center;
	flex-direction: column;
}

::v-deep .el-form-item:nth-child(2) {
	margin-bottom: 49px;
}

::v-deep .el-form-item__content {
	width: 368px;
}

.download {
	font-size: 14px;
	color: #fff;
	position: absolute;
	bottom: -14px;
	left: 5px;
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

.input_icon {
	height: 100%;
	width: 20px;
	object-fit: contain;
	margin-left: 14px;
}

@media screen and (max-height: 800px) {
	.logo {
		margin-top: 40px;
	}

	.title {
		margin-bottom: 51px;
	}
}
</style>
