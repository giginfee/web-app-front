<template>
  <div class="flex-1 flex w-full justify-center">
    <div class="global-border w-[500px] h-fit p-6 flex flex-col gap-3">
      <h2 class="w-full text-center">Створити пост</h2>
      <Select
        placeholder="Оберіть категорію"
        :options="categories"
        v-model="category"
        optionLabel="title"
        optionValue="value"
      />

      <div class="w-full">
        <div class="mb-1">Заголовок</div>
        <InputText v-model="title" fluid />
      </div>
      <div class="w-full">
        <div class="mb-1">Текст</div>
        <Textarea v-model="body" class="min-h-52" fluid />
      </div>
      <Button
        :disabled="disabled"
        class="mt-2"
        label="Створити"
        @click="onCreate"
      ></Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useToast } from "primevue";
import { categories, type IssueCategory } from "~/types";
const toast = useToast();
const router = useRouter();
const { createIssue } = useIssue();

const title = ref<string>("");
const body = ref<string>("");
const category = ref<IssueCategory>();

const disabled = computed(() => !title.value || !body.value || !category.value);
const onCreate = () => {
  if (disabled.value || !category.value) {
    toast.add({
      severity: "error",
      summary: "Введіть дані посту",
      life: 2000,
    });
  } else {
    createIssue({
      title: title.value,
      body: body.value,
      category: category.value,
    });
  }
};

definePageMeta({
  middleware: "auth",
});
</script>
