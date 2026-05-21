<template>
	<div class="base-config">
		<el-card>
			<template #header>
				<div class="card-header">
					<span>基础配置</span>
					<el-button type="primary" @click="handleSave" :loading="saving">保存配置</el-button>
				</div>
			</template>

			<el-form :model="formData" label-width="140px" class="config-form">
				<el-form-item
					v-for="item in configList"
					:key="item.key"
					:label="item.description || item.key"
				>
					<!-- 文本输入 -->
					<el-input
						v-if="item.type === 'text'"
						v-model="formData[item.key]"
						:placeholder="`请输入${item.description || item.key}`"
						style="max-width: 400px"
					/>

					<!-- 数字输入 -->
					<el-input-number
						v-else-if="item.type === 'number'"
						v-model="formData[item.key]"
						:min="1"
						:max="10000"
						style="max-width: 200px"
					/>

					<!-- 多行文本 -->
					<el-input
						v-else-if="item.type === 'textarea'"
						v-model="formData[item.key]"
						type="textarea"
						:rows="3"
						:placeholder="`请输入${item.description || item.key}`"
						style="max-width: 600px"
					/>

					<!-- 图片上传 -->
					<div v-else-if="item.type === 'image'" class="image-upload">
						<el-input
							v-model="formData[item.key]"
							placeholder="图片 URL"
							style="max-width: 400px"
						/>
						<el-button type="info" @click="handleUploadImage(item.key)" style="margin-left: 10px">
							上传图片
						</el-button>
					</div>

					<!-- 默认文本输入 -->
					<el-input
						v-else
						v-model="formData[item.key]"
						style="max-width: 400px"
					/>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getConfigList, batchUpdateConfig, type SysConfig } from '../api'

const configList = ref<SysConfig[]>([])
const saving = ref(false)

const formData = reactive<Record<string, any>>({})

const fetchConfigs = async () => {
	const res = await getConfigList({ pageSize: 100 })
	if (res.state === 2000) {
		configList.value = res.data.list
		// 初始化表单数据
		for (const item of res.data.list) {
			formData[item.key] = item.value
		}
	}
}

const handleSave = async () => {
	saving.value = true
	try {
		const configs = Object.entries(formData).map(([key, value]) => ({
			key,
			value: String(value)
		}))

		const res = await batchUpdateConfig(configs)
		if (res.state === 2000) {
			ElMessage.success('保存成功')
			fetchConfigs()
		} else {
			ElMessage.error(res.message || '保存失败')
		}
	} catch (err: any) {
		ElMessage.error(err.message || '保存失败')
	} finally {
		saving.value = false
	}
}

const handleUploadImage = (key: string) => {
	// TODO: 实现图片上传功能
	ElMessage.info('图片上传功能待实现')
}

onMounted(() => {
	fetchConfigs()
})
</script>

<style lang="scss" scoped>
.base-config {
	padding: 16px;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.config-form {
	max-width: 800px;
}

.image-upload {
	display: flex;
	align-items: center;
}
</style>
