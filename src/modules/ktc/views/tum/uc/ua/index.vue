<template>
	<div class="ua-container">
		<!-- 顶部返回栏 -->
		<div class="ua-header">
			<el-button text @click="handleBack">
				<HxIcon type="iconify" name="ep:arrow-left" />
				返回单元管控
			</el-button>
			<span class="header-title">单元档案</span>
			<span v-if="unitId" class="header-subtitle">
				{{ unitId }}
			</span>
		</div>

		<!-- 主体内容区 -->
		<div ref="bodyRef" class="ua-body" @scroll="handleContentScrollThrottled">
			<div class="ua-body-inner">
				<!-- 左侧内容区域 -->
				<div class="ua-content">
					<!-- 基本信息 -->
					<BasicInfo :unit-id="unitId" />

					<!-- 终端分析 -->
					<TerminalAnalysis :unit-id="unitId" />

					<!-- 共性分析 -->
					<CommonAnalysis :unit-id="unitId" />

					<!-- 行为信息 -->
					<section id="section-behavior" class="ua-section">
						<div class="section-header">
							<h3 class="section-title">行为信息</h3>
						</div>
						<div class="section-body">
							<!-- 线上行为 -->
							<OnlineBehavior :unit-id="unitId" />

							<!-- 行为日志 -->
							<BehaviorLog :unit-id="unitId" />
						</div>
					</section>

					<!-- 研判信息 -->
					<section id="section-judge" class="ua-section">
						<div class="section-header">
							<h3 class="section-title">研判信息</h3>
						</div>
						<div class="section-body">
							<JudgeInfo :unit-id="unitId" />
						</div>
					</section>
				</div>

				<!-- 右侧板块导航 -->
				<SectionNav :sections="sections" :active-section="activeSection" @navigate="scrollToSection" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useDebounceFn, useThrottleFn } from "@vueuse/core"
import { HxIcon } from "@whhx/ui"
import BasicInfo from "./components/BasicInfo.vue"
import TerminalAnalysis from "./components/TerminalAnalysis.vue"
import CommonAnalysis from "./components/CommonAnalysis.vue"
import OnlineBehavior from "./components/OnlineBehavior.vue"
import BehaviorLog from "./components/BehaviorLog.vue"
import JudgeInfo from "./components/JudgeInfo.vue"
import SectionNav from "./components/SectionNav.vue"

defineOptions({ name: "UnitArchive" })

const route = useRoute()
const router = useRouter()

const bodyRef = ref<HTMLElement | null>(null)
const activeSection = ref("basic")
const unitId = ref<number>(0)

const sections = [
	{ key: "basic", title: "基本信息", level: 1 },
	{ key: "terminal", title: "终端分析", level: 1 },
	{ key: "common", title: "共性分析", level: 1 },
	{ key: "behavior", title: "行为信息", level: 1 },
	{ key: "online", title: "线上行为", level: 2 },
	{ key: "log", title: "行为日志", level: 2 },
	{ key: "judge", title: "研判信息", level: 1 }
]

// 滚动位置记忆：按 unitId 区分的 sessionStorage key
const scrollStorageKey = computed(() => `ua_scroll_${unitId.value}`)

const saveScroll = () => {
	if (!bodyRef.value) return
	try {
		sessionStorage.setItem(scrollStorageKey.value, String(bodyRef.value.scrollTop))
	} catch {
		// sessionStorage 在隐私模式下可能抛错，忽略即可
	}
}

// 防抖 200ms 写入会话存储，避免频繁滚动时过度 IO
const saveScrollDebounced = useDebounceFn(saveScroll, 200)

const restoreScroll = () => {
	if (!bodyRef.value) return
	const saved = sessionStorage.getItem(scrollStorageKey.value)
	if (saved === null) return
	const top = Number(saved)
	if (Number.isFinite(top) && top > 0) {
		bodyRef.value.scrollTop = top
	}
}

