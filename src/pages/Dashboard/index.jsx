import React, { useEffect, useState } from "react";
import Dashboardlayout from "../../layout/DashboardLayout";
import { getProjects, getSeoAnalysis } from "../../services/project";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of Link

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectList = await getProjects();
        const fullData = await Promise.all(
          projectList.map(async (project) => {
            const seoData = await getSeoAnalysis(project._id);
            return { ...project, seo: seoData };
          })
        );
        setProjects(fullData);
      } catch (err) {
        console.error("Dashboard verisi alınamadı", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getPercentageColor = (percentage) => {
    if (percentage > 0) return "text-emerald-600";
    if (percentage < 0) return "text-rose-600";
    return "text-gray-600";
  };

  // Handler function for navigating to project details
  const navigateToProject = (projectId) => {
    navigate(`/project/${projectId}/analysis`);
  };

  // Handler for list view navigation
  const navigateToProjectAnalysis = (projectId) => {
    navigate(`/project/${projectId}/analysis`);
  };

  // Handler for new project creation
  const navigateToNewProject = () => {
    navigate("/dashboard/projects/new");
  };

  return (
    <Dashboardlayout>
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header section */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                <span className="mr-2">📊</span> Dashboard
                <span className="ml-2 text-sm font-normal text-slate-500 bg-slate-100 py-1 px-3 rounded-full">
                  {projects.length} Proje
                </span>
              </h1>
              <p className="text-slate-500 mt-1">
                Projelerinizi ve SEO performansını görüntüleyin
              </p>
            </div>

            {/* View toggle and actions */}
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg flex p-1 shadow-sm border border-slate-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded ${
                    viewMode === "grid"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded ${
                    viewMode === "list"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </button>
              </div>

              <button
                onClick={navigateToNewProject}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                Yeni Proje
              </button>
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600">Projeler yükleniyor...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="text-indigo-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-slate-800 mb-2">
                Henüz proje bulunmuyor
              </h2>
              <p className="text-slate-500 mb-6">
                İlk projenizi oluşturarak SEO performansınızı izlemeye başlayın.
              </p>
              <button
                onClick={navigateToNewProject}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-sm transition"
              >
                İlk Projeyi Oluştur
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-md transition group"
                >
                  <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold text-slate-800 group-hover:text-indigo-700 transition mb-1 line-clamp-1">
                        {project.name}
                      </h2>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
                        Aktif
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                        <div className="flex items-center">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                            🌐
                          </span>
                          <div>
                            <p className="text-xs text-slate-500">
                              Website Trafiği
                            </p>
                            <p className="font-semibold text-slate-800">
                              {project.seo.traffic.websiteTraffic.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${getPercentageColor(
                              project.seo.comparativeTrafficData.twentyEightDays
                                .websiteTraffic?.differencePercentage || 0
                            )}`}
                          >
                            {(project.seo.comparativeTrafficData.twentyEightDays
                              .websiteTraffic?.differencePercentage > 0
                              ? "+"
                              : "") +
                              project.seo.comparativeTrafficData.twentyEightDays
                                .websiteTraffic?.differencePercentage}
                            %
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                        <div className="flex items-center">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 mr-3">
                            🚀
                          </span>
                          <div>
                            <p className="text-xs text-slate-500">
                              Organik Trafik
                            </p>
                            <p className="font-semibold text-slate-800">
                              {project.seo.traffic.organicTraffic.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${getPercentageColor(
                              project.seo.comparativeTrafficData.twentyEightDays
                                .organicTraffic.differencePercentage
                            )}`}
                          >
                            {(project.seo.comparativeTrafficData.twentyEightDays
                              .organicTraffic.differencePercentage > 0
                              ? "+"
                              : "") +
                              project.seo.comparativeTrafficData.twentyEightDays
                                .organicTraffic.differencePercentage}
                            %
                          </span>
                        </div>
                      </div>

                      {project.seo.trackedKeywords &&
                        project.seo.trackedKeywords.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs text-slate-500 mb-2">
                              En Çok Aranan Kelimeler
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {project.seo.trackedKeywords
                                .slice(0, 3)
                                .map((keyword, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full"
                                  >
                                    {keyword.name}
                                  </span>
                                ))}
                              {project.seo.trackedKeywords.length > 3 && (
                                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                                  +{project.seo.trackedKeywords.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => navigateToProject(project._id)}
                        className="inline-flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-800 transition"
                      >
                        Detayları Gör
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="ml-1"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-500 grid grid-cols-12 gap-4">
                <div className="col-span-4">Proje Adı</div>
                <div className="col-span-2 text-center">Website Trafiği</div>
                <div className="col-span-2 text-center">Organik Trafik</div>
                <div className="col-span-2 text-center">28 Günlük Değişim</div>
                <div className="col-span-2 text-right">İşlemler</div>
              </div>

              {projects.map((project) => (
                <div
                  key={project._id}
                  className="px-6 py-4 border-b border-slate-100 hover:bg-slate-50 transition grid grid-cols-12 gap-4 items-center"
                >
                  <div className="col-span-4">
                    <h3 className="font-medium text-slate-800">
                      {project.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {project.seo.trackedKeywords &&
                        project.seo.trackedKeywords
                          .slice(0, 2)
                          .map((keyword, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                            >
                              {keyword.name}
                            </span>
                          ))}
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <p className="font-semibold text-slate-700">
                      {project.seo.traffic.websiteTraffic.toLocaleString()}
                    </p>
                  </div>

                  <div className="col-span-2 text-center">
                    <p className="font-semibold text-slate-700">
                      {project.seo.traffic.organicTraffic.toLocaleString()}
                    </p>
                  </div>

                  <div className="col-span-2 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPercentageColor(
                        project.seo.comparativeTrafficData.twentyEightDays
                          .organicTraffic.differencePercentage
                      )}`}
                    >
                      {project.seo.comparativeTrafficData.twentyEightDays
                        .organicTraffic.differencePercentage > 0 ? (
                        <svg
                          className="mr-1 h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : project.seo.comparativeTrafficData.twentyEightDays
                          .organicTraffic.differencePercentage < 0 ? (
                        <svg
                          className="mr-1 h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : null}
                      {
                        project.seo.comparativeTrafficData.twentyEightDays
                          .organicTraffic.differencePercentage
                      }
                      %
                    </span>
                  </div>

                  <div className="col-span-2 text-right">
                    <button
                      onClick={() => navigateToProjectAnalysis(project._id)}
                      className="inline-flex items-center justify-center px-3 py-1 border border-indigo-100 text-xs font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
                    >
                      Detaylar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dashboardlayout>
  );
}

export default Dashboard;
