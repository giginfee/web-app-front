<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="comment ? 'Редагувати коментар' : 'Додати коментар'"
    :style="{ width: '25rem' }"
    dismissable-mask
  >
    <Textarea fluid v-model="body"> </Textarea>
    <Button
      type="button"
      label="Save"
      :disabled="!body"
      @click="onclick"
    ></Button>
  </Dialog>
</template>
<script setup lang="ts">
import { type ApiResultStatus, type Comment } from "~/types";

const visible = defineModel("visible", { default: false });
const { createComment, updateComment } = useComments();

const props = defineProps({
  comment: { type: Object as PropType<Comment> },
  issueId: { type: Number, required: true },
});

const body = ref("");

watch(visible, () => {
  if (props.comment && visible.value) {
    body.value = props.comment?.body;
  }
});

const onclick = async () => {
  if (!body.value) {
    return;
  }
  let result: ApiResultStatus = {
    status: "error",
    message: "",
  };
  if (!props.comment) {
    result = await createComment({
      body: body.value,
      issueId: props.issueId,
    });
  } else if (props.comment.id) {
    result = await updateComment({
      body: body.value,
      id: props.comment.id,
    });
  }

  if (result.status == "success") {
    visible.value = false;
    body.value = "";
  }
};
</script>
