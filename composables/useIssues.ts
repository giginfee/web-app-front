import { GET_ISSUES } from "~/graphql/queries";
import {
  type IsLoading,
  type Issue,
  IssueCategory,
  type Issues,
} from "~/types";

export type SearchIssues = {
  limit: number;
  offset: number;
  category?: IssueCategory;
  isResolved?: boolean;
  title?: string;
  userId?: number;
};

export const useIssues = () => {
  const route = useRoute();
  const config = useRuntimeConfig();
  const toast = useToast();
  const currentUser = useCurrentUser();
  const { $apollo } = useNuxtApp();

  const isError = ref<boolean>(false);
  const isLoadingIssues = ref<boolean>(false);
  const issues = ref<IsLoading | Issues>({
    isLoading: true,
  });

  async function getIssuesRest(variables: SearchIssues): Promise<Issues> {
    try {
      const { data } = await useFetch(`${config.public.apiUrl}/issues`, {
        method: "GET",
        watch: false,
        params: variables,
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

  const getIssuesGraphql = async (variables: SearchIssues): Promise<Issues> => {
    try {
      const result = await $apollo.defaultClient.query({
        query: GET_ISSUES,
        variables,
      });

      const resultData = result?.data?.getIssues;
      if (resultData?.__typename === "Issues") {
        return result.data.getIssues;
      } else {
        throw new Error(resultData?.message || "Unexpected error occurred");
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  };

  const getIssues = async (
    variables: SearchIssues,
    skipLoading: boolean = false
  ) => {
    try {
      if (!skipLoading) {
        isLoadingIssues.value = true;
      }
      isError.value = false;
      if (variables.offset == 0 && !skipLoading) {
        issues.value = {
          isLoading: true,
        };
      }
      // await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve(null);
      //   }, 1000);
      // });

      const result = config.public.isGraphql
        ? await getIssuesGraphql(variables)
        : await getIssuesRest(variables);
      if (variables.offset == 0) {
        issues.value = result;
      } else if (!isLoading(issues.value)) {
        issues.value.issues = [...issues.value.issues, ...result.issues];
      }
      isLoadingIssues.value = false;
    } catch (e) {
      isError.value = true;
    }
  };

  return {
    isError,
    issues,
    isLoadingIssues,
    getIssues,
  };
};
