import { defineStore } from "pinia";
import cookies from "js-cookie";

const TOKEN_KEY = "token";
const removeToken = () => {
  if (process.server) {
    const host = useRequestHeaders(["host"]).host;

    useCookie(TOKEN_KEY, {
      path: "/",
      maxAge: -1,
      domain: host,
    });
    useCookie(TOKEN_KEY, {
      path: "/",
      maxAge: -1,
    });
  } else {
    const host = window.location.hostname;
    cookies.remove(TOKEN_KEY, { path: "/", domain: host });
    cookies.remove(TOKEN_KEY);
  }
};

const getTokenPayload = (token: string | null) => {
  if (!token) {
    return {
      token: null,
      userId: null,
      email: null,
      name: null,
      role: null,
    };
  }
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp <= currentTime) {
      throw new Error("Token expired");
    }
    return {
      token: token,
      userId: decodedToken.userId,
      email: decodedToken.email,
      name: decodedToken.name,
      role: decodedToken.role,
      exp: decodedToken.exp,
    };
  } catch (error) {
    console.error("Invalid token format", error);
    removeToken();
    return {
      token: null,
      userId: null,
      email: null,
      name: null,
      role: null,
    };
  }
};

export const useCurrentUser = defineStore("currentUser", {
  state: () => {
    // const token = cookies.get(TOKEN_KEY) || null;
    const token =
      (process.server ? useCookie(TOKEN_KEY).value : cookies.get(TOKEN_KEY)) ||
      null;

    const payload = getTokenPayload(token);
    const store: {
      userId: string | null;
      email: string | null;
      token: string | null;
      name: string | null;
      role: string | null;
    } = {
      userId: payload.userId,
      email: payload.email,
      token: payload.token,
      name: payload.name,
      role: payload.role,
    };

    return store;
  },
  getters: {
    isAuthenticated: (state) => {
      return !!state.email;
    },
    isAdmin: (state) => {
      return state.role =='admin';
    },
  },
  actions: {
    logout() {
      removeToken();
      this.token = null;
      this.userId = null;
      this.email = null;
      this.name = null;
      this.role = null;
    },
    setToken(token: string) {
      const payload = getTokenPayload(token);
      this.userId = payload.userId;
      this.email = payload.email;
      this.token = payload.token;
      this.name = payload.name;
      this.role = payload.role;

      if (payload.exp) {
        const expires = new Date(payload.exp * 1000);
        cookies.set(TOKEN_KEY, token, { expires });
      } else {
        cookies.set(TOKEN_KEY, token);
      }
    },
  },
});
