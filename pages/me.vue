<template>
  <div class="flex-1 flex w-full flex-col gap-3">
    <div class="flex gap-4 items-center">
      <span
        class="rounded-full border border-surface-600 w-32 h-32 flex justify-center items-center"
      >
        <i class="pi pi-user text-[75px] text-surface-600"></i>
      </span>
      <div class="flex flex-col gap-3">
        <h2 class="text-5xl">
          {{ currentUser.name }}
        </h2>
        <div class="flex flex-col gap-1 flex-1">
          {{ currentUser.email }}
          <div
            v-if="currentUser.role == 'admin'"
            class="text-surface-700 text-sm"
          >
            Адміністратор
          </div>
        </div>
      </div>
      <div class="flex-1 flex justify-end">
        <NuxtLink to="/issues/new"
          ><Button label="Додати пост"></Button
        ></NuxtLink>
      </div>
    </div>

    <Divider class=""></Divider>

    <div class="w-full flex justify-between">
      <div class="text-3xl font-medium">Мої пости:</div>
      <div class="flex flex-wrap gap-4">
        <div class="flex items-center gap-2">
          <RadioButton v-model="isResolved" inputId="mode2" :value="'all'" />
          <label for="mode2">Усі</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton v-model="isResolved" inputId="mode3" :value="true" />
          <label for="mode3">Вирішені</label>
        </div>
        <div class="flex items-center gap-2">
          <RadioButton v-model="isResolved" inputId="mode4" :value="false" />
          <label for="mode4">Не вирішені</label>
        </div>
      </div>
    </div>

    <div v-if="!isLoading(issues)" class="flex w-full flex-col items-center">
      <div class="w-full grid grid-cols-4 gap-5">
        <IssuePreview
          v-for="issue of issues.issues"
          :issue="issue"
        ></IssuePreview>
      </div>

      <Button
        class="mr-0 mt-5 !w-fit"
        v-if="
          !isLoadingIssues &&
          !isLoading(issues) &&
          issues.issues.length < issues.total
        "
        label="Більше"
        @click="onShowMore"
      ></Button>
    </div>
    <div
      v-if="isLoadingIssues || isLoading(issues)"
      class="w-full flex justify-center items-center flex-1"
    >
      <i class="text-3xl pi pi-spin pi-spinner"></i>
    </div>
    <div
      v-if="!isLoadingIssues && !isLoading(issues) && issues.issues.length == 0"
      class="w-full flex justify-center items-center flex-1"
    >
      Тут поки порожньо
    </div>
  </div>
</template>
<script setup lang="ts">
const { isLoadingIssues, issues, getIssues } = useIssues();
const currentUser = useCurrentUser();

const isResolved = ref<boolean | "all">("all");

const filter = ref<SearchIssues>({
  limit: 12,
  offset: 0,
  userId: Number(currentUser.userId) ?? 1,
  category: undefined,
  isResolved: undefined,
});

const onShowMore = () => {
  filter.value.offset += filter.value.limit;
};

watch(
  filter,
  (newVal, oldVal) => {
    getIssues(filter.value);
  },
  { deep: true }
);

watch(
  isResolved,
  () => {
    if (isResolved.value == "all") {
      filter.value.isResolved = undefined;
    } else {
      filter.value.isResolved = isResolved.value;
    }
  },
  { deep: true }
);

onMounted(async () => {
  getIssues(filter.value);
});

definePageMeta({
  middleware: "auth",
});
</script>
