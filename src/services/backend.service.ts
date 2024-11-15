import { IUser } from "@/interfaces/user.interface";
import Cookies from "js-cookie";

const BACKEND_URL = "http://127.0.0.1:8080/api";

const getToken = (): string | null => {
  const token = Cookies.get("token");
  if (!token) {
    Cookies.remove("token");
    window.location.href = "/";
    return null;
  }
  return token;
};

const handleFetchError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
};

const fetchWithAuth = async (
  url: string,
  options: RequestInit
): Promise<any> => {
  const token = getToken();
  if (!token) return [];

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  await handleFetchError(response);
  return response.json();
};

export const backendService = {
  deleteUser: async (id: number): Promise<any> => {
    try {
      return await fetchWithAuth(`${BACKEND_URL}/users/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.log("Error deleting user:", (error as Error).message);
      throw error;
    }
  },

  getAllUsers: async (): Promise<IUser[]> => {
    try {
      return await fetchWithAuth(`${BACKEND_URL}/users`, {});
    } catch (error) {
      console.error("Error fetching users:", (error as Error).message);
      throw error;
    }
  },

  postUser: async (body: IUser): Promise<IUser | undefined> => {
    try {
      return await fetchWithAuth(`${BACKEND_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error("Error creating user:", (error as Error).message);
      throw error;
    }
  },

  updateUser: async (body: IUser): Promise<IUser | undefined> => {
    try {
      return await fetchWithAuth(`${BACKEND_URL}/users/${body.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error("Error updating user:", (error as Error).message);
      throw error;
    }
  },
};
