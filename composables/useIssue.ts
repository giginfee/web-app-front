import { CREATE_ISSUE, REMOVE_ISSUE, UPDATE_ISSUE } from "~/graphql/mutations";
import { GET_ISSUE } from "~/graphql/queries";
import { useToast } from "primevue/usetoast";
import type { IsLoading, Issue, IssueCategory } from "~/types";

type CreateIssueData = {
  title: string;
  body: string;
  category: IssueCategory;
};
type UpdateIssueData = {
  id: number;
  title?: string;
  body?: string;
  isResolved?: boolean;
  isActive?: boolean;
  category?: IssueCategory;
};

export const useIssue = () => {
  const config = useRuntimeConfig();
  const toast = useToast();
  const currentUser = useCurrentUser();
  const { $apollo } = useNuxtApp();

  const issue = ref<IsLoading | Issue>({
    isLoading: true,
  });

  async function createIssueRest(variables: CreateIssueData): Promise<string> {
    try {
      if (!currentUser.token) {
        throw new Error("Unauthenticated");
      }
      const { data } = await fetchWithAuth(
        `${config.public.apiUrl}/issues`,
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

  async function createIssueGraphql(
    variables: CreateIssueData
  ): Promise<string> {
    try {
      const result = await $apollo.defaultClient.mutate({
        mutation: CREATE_ISSUE,
        variables,
      });

      const resultData = result?.data?.createIssue;
      if (resultData?.__typename === "Issue") {
        return result.data.createIssue.id;
      } else {
        throw new Error(resultData?.message || "Unexpected error occurred");
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  }

  const createIssue = async (data: CreateIssueData) => {
    try {
      const id = config.public.isGraphql
        ? await createIssueGraphql(data)
        : await createIssueRest(data);
      navigateTo(`/issues/${id}`);
    } catch (e) {
      toast.add({
        severity: "error",
        summary: String(e),
        life: 5000,
      });
    }
  };

  async function updateIssueRest(variables: UpdateIssueData): Promise<string> {
    try {
      if (!currentUser.token) {
        throw new Error("Unauthenticated");
      }
      const { data } = await fetchWithAuth(
        `${config.public.apiUrl}/issues/${variables.id}`,
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

  async function updateIssueGraphql(
    variables: UpdateIssueData
  ): Promise<Issue> {
    try {
      const result = await $apollo.defaultClient.mutate({
        mutation: UPDATE_ISSUE,
        variables,
      });

      const resultData = result?.data?.updateIssue;
      if (resultData?.__typename === "Issue") {
        return result.data.updateIssue.id;
      } else {
        throw new Error(resultData?.message || "Unexpected error occurred");
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  }

  const updateIssue = async (data: UpdateIssueData) => {
    try {
      const id = config.public.isGraphql
        ? await updateIssueGraphql(data)
        : await updateIssueRest(data);
      navigateTo(`/issues/${id}`);
    } catch (e) {
      toast.add({
        severity: "error",
        summary: String(e),
        life: 5000,
      });
    }
  };

  const updateResolved = async (id: number, isResolved: boolean) => {
    try {
      const data = {
        id,
        isResolved,
      };
      config.public.isGraphql
        ? await updateIssueGraphql(data)
        : await updateIssueRest(data);
    } catch (e) {
      toast.add({
        severity: "error",
        summary: String(e),
        life: 5000,
      });
    }
  };

  async function removeIssueRest(id: number): Promise<null> {
    try {
      if (!currentUser.token) {
        throw new Error("Unauthenticated");
      }
      const { data } = await fetchWithAuth(
        `${config.public.apiUrl}/issues/${id}`,
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

  async function removeIssueGraphql(id: number): Promise<null> {
    try {
      const result = await $apollo.defaultClient.mutate({
        mutation: REMOVE_ISSUE,
        variables: {
          id,
        },
      });

      const resultData = result?.data?.removeIssue;
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

  const removeIssue = async (id: number) => {
    try {
      config.public.isGraphql
        ? await removeIssueGraphql(id)
        : await removeIssueRest(id);
      navigateTo(`/issues`);
    } catch (e) {
      toast.add({
        severity: "error",
        summary: String(e),
        life: 5000,
      });
    }
  };

  async function getIssueRest(id: number): Promise<Issue> {
    try {
      const { data } = await useFetch(`${config.public.apiUrl}/issues/${id}`, {
        method: "GET",
        watch: false,
      });
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

  async function getIssueGraphql(id: number): Promise<Issue> {
    try {
      const result = await $apollo.defaultClient.query({
        query: GET_ISSUE,
        variables: {
          id,
        },
      });

      const resultData = result?.data?.findOneIssue;
      if (resultData?.__typename === "Issue") {
        return result.data.findOneIssue;
      } else {
        throw new Error(resultData?.message || "Unexpected error occurred");
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  }

  const getIssue = async (id: number) => {
    try {
      issue.value = config.public.isGraphql
        ? await getIssueGraphql(id)
        : await getIssueRest(id);
    } catch (e) {
      navigateTo(`/issues`);
    }
  };

  return {
    issue,
    removeIssue,
    createIssue,
    updateIssue,
    updateResolved,
    getIssue,
  };
};
