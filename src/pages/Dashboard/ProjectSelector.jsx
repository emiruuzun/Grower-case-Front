import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../../services/project";

const ProjectSelector = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects();
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const handleProjectSelect = (projectId) => {
    navigate(`/dashboard/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Lütfen bir proje seçin
      </h2>

      {loading ? (
        <p className="text-gray-600">Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => handleProjectSelect(project._id)}
              className="cursor-pointer p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-700">
                {project.name}
              </h3>
              <p className="text-sm text-gray-500 break-all">{project._id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
