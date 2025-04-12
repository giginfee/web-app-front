<template>
  <div
    v-if="!isLoading(issue)"
    class="flex-1 flex w-full flex-col gap-3 items-center"
  >
    <div class="global-border w-[500px] h-fit p-6 flex flex-col gap-3 group">
      <div class="w-full flex justify-between">
        <h1>{{ issue.title }}</h1>
        <span
          v-if="issue.isResolved"
          @click="() => (isUsersIssue ? toggleResolved() : null)"
          class="px-3 py-2 rounded-full bg-surface-400 text-white text-sm flex justify-center items-center"
          :class="{
            'cursor-pointer': isUsersIssue,
          }"
          >Вирішено</span
        ><span
          v-else-if="isUsersIssue"
          @click="toggleResolved"
          class="rounded-full border border-surface-500 w-6 h-6 flex justify-center items-center hover:bg-surface-200 transition-colors duration-150 cursor-pointer"
        >
          <i class="pi pi-check text-sm text-surface-500"></i>
        </span>
      </div>
      <div class="flex w-full gap-2 text-surface-500 text-xs">
        {{ issue.user.name }}
      </div>
      <div>{{ issue.body }}</div>

      <div class="w-full flex justify-between items-center">
        <div
          class="w-fit px-3 py-2 rounded-full text-white text-xs flex justify-center items-center bg-green-500"
          :class="categoryClass"
        >
          {{ categoriesTitles[issue.category] }}
        </div>
        <div
          class="flex flex-1 items-center justify-end gap-2 text-surface-500 text-xs"
        >
          <div v-if="issue.createdAt">
            {{ formatDate(new Date(issue.createdAt)) }}
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink v-if="isUsersIssue" :to="`/issues/edit?id=${issue.id}`">
              <i class="pi pi-pencil cursor-pointer hover:text-black"></i>
            </NuxtLink>
            <i
              v-if="isUsersIssue || currentUser.isAdmin"
              class="pi pi-trash cursor-pointer hover:text-black"
              @click="onDeleteIssue"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isLoading(comments)" class="w-[500px] flex flex-col gap-2">
      <div class="flex w-full justify-between">
        <h2>Коментарі:</h2>
        <Button
          size="small"
          icon="pi pi-plus"
          class="!w-8 !h-8 text-3xl"
          @click="isCommentFormVisible = true"
        ></Button>
        <CommentForm
          v-model:visible="isCommentFormVisible"
          :comment="commentToEdit"
          :issueId="issue.id"
        />
      </div>
      <div
        v-for="comment of comments.comments"
        class="global-border w-[500px] h-fit p-6 flex flex-col gap-3 group"
      >
        <div class="text-surface-500 text-sm">{{ comment.user?.name }}</div>
        <div>{{ comment.body }}</div>
        <div
          class="flex w-full justify-between items-center gap-2 text-surface-500"
        >
          <div v-if="comment.createdAt" class="text-xs flex-1">
            {{ formatDate(new Date(comment.createdAt)) }}
          </div>
          <i
            v-if="String(comment.userId) == currentUser.userId"
            class="pi pi-pencil cursor-pointer hover:text-black icon"
            @click="() => onEditComment(comment)"
          ></i>
          <i
            v-if="
              String(comment.userId) == currentUser.userId ||
              currentUser.isAdmin
            "
            class="pi pi-trash cursor-pointer hover:text-black icon"
            @click="
              () => {
                if (!!comment.id) {
                  onDeleteComment(comment.id);
                }
              }
            "
          ></i>
        </div>
      </div>
      <Button
        v-if="comments.comments.length < comments.total"
        @click="onShowMoreComments"
        label="Більше"
      ></Button>
    </div>
    <div
      v-if="!isLoading(comments) && comments.comments.length == 0"
      class="w-full flex justify-center items-center flex-1"
    >
      Тут поки порожньо
    </div>
  </div>
</template>
<script setup lang="ts">
import { categoriesTitles, categoriesBgColors, type Comment } from "~/types";

const currentUser = useCurrentUser();
const { issue, getIssue, updateResolved, removeIssue } = useIssue();
const { comments, getComments, removeComment } = useComments();
const route = useRoute();
const router = useRouter();

const commentToEdit = ref<Comment>();

const filter = ref<SearchComments>({
  limit: 10,
  offset: 0,
  issueId: Number(route.params.id),
});

const isCommentFormVisible = ref(false);
const isUsersIssue = computed(
  () =>
    !isLoading(issue.value) && String(issue.value.userId) == currentUser.userId
);
const categoryClass = computed(() =>
  !isLoading(issue.value)
    ? `bg-${categoriesBgColors[issue.value.category]}-500`
    : "bg-red-500"
);

const toggleResolved = () => {
  if (!isLoading(issue.value) && issue.value.id) {
    const id = issue.value.id;
    updateResolved(id, !issue.value.isResolved).then(() => getIssue(id));
  }
};

const onDeleteIssue = () => {
  if (!isLoading(issue.value) && issue.value.id) {
    removeIssue(issue.value.id);
  }
};

const onDeleteComment = async (id: number) => {
  await removeComment(id);
  if (filter.value.offset != 0) {
    filter.value.offset = 0;
  } else {
    getComments(filter.value);
  }
};
const onEditComment = (comment: Comment) => {
  commentToEdit.value = { ...comment };
  isCommentFormVisible.value = true;
};

const onShowMoreComments = () => {
  filter.value.offset += filter.value.limit;
};

watch(
  filter,
  (newVal, oldVal) => {
    getComments(filter.value);
  },
  { deep: true }
);

watch(isCommentFormVisible, () => {
  if (!isCommentFormVisible.value) {
    commentToEdit.value = undefined;
    if (filter.value.offset != 0) {
      filter.value.offset = 0;
    } else {
      getComments(filter.value);
    }
  }
});

onMounted(async () => {
  const id = route.params.id;
  if (id) {
    await getIssue(Number(id));
    if (!isLoading(issue.value)) {
      await getComments(filter.value);
      return;
    }
  }
  router.push("/issues");
});
</script>
<style>
.icon {
  @apply group-hover:!opacity-100 transition-opacity  opacity-0 duration-150 cursor-pointer;
}
</style>
