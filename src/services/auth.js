import { toast } from "react-toastify";
import { setCookie, deleteCookie, getCookie } from "../utils/cookie-manager";

// .env'den gelen API URL'si
const API_URL = process.env.REACT_APP_API_URL;

export const registerUser = async (user, navigate) => {
  try {
    const apiRequest = await fetch(`${API_URL}/v1/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await apiRequest.json();
    if (data.success) {
      toast.success("Registration successful", { autoClose: 2000 });
      setTimeout(() => {
        navigate("/giris");
      }, 3000);
    } else {
      toast.error(data.message);
    }
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("Registration failed");
    throw new Error("API request failed");
  }
};

export const loginUser = async (user, navigate) => {
  const { name, email, password } = user;

  try {
    const apiRequest = await fetch(`${API_URL}/v1/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await apiRequest.json();
    if (data.success) {
      const access_token = data.access_token;

      setCookie("access_token", access_token, 1);

      toast.success("Login successful", { autoClose: 2000 });
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } else {
      toast.error(data.message);
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("Login failed");
    throw new Error("API request failed");
  }
};

export const logoutUser = async (navigate) => {
  try {
    const apiRequest = await fetch(`${API_URL}/v1/api/auth/logout`, {
      method: "GET",
      headers: {
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
      credentials: "include",
    });

    const data = await apiRequest.json();
    if (data.success) {
      deleteCookie("access_token");
      localStorage.removeItem("user");
      toast.success("Logout successful", { autoClose: 2000 });
      setTimeout(() => {
        navigate("/giris");
      }, 2000);
    } else {
      toast.error(data.message);
    }
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("Logout failed");
    throw new Error("API request failed");
  }
};
