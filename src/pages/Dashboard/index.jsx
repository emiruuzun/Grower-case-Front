import React, { useState, useEffect } from "react";
import Dashboardlayout from "../../layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../../services/project";
import ProjectCard from "../../components/ProjectCard";
import LoadingSpinner from "../../components/LoadingSpinner";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      if (Array.isArray(response)) {
        setProjects(response);
        setError(null);
      } else {
        setError("Projeler yüklenirken bir hata oluştu.");
      }
    } catch (err) {
      setError("Projeler yüklenirken bir hata oluştu.");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (projectId) => {
    navigate(`/project/${projectId}/analysis`);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Dashboardlayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <LoadingSpinner />
        </div>
      </Dashboardlayout>
    );
  }

  if (error) {
    return (
      <Dashboardlayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </Dashboardlayout>
    );
  }

  return (
    <Dashboardlayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-800">Projelerim</h1>
              <p className="mt-1 text-sm text-gray-600">
                Toplam {projects.length} proje bulundu
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Proje ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <button
                onClick={fetchProjects}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Yenile
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={() => handleProjectSelect(project._id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="mt-8 text-center">
            {searchTerm ? (
              <div className="text-gray-500">
                <p className="text-lg font-medium">Proje bulunamadı</p>
                <p className="mt-1 text-sm">Farklı bir arama terimi deneyin</p>
              </div>
            ) : (
              <div className="text-gray-500">
                <p className="text-lg font-medium">Henüz proje bulunmamaktadır</p>
                <p className="mt-1 text-sm">Yeni bir proje ekleyin</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Dashboardlayout>
  );
}

export default Dashboard;
