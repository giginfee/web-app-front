<template>
  <div
    class="flex-1 flex w-full justify-center flex-col gap-3 global-border h-fit p-6 group cursor-pointer"
    @click="router.push(`issues/${issue.id}`)"
  >
    <div class="w-full flex justify-between">
      <h1>{{ issue.title }}</h1>
      <span
        v-if="issue.isResolved"
        class="px-3 py-2 rounded-full bg-surface-400 text-white text-sm flex justify-center items-center"
        >Вирішено</span
      >
    </div>
    <div>
      {{
        issue.body.length > 50 ? issue.body.slice(0, 100) + "..." : issue.body
      }}
    </div>

    <div class="w-full flex justify-between items-center">
      <div
        class="w-fit px-3 py-2 rounded-full text-white text-xs flex justify-center items-center"
        :class="[`bg-${categoriesBgColors[issue.category]}-500`]"
      >
        {{ categoriesTitles[issue.category] }}
      </div>
      <div
        class="flex flex-1 items-center justify-end gap-2 text-surface-500 text-xs"
      >
        <div v-if="issue.createdAt">
          {{ formatDate(new Date(issue.createdAt)) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { categoriesBgColors, categoriesTitles, type Issue } from "~/types";

const router = useRouter();
defineProps({
  issue: { type: Object as PropType<Issue>, required: true },
});
</script>
