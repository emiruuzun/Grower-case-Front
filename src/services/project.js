import { toast } from "react-toastify";
import { getCookie } from "../utils/cookie-manager";

export const getProjects = async () => {
  try {
    const apiRequest = await fetch(
      "http://localhost:8000/v1/api/project/project-list",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },

        credentials: "include",
      }
    );

    const data = await apiRequest.json();
    if (data.success) {
      toast.success("Success", { autoClose: 2000 });
    } else {
      toast.error(data.message);
    }
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("failed");
    throw new Error("API request failed");
  }
};
