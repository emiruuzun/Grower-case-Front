import { getCookie } from "../utils/cookie-manager";

// .env'den gelen API URL'si
const API_URL = process.env.REACT_APP_API_URL;

export const getUserProfile = async () => {
  const apiRequest = await fetch(`${API_URL}/v1/api/auth/profile`, {
    headers: {
      Authorization: `Bearer: ${getCookie("access_token")}`,
    },
    credentials: "include",
  });
  const data = await apiRequest.json();
  return data;
};
