import { toast } from "react-toastify";
import { getCookie } from "../utils/cookie-manager";

// .env'den gelen API URL'si
const API_URL = process.env.REACT_APP_API_URL;

export const getProjects = async () => {
  try {
    const apiRequest = await fetch(
      `${API_URL}/v1/api/project/project-list`,
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

    if (Array.isArray(data)) {
      toast.success("Projeler başarıyla yüklendi", { autoClose: 2000 });
      return data;
    } else {
      toast.error("Projeler yüklenemedi");
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("Projeler yüklenemedi");
    throw error;
  }
};

export const getSeoAnalysis = async (projectId) => {
  try {
    const apiRequest = await fetch(
      `${API_URL}/v1/api/project/seo-analysis/${projectId}`,
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

    if (data) {
      toast.success("SEO analiz verileri yüklendi", { autoClose: 2000 });
      return data;
    } else {
      toast.error("SEO analiz verileri yüklenemedi");
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("SEO analiz verileri yüklenemedi");
    throw error;
  }
};
