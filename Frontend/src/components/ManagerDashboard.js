import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router';
import { Activity, Trash2 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import AddProjectPopup from './AddProjectPopup';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ManagerDashboard = () => {
  const [projectData, setProjectData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [scrollToProjects, setScrollToProjects] = useState(false);

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
      .then(data => {
        setProjectData(data);
        // Set the first project as the default selected project
        if (data.length > 0) {
          setSelectedProject(data[0]);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedProject) {
      // Directly use the selected project's tasks
      const tasks = selectedProject.tasks || [];
      console.log('Selected project tasks:', tasks); // Log the tasks for debugging

      // Calculate task counts
      const taskCounts = {
        todo: tasks.filter(task => task.status === 'To Do').length,
        inProgress: tasks.filter(task => task.status === 'In Progress').length,
        completed: tasks.filter(task => task.status === 'Completed').length,
        overdue: tasks.filter(task => task.status === 'Overdue').length,
      };

      // Update the chart data
      const barData = {
        labels: ['To Do', 'In Progress', 'Completed', 'Overdue'],
        datasets: [
          {
            label: 'Tasks',
            data: [taskCounts.todo, taskCounts.inProgress, taskCounts.completed, taskCounts.overdue],
            backgroundColor: ['#1e90ff', '#ffcc00', '#28a745', '#dc3545'],
          },
        ],
      };

      const barOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `Tasks for ${selectedProject.name}`,
          },
        },
      };

      // Update chart state (if applicable)
      // e.g., setBarData(barData);
      // e.g., setBarOptions(barOptions);
    }
  }, [selectedProject]);

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
        setProjectData(prevData => [...prevData, data]);
      });
  };

  const handleDeleteProject = (projectId) => {
    fetch(`http://localhost:3001/projects/${projectId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProjectData(prevData => {
          const updatedData = prevData.filter(p => p.id !== projectId);
          // Reset selected project to the first in the list if deleted
          if (selectedProject?.id === projectId) {
            setSelectedProject(updatedData.length > 0 ? updatedData[0] : null);
          }
          return updatedData;
        });
      });
  };

  const handleProjectSelect = (e) => {
    const projectId = e.target.value;
    const selected = projectData.find(p => p.id === projectId);
    setSelectedProject(selected);
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
            <select
              onChange={handleProjectSelect}
              className="mb-4 p-2 border rounded w-full max-w-sm"
            >
              <option value="">Select a Project</option>
              {projectData.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {selectedProject && (
              <Bar
                data={{
                  labels: ['To Do', 'In Progress', 'Completed', 'Overdue'],
                  datasets: [
                    {
                      label: 'Tasks',
                      data: [
                        selectedProject.tasks.filter(task => task.status === 'To Do').length,
                        selectedProject.tasks.filter(task => task.status === 'In Progress').length,
                        selectedProject.tasks.filter(task => task.status === 'Completed').length,
                        selectedProject.tasks.filter(task => task.status === 'Overdue').length,
                      ],
                      backgroundColor: ['#1e90ff', '#ffcc00', '#28a745', '#dc3545'],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: `Tasks for ${selectedProject.name}`,
                    },
                  },
                }}
              />
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-between" style={{ height: '300px' }}>
            <div className="flex flex-col">
              <h3 className="flex flex-col items-center text-lg font-semibold mb-4">Manager Profile</h3>
              <p><strong>Name:</strong> Abc</p>
              <p className="py-2"><strong>Email ID:</strong> abc@gmail.com</p>
              <p><strong>Contact:</strong> 8292726378</p>
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 transition-colors"
              onClick={() => setScrollToProjects(true)}
            >
              My Projects
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
                    <a href= "/ManageProjects" className="text-blue-500 hover:underline mr-4">
                      Manage Project
                      </a>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={() => setShowPopup(true)}
          >
           + Add Project
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={()=>navigate("/ViewEmployees")}>
            View Employee
          </button>
        </div>

        {showPopup && (
          <AddProjectPopup
            onClose={() => setShowPopup(false)}
            onAddProject={handleAddProject}
            employees={[]} // Pass the employee list if needed
          />
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;
