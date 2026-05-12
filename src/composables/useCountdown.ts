/**
 * 倒计时组合式函数
 */
import { ref, computed, onUnmounted } from 'vue'

export interface CountdownOptions {
	seconds?: number
	autoStart?: boolean
	onComplete?: () => void
}

export interface CountdownResult {
	remainingSeconds: typeof remaining
	isRunning: typeof running
	formattedTime: ReturnType<typeof computed>
	start: () => void
	pause: () => void
	reset: (seconds?: number) => void
	stop: () => void
}

const remaining = ref(0)
const running = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

export const useCountdown = (options: CountdownOptions = {}): CountdownResult => {
	const { seconds = 60, autoStart = false, onComplete } = options

	const formattedTime = computed(() => {
		const mins = Math.floor(remaining.value / 60)
		const secs = remaining.value % 60
		return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
	})

	const tick = () => {
		if (remaining.value > 0) {
			remaining.value--
		} else {
			stop()
			onComplete?.()
		}
	}

	const start = () => {
		if (running.value) return
		running.value = true
		timer = setInterval(tick, 1000)
	}

	const pause = () => {
		running.value = false
		if (timer) {
			clearInterval(timer)
			timer = null
		}
	}

	const stop = () => {
		pause()
	}

	const reset = (newSeconds?: number) => {
		stop()
		remaining.value = newSeconds ?? seconds
	}

	if (autoStart) {
		remaining.value = seconds
		start()
	}

	onUnmounted(() => {
		stop()
	})

	return {
		remainingSeconds: remaining,
		isRunning: running,
		formattedTime,
		start,
		pause,
		reset,
		stop
	}
}

/**
 * 独立的倒计时状态
 */
export const useCountdownState = (defaultSeconds = 60) => {
	const remainingSeconds = ref(0)
	const isRunning = ref(false)
	let timer: ReturnType<typeof setInterval> | null = null

	const formattedTime = computed(() => {
		const mins = Math.floor(remainingSeconds.value / 60)
		const secs = remainingSeconds.value % 60
		return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
	})

	const start = (seconds?: number) => {
		if (isRunning.value) return
		remainingSeconds.value = seconds ?? defaultSeconds
		isRunning.value = true
		timer = setInterval(() => {
			if (remainingSeconds.value > 0) {
				remainingSeconds.value--
			} else {
				stop()
			}
		}, 1000)
	}

	const stop = () => {
		isRunning.value = false
		if (timer) {
			clearInterval(timer)
			timer = null
		}
	}

	const reset = (seconds?: number) => {
		stop()
		remainingSeconds.value = seconds ?? defaultSeconds
	}

	onUnmounted(() => {
		stop()
	})

	return {
		remainingSeconds,
		isRunning,
		formattedTime,
		start,
		stop,
		reset
	}
}
