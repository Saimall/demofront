import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router';
import { Activity, Trash2 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import AddProjectPopup from './AddProjectPopup';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const performanceData = [
  { name: 'Oct 2022', Project: 4, Target: 3 },
  { name: 'Nov 2022', Project: 3, Target: 4 },
  { name: 'Dec 2022', Project: 5, Target: 4 },
  { name: 'Jan 2023', Project: 4, Target: 5 },
  { name: 'Feb 2023', Project: 6, Target: 5 },
  { name: 'Mar 2023', Project: 5, Target: 4 },
];

const ManagerDashboard = () => {
  const [projectData, setProjectData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [scrollToProjects, setScrollToProjects] = useState(false);

  const data = {
    labels: performanceData.map((item) => item.name),
    datasets: [
      {
        label: 'Project',
        data: performanceData.map((item) => item.Project),
        borderColor: '#8884d8',
        backgroundColor: 'rgba(136, 132, 216, 0.5)',
      },
      {
        label: 'Target',
        data: performanceData.map((item) => item.Target),
        borderColor: '#82ca9d',
        backgroundColor: 'rgba(130, 202, 157, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance Over Time',
      },
    },
  };

  useEffect(() => {
    if (scrollToProjects) {
      const projectSection = document.getElementById('projectSection');
      if (projectSection) {
        projectSection.scrollIntoView({ behavior: 'smooth' });
        setScrollToProjects(false);
      }
    }
  }, [scrollToProjects]);

  useEffect(() => {
    // Fetch initial project data from the server
    fetch('http://localhost:3001/projects')
      .then(response => response.json())
      .then(data => setProjectData(data));
  }, []);

  const handleAddProject = (newProject) => {
    // Post the new project to the server
    fetch('http://localhost:3001/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject),
    })
      .then(response => response.json())
      .then(data => {
        setProjectData((prevData) => [...prevData, data]);
      });
  };

  const handleDeleteProject = (projectId) => {
    fetch(`http://localhost:3001/projects/${projectId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProjectData((prevData) => prevData.filter((p) => p.id !== projectId));
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => navigate("/HomePage")}>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-center mb-6">MANAGER DASHBOARD</h2>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Performance</h3>
            <Line data={data} options={options} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-between" style={{ height: '200px' }}>
            <div>
              <h3 className="text-lg font-semibold mb-4">User Profile</h3>
              <p><strong>Name:</strong> Abc</p>
              <p><strong>Email ID:</strong> abc@gmail.com</p>
              <p><strong>Contact:</strong> 8292726378</p>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 transition-colors"
              onClick={() => setScrollToProjects(true)}
            >
              Projects
            </button>
          </div>
        </div>

        <div id="projectSection" className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Projects</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Project ID</th>
                <th className="px-4 py-2 text-left">Project Name</th>
                <th className="px-4 py-2 text-left">Start Date</th>
                <th className="px-4 py-2 text-left">End Date</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectData.map((project, index) => (
                <tr key={project.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                  <td className="px-4 py-2">{project.id}</td>
                  <td className="px-4 py-2">{project.name}</td>
                  <td className="px-4 py-2">{project.startDate}</td>
                  <td className="px-4 py-2">{project.endDate}</td>
                  <td className="px-4 py-2">{project.description}</td>
                  <td className="px-4 py-2 flex items-center">
                    <a href="/ManageProject" className="text-blue-500 hover:underline mr-4">
                      Manage Project
                    </a>
                    <Trash2
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => handleDeleteProject(project.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition-colors"
            onClick={() => setShowPopup(true)}
          >
            + Add Project
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition-colors" onClick={()=>navigate("/ViewEmployees")}>View Employees</button>
        </div>

        {showPopup && (
          <AddProjectPopup
            onClose={() => setShowPopup(false)}
            onAddProject={handleAddProject}
          />
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;
