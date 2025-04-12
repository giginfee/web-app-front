<template>
  <div class="flex-1 flex w-full flex-col gap-3">
    <div class="flex justify-between gap-3">
      <div class="flex gap-3 items-center flex-1">
        <div
          class="rounded-full h-fit py-1 px-4 cursor-pointer text-white transition-colors duration-150 flex items-center"
          v-for="category of categories"
          :class="[
            `bg-${categoriesBgColors[category.value]}-500`,
            `hover:bg-${categoriesBgColors[category.value]}-600`,
            {
              'opacity-40':
                filter.category && filter.category != category.value,
            },
          ]"
          @click="
            onChangeCategory(
              filter.category != category.value ? category.value : undefined
            )
          "
        >
          {{ category.title }}
        </div>
      </div>
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="searchText"
          placeholder="Шукати"
          class="!rounded-full"
        />
      </IconField>
      <Button @click="onSearch" :disabled="!searchText" label="Шукати"></Button>
    </div>
    <Divider class=""></Divider>

    <div class="text-3xl font-medium">Пости:</div>
    <div
      v-if="isError"
      class="text-3xl h-[150px] w-full text-center flex items-center"
    >
      Сталась помилка. Будь ласка, спробуйте перезавантажити сторінку
    </div>
    <div
      v-else-if="!isLoading(issues)"
      class="flex w-full flex-col items-center"
    >
      <div class="grid w-full grid-cols-4 gap-5">
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
        @click="onShowMore"
        label="Більше"
      ></Button>
    </div>
    <div
      v-else-if="isLoadingIssues || isLoading(issues)"
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
import { categories, categoriesBgColors, IssueCategory } from "~/types";

const { isError, issues, isLoadingIssues, getIssues } = useIssues();

const searchText = ref<string>();
const filter = ref<SearchIssues>({
  limit: 12,
  offset: 0,
  category: undefined,
  isResolved: false,
});

const onChangeCategory = (category?: IssueCategory) => {
  filter.value = { ...filter.value, offset: 0, category };
};

const onSearch = () => {
  filter.value = { ...filter.value, offset: 0, title: searchText.value };
};

const onShowMore = () => {
  filter.value.offset += filter.value.limit;
};

watch(
  filter,
  (newVal, oldVal) => {
    console.log("Filter changed:", { newVal, oldVal });
    getIssues(filter.value);
  },
  { deep: true }
);

let interval: NodeJS.Timeout | null = null;
onMounted(async () => {
  await getIssues(filter.value);

  interval = setInterval(() => {
    if (filter.value.offset == 0) {
      getIssues(filter.value, true);
    }
  }, 30000);
});

onUnmounted(() => {
  if (!!interval) clearInterval(interval);
});
</script>
