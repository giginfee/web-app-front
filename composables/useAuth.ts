import { LOGIN, REGISTER } from "~/graphql/mutations";
import { useToast } from "primevue/usetoast";

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

export const useAuth = () => {
  const config = useRuntimeConfig();
  const toast = useToast();
  const currentUser = useCurrentUser();
  const { onLogin } = useApollo();
  const { $apollo } = useNuxtApp();

  function logInRest({ email, password }: LoginData): Promise<string> {
    const variables = {
      email: email,
      password: password,
    };

    return new Promise(async (resolve, reject) => {
      const { data } = await useFetch(`${config.public.apiUrl}/auth/login`, {
        body: variables,
        method: "POST",
        watch: false,
      });
      console.log(data);
      if ((data.value as any).status === "success") {
        resolve((data.value as any)?.data.token);
      } else {
        reject((data.value as any)?.message);
      }
    });
  }

  async function logInGraphql({ email, password }: LoginData): Promise<string> {
    const variables = {
      email: email,
      password: password,
    };
    try {
      const result = await $apollo.defaultClient.mutate({
        mutation: LOGIN,
        variables,
      });

      const loginData = result?.data?.login;
      if (loginData?.__typename === "Token") {
        return loginData.token;
      } else {
        throw new Error(loginData?.message || "Unexpected error occurred");
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  }

  async function signUpRest(variables: RegisterData): Promise<null> {
    try {
      const { data } = await useFetch(`${config.public.apiUrl}/auth/register`, {
        body: variables,
        method: "POST",
        watch: false,
      });
      console.log(data);
      if ((data.value as any).status === "success") {
        return null;
      } else {
        throw new Error((data.value as any)?.message);
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  }

  async function signUpGraphql(data: RegisterData): Promise<null> {
    try {
      const result = await $apollo.defaultClient.mutate({
        mutation: REGISTER,
        variables: data,
      });

      const registerData = result?.data?.register;
      if (registerData?.__typename === "User") {
        return null;
      } else {
        throw new Error(registerData?.message || "Unexpected error occurred");
      }
    } catch (error: any) {
      console.error("Apollo mutation error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  }

  const logIn = async (data: LoginData) => {
    try {
      const token = config.public.isGraphql
        ? await logInGraphql(data)
        : await logInRest(data);
      currentUser.setToken(token);
      onLogin(token);
      const path = "/me";
      navigateTo(path);
    } catch (e) {
      toast.add({
        severity: "error",
        summary: String(e),
        life: 5000,
      });
    }
  };

  const signUp = async (data: RegisterData) => {
    try {
      const token = config.public.isGraphql
        ? await signUpGraphql(data)
        : await signUpRest(data);
      navigateTo("/confirm-email");
    } catch (e) {
      toast.add({
        severity: "error",
        summary: String(e),
        life: 5000,
      });
    }
  };

  return {
    logIn,
    signUp,
  };
};
