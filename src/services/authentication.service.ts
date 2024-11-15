import { ILoginCredentials } from "@/interfaces/login.interface";

import Cookies from "js-cookie";

const BACKEND_URL = "https://plankton-app-dlawl.ondigitalocean.app/prueba-back2/api/auth";

const fetchWithInterceptor = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  const response = await fetch(url, options);

  if (response.status === 401) {
    console.error("Unauthorized! Redirecting to login...");
    Cookies.remove("token");
    window.location.href = "/";
  }

  return response;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${
        errorData.message || response.statusText
      }`
    );
  }
  return response.json();
};

export const authenticationService = {
  login: async (credentials: ILoginCredentials): Promise<any> => {
    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await handleResponse(response);
      Cookies.set("token", data.token);
      return data;
    } catch (error) {
      console.log("Error logging in:", (error as Error).message);
      return false;
    }
  },

  logOut: async (): Promise<boolean> => {
    try {
      const token = Cookies.get("token");

      const response = await fetchWithInterceptor(`${BACKEND_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      await handleResponse(response);
      Cookies.remove("token");
      return true;
    } catch (error) {
      console.error("Error logging out:", (error as Error).message);
      return false;
    }
  },

  userDetails: async (): Promise<any> => {
    const token = Cookies.get("token");

    if (!token) {
      console.error("No token found! Redirecting to login...");
      window.location.href = "/";
      return false;
    }

    try {
      const response = await fetchWithInterceptor(`${BACKEND_URL}/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error("Error getting user details:", (error as Error).message);
      return false;
    }
  },
};