// 等待子卡片异步加载完毕、scrollHeight 稳定后回调
const waitForContentReady = (cb: () => void, stableCount = 3, maxTries = 30) => {
	if (!bodyRef.value) {
		cb()
		return
	}
	let lastHeight = -1
	let stable = 0
	let tries = 0
	let stopped = false
	const tick = () => {
		if (stopped || !bodyRef.value || tries >= maxTries) {
			cb()
			return
		}
		const h = bodyRef.value.scrollHeight
		if (h === lastHeight) {
			stable++
			if (stable >= stableCount) {
				cb()
				return
			}
		} else {
			stable = 0
			lastHeight = h
		}
		tries++
		requestAnimationFrame(tick)
	}
	requestAnimationFrame(tick)
	// 提供取消能力（unmount 时调用）
	return () => { stopped = true }
}

const scrollToSection = (key: string) => {
	const el = document.getElementById(`section-${key}`)
	if (el && bodyRef.value) {
		const containerRect = bodyRef.value.getBoundingClientRect()
		const targetRect = el.getBoundingClientRect()
		const offsetTop = bodyRef.value.scrollTop + (targetRect.top - containerRect.top)
		bodyRef.value.scrollTo({ top: offsetTop, behavior: "smooth" })
		activeSection.value = key
	}
}

const handleContentScroll = () => {
	if (!bodyRef.value) return
	const scrollTop = bodyRef.value.scrollTop
	const containerRect = bodyRef.value.getBoundingClientRect()
	for (let i = sections.length - 1; i >= 0; i--) {
		const section = sections[i]
		if (!section) continue
		const el = document.getElementById(`section-${section.key}`)
		if (el) {
			const targetRect = el.getBoundingClientRect()
			const relativeTop = bodyRef.value.scrollTop + (targetRect.top - containerRect.top)
			if (scrollTop >= relativeTop - 80) {
				activeSection.value = section.key
				break
			}
		}
	}
	saveScrollDebounced()
}

// 节流 100ms：高频滚动时仍能即时响应右侧导航，但计算逻辑不被打爆
const handleContentScrollThrottled = useThrottleFn(handleContentScroll, 100, true)

const handleBack = () => {
	router.push("/ktc/tum/uc")
}

let cancelContentReady: (() => void) | null = null

onMounted(async () => {
	const id = route.query.id as string
	unitId.value = id ? Number(id) : 1
	await nextTick()
	// 等子卡片异步内容渲染完、scrollHeight 稳定后再恢复滚动
	const cancel = waitForContentReady(() => {
		restoreScroll()
		handleContentScroll()
	})
	if (cancel) cancelContentReady = cancel
})

onUnmounted(() => {
	cancelContentReady?.()
})
</script>

<style lang="scss" scoped>
.ua-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: var(--el-bg-color-page);
}

.ua-header {
	display: flex;
	align-items: center;
	gap: 12px;
	flex-shrink: 0;
	padding: 12px 16px;
	background: var(--el-bg-color);
	border-bottom: 1px solid var(--el-border-color-lighter);

	.header-title {
		font-size: 16px;
		font-weight: 600;
		color: var(--el-text-color-primary);
	}

	.header-subtitle {
		font-size: 14px;
		color: var(--el-text-color-secondary);
	}
}

.ua-body {
	flex: 1;
	min-height: 0;
	padding: 16px;
	gap: 16px;
	display: block;
	overflow-y: auto;
	overflow-x: hidden;
	padding-right: 12px;

	&::-webkit-scrollbar {
		width: 8px;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background: var(--el-border-color);
		border-radius: 4px;

		&:hover {
			background: var(--el-border-color-darker);
		}
	}
}

.ua-body-inner {
	display: flex;
	flex-direction: row;
	gap: 16px;
	width: 100%;
}

.ua-content {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.ua-section {
	background: var(--el-bg-color);
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

	.section-header {
		padding: 16px 20px;
		border-bottom: 1px solid var(--el-border-color-lighter);

		.section-title {
			margin: 0;
			font-size: 15px;
			font-weight: 600;
			color: var(--el-text-color-primary);
			position: relative;
			padding-left: 12px;

			&::before {
				content: "";
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 3px;
				height: 16px;
				background: var(--el-color-primary);
				border-radius: 2px;
			}
		}
	}

	.section-body {
		padding: 20px;
		min-height: 120px;
	}
}
</style>
