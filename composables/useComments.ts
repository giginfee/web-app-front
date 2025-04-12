import {
  CREATE_COMMENT,
  REMOVE_COMMENT,
  UPDATE_COMMENT,
} from "~/graphql/mutations";
import { GET_COMMENTS } from "~/graphql/queries";
import { type ApiResultStatus, type Comments, type IsLoading } from "~/types";

export type SearchComments = {
  limit: number;
  offset: number;
  issueId: number;
};
type CreateCommentData = {
  body: string;
  issueId: number;
};

type UpdateCommentData = {
  body: string;
  id: number;
};

export const useComments = () => {
  const route = useRoute();
  const config = useRuntimeConfig();
  const toast = useToast();
  const currentUser = useCurrentUser();
  const { $apollo } = useNuxtApp();

  const isError = ref<boolean>(false);

  const comments = ref<IsLoading | Comments>({
    isLoading: true,
  });

  async function createCommentRest(
    variables: CreateCommentData
  ): Promise<string> {
    try {
      if (!currentUser.token) {
        throw new Error("Unauthenticated");
      }
      const { data } = await fetchWithAuth(
        `${config.public.apiUrl}/comments`,
        currentUser.token,
        {
          body: variables,
          method: "POST",
          watch: false,
        }
      );
      if ((data.value as any)?.status === "success") {
        return (data.value as any).data.id;
      } else {
        throw new Error((data.value as any)?.message);
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || error || "Network error occurred");
    }
  }

  async function createCommentGraphql(
    variables: CreateCommentData
  ): Promise<string> {
    try {
      const result = await $apollo.defaultClient.mutate({
        mutation: CREATE_COMMENT,
        variables,
      });

      const resultData = result?.data?.createComment;
      if (resultData?.__typename === "Comment") {
        return result.data.createComment.id;
      } else {
        throw new Error(resultData?.message || "Unexpected error occurred");
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  }

  const createComment = async (
    data: CreateCommentData
  ): Promise<ApiResultStatus> => {
    try {
      config.public.isGraphql
        ? await createCommentGraphql(data)
        : await createCommentRest(data);
      return {
        status: "success",
        message: "",
      };
    } catch (e) {
      toast.add({
        severity: "error",
        summary: String(e),
        life: 5000,
      });
      return {
        status: "error",
        message: String(e),
      };
    }
  };

  async function updateCommentRest(
    variables: UpdateCommentData
  ): Promise<string> {
    try {
      if (!currentUser.token) {
        throw new Error("Unauthenticated");
      }
      const { data } = await fetchWithAuth(
        `${config.public.apiUrl}/comments/${variables.id}`,
        currentUser.token,
        {
          body: variables,
          method: "PATCH",
          watch: false,
        }
      );
      if ((data.value as any)?.status === "success") {
        return (data.value as any).data.id;
      } else {
        throw new Error((data.value as any)?.message);
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || error || "Network error occurred");
    }
  }

  async function updateCommentGraphql(
    variables: UpdateCommentData
  ): Promise<string> {
    try {
      const result = await $apollo.defaultClient.mutate({
        mutation: UPDATE_COMMENT,
        variables,
      });

      const resultData = result?.data?.updateComment;
      if (resultData?.__typename === "Comment") {
        return result.data.updateComment.id;
      } else {
        throw new Error(resultData?.message || "Unexpected error occurred");
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  }

  const updateComment = async (
    data: UpdateCommentData
  ): Promise<ApiResultStatus> => {
    try {
      config.public.isGraphql
        ? await updateCommentGraphql(data)
        : await updateCommentRest(data);
      return {
        status: "success",
        message: "",
      };
    } catch (e) {
      toast.add({
        severity: "error",
        summary: String(e),
        life: 5000,
      });
      return {
        status: "error",
        message: String(e),
      };
    }
  };

  async function getCommentsRest(variables: SearchComments): Promise<Comments> {
    try {
      const { data } = await useFetch(`${config.public.apiUrl}/comments`, {
        method: "GET",
        watch: false,
        params: variables,
      });
      console.log(data);
      if ((data.value as any)?.status === "success") {
        return (data.value as any).data;
      } else {
        throw new Error((data.value as any)?.message);
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || error || "Network error occurred");
    }
  }

  const getCommentsGraphql = async (
    variables: SearchComments
  ): Promise<Comments> => {
    try {
      const result = await $apollo.defaultClient.query({
        query: GET_COMMENTS,
        variables,
      });

      const resultData = result?.data?.getComments;
      if (resultData?.__typename === "Comments") {
        return result.data.getComments;
      } else {
        throw new Error(resultData?.message || "Unexpected error occurred");
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  };

  const getComments = async (variables: SearchComments) => {
    try {
      isError.value = false;
      const result = config.public.isGraphql
        ? await getCommentsGraphql(variables)
        : await getCommentsRest(variables);
      if (variables.offset == 0) {
        comments.value = result;
      } else if (!isLoading(comments.value)) {
        comments.value.comments = [
          ...comments.value.comments,
          ...result.comments,
        ];
      }
      console.log(result);
    } catch (e) {
      isError.value = true;
    }
  };

  async function removeCommentRest(id: number): Promise<null> {
    try {
      if (!currentUser.token) {
        throw new Error("Unauthenticated");
      }
      const { data } = await fetchWithAuth(
        `${config.public.apiUrl}/comments/${id}`,
        currentUser.token,
        {
          method: "DELETE",
          watch: false,
        }
      );
      if ((data.value as any)?.status === "success") {
        return null;
      } else {
        throw new Error((data.value as any)?.message);
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || error || "Network error occurred");
    }
  }

  async function removeCommentGraphql(id: number): Promise<null> {
    try {
      const result = await $apollo.defaultClient.mutate({
        mutation: REMOVE_COMMENT,
        variables: {
          id,
        },
      });

      const resultData = result?.data?.removeComment;
      if (!resultData) {
        return null;
      } else {
        throw new Error(resultData?.message || "Unexpected error occurred");
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  }

  const removeComment = async (id: number) => {
    try {
      config.public.isGraphql
        ? await removeCommentGraphql(id)
        : await removeCommentRest(id);
    } catch (e) {
      toast.add({
        severity: "error",
        summary: String(e),
        life: 5000,
      });
    }
  };

  return {
    isError,
    comments,
    getComments,
    createComment,
    updateComment,
    removeComment,
  };
};
