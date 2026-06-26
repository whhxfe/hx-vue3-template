<template>
	<el-dialog
		v-model="visible"
		title="研判"
		width="480px"
		:center="true"
		destroy-on-close
		append-to-body
		@close="handleClose"
	>
		<el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="right">
			<el-form-item label="管控类别" prop="controlCategory">
				<el-select v-model="form.controlCategory" placeholder="请选择管控类别" style="width: 100%">
					<el-option
						v-for="opt in categoryOptions"
						:key="opt.value"
						:label="opt.label"
						:value="opt.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="研判依据" prop="judgeReason">
				<el-input
					v-model="form.judgeReason"
					type="textarea"
					:rows="3"
					placeholder="请输入研判依据"
					maxlength="500"
					show-word-limit
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="handleCancel">取消</el-button>
			<el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import { useAsyncState } from "@vueuse/core"
import type { FormInstance, FormRules } from "element-plus"
import { ElMessage } from "element-plus"
import { uc } from "@/modules/ktc/api"
import type { DictItem } from "@/modules/ktc/api/types"

defineOptions({ name: "JudgeDialog" })

const props = defineProps<{
	modelValue: boolean
	unitId: number
}>()

const emit = defineEmits<{
	"update:modelValue": [val: boolean]
	success: []
}>()

const visible = ref(props.modelValue)
watch(() => props.modelValue, (val) => { visible.value = val })

const formRef = ref<FormInstance | null>(null)
const submitting = ref(false)

const form = reactive({
	controlCategory: "",
	judgeReason: ""
})

const rules: FormRules = {
	controlCategory: [{ required: true, message: "请选择管控类别", trigger: "change" }],
	judgeReason: [{ required: true, message: "请输入研判依据", trigger: "blur" }]
}

// 管控类别下拉（首次打开弹窗时按需加载）
const { state: categoryOptions } = useAsyncState<DictItem[]>(
	async () => {
		const res = await uc.getControlCategoryOptions()
		return res.data || []
	},
	[],
	{ immediate: false, resetOnExecute: false }
)

const handleClose = () => {
	formRef.value?.resetFields()
	form.controlCategory = ""
	form.judgeReason = ""
	emit("update:modelValue", false)
}

const handleCancel = () => {
	handleClose()
}

const handleSubmit = async () => {
	if (!formRef.value) return
	try {
		await formRef.value.validate()
	} catch {
		return
	}
	submitting.value = true
	try {
		const res = await uc.judge({
			id: props.unitId,
			controlCategory: form.controlCategory,
			judgeReason: form.judgeReason
		})
		if (res.state === 2000) {
			ElMessage.success(res.message || "研判成功")
			emit("success")
			handleClose()
		} else {
			ElMessage.error(res.message || "研判失败")
		}
	} catch (err) {
		ElMessage.error((err as { message?: string })?.message || "研判失败")
	} finally {
		submitting.value = false
	}
}

watch(visible, (val) => {
	if (val && categoryOptions.value.length === 0) {
		categoryOptions.execute(0)
	}
})
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
	padding: 20px 24px 0;
}
</style>
