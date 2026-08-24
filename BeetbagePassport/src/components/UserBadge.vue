<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import level1Badge from '@/assets/badge/level1badge_icon.png'
import level2Badge from '@/assets/badge/level2badge_icon.png'
import level3Badge from '@/assets/badge/level3badge_icon.png'
import level4Badge from '@/assets/badge/level4badge_icon.png'

const authStore = useAuthStore()
const userStore = useUserStore()

const badgeAssets: Record<number, string> = {
	1: level1Badge,
	2: level2Badge,
	3: level3Badge,
	4: level4Badge
}

const currentLevel = computed(() => {
	const username = authStore.currentUser?.username
	const user = userStore.users.find((u) => u.username === username)
	return Math.min(Math.max(user?.level ?? authStore.currentUser?.level ?? 1, 1), 4)
})

const badges = computed(() =>
	Array.from({ length: 4 }, (_, index) => {
		const level = index + 1
		return {
			level,
			title: userStore.getLevelDetail(level)?.title ?? `Level ${level} Badge`,
			image: badgeAssets[level],
			unlocked: level <= currentLevel.value
		}
	})
)
</script>

<template>
	<section class="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm min-h-125">
		<div class="flex items-start justify-between gap-6 mb-8">
			<div>
				<h2 class="text-xl font-extrabold text-slate-900">Badges</h2>
				<p class="text-xs text-slate-400 mt-1">Your CAMT Passport badges and unlocked levels.</p>
			</div>
		</div>

		<section class="border border-slate-300 rounded-2xl p-6 mb-6 flex flex-col md:flex-row md:items-center gap-6">
			<div class="w-32 h-32 shrink-0 flex items-center justify-center">
				<img
					:src="badgeAssets[currentLevel]"
					:alt="`Level ${currentLevel} badge`"
					class="w-32 h-32 object-contain"
				/>
			</div>
			<div>
				<span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Badge</span>
				<h3 class="text-xl font-extrabold text-purple-600 mt-1">
					{{ userStore.getLevelDetail(currentLevel)?.title ?? `Level ${currentLevel} Badge` }}
				</h3>
				<p class="text-xs text-slate-500 mt-1">Level {{ currentLevel }} unlocked.</p>
			</div>
		</section>

		<section>
			<h3 class="font-bold text-slate-800 text-sm mb-4">Badge Collection</h3>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div
					v-for="badge in badges"
					:key="badge.level"
					class="border border-slate-300 rounded-2xl p-5 flex flex-col items-center text-center"
					:class="badge.unlocked ? 'bg-white' : 'bg-slate-50'"
				>
					<div class="w-32 h-32 flex items-center justify-center">
						<img
							:src="badge.image"
							:alt="`Level ${badge.level} badge`"
							class="w-32 h-32 object-contain"
							:class="badge.unlocked ? '' : 'grayscale opacity-40'"
						/>
					</div>
					<p class="text-xs font-bold text-slate-800 mt-3">Level {{ badge.level }}</p>
					<p class="text-[11px] text-slate-500 mt-1">{{ badge.title }}</p>
					<span
						class="mt-3 text-[10px] font-semibold"
						:class="badge.unlocked ? 'text-purple-600' : 'text-slate-400'"
					>
						{{ badge.unlocked ? 'Unlocked' : 'Locked' }}
					</span>
				</div>
			</div>
		</section>
	</section>
</template>
