import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router';
import { Activity, Trash2 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import AddProjectPopup from './AddProjectPopup';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ManagerDashboard = () => {
  const [projectData, setProjectData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [managerDetails, setManagerDetails] = useState({});
  const [scrollToProjects, setScrollToProjects] = useState(false);
  const navigate = useNavigate();
  const [barData, setBarData] = useState(null);
  const [barOptions, setBarOptions] = useState(null);
  const [tasks, setTasks] = useState([]);
  const[selectedProjectName,setSelectedProjectName]=useState('');


  const managerId = localStorage.getItem('userId');
  const jwtToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    if (!managerId || !jwtToken) {
      navigate('/HomePage');
      return;
    }

    if (scrollToProjects) {
      const projectSection = document.getElementById('projectSection');
      if (projectSection) {
        projectSection.scrollIntoView({ behavior: 'smooth' });
        setScrollToProjects(false);
      }
    }
  }, [scrollToProjects, managerId, jwtToken, navigate]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`http://localhost:9093/api/v2/project/getProjects/${managerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjectData(data);
        if (data.length > 0) {
          setSelectedProject(data[0]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjectData();
  }, [managerId]);

  useEffect(() => {
    const fetchManagerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9093/api/v1/manager/viewManagerDetails/${managerId}`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        setManagerDetails(response.data);
      } catch (error) {
        console.error('Error fetching manager details:', error);
      }
    };

    fetchManagerDetails();
  }, [managerId, jwtToken]);

/////////////////////////////////////////////////////////
useEffect(() => {
  if (selectedProject) {
    fetchTasks(selectedProject.projectId);
  }
}, [selectedProject]);

  const fetchTasks = (projectId) => {
    axios.get(`http://localhost:9093/api/v2/task/getTaskByProjectId/${projectId}`)
      .then(response =>{
        console.log(response.data);
        
        setTasks(response.data)
      })
      .catch(error => console.error('Error fetching tasks:', error));
  };

///////////////////////////////////////////////////////


useEffect(() => {
  if (tasks.length > 0 && selectedProject) {
    const taskCounts = {
      todo: tasks.filter(task => task.status === 'TODO').length,
      inProgress: tasks.filter(task => task.status === 'IN_PROGRESS').length,
      inReview: tasks.filter(task => task.status === 'IN_REVIEW').length,
      completed: tasks.filter(task => task.status === 'COMPLETED').length,
      overdue: tasks.filter(task => task.status === 'OVERDUE').length,
    };

    setBarData({
      labels: ['To Do', 'In Progress','In Review', 'Completed', 'Overdue'],
      datasets: [{
        label: 'Tasks',
        data: [taskCounts.todo, taskCounts.inProgress, taskCounts.inReview, taskCounts.completed, taskCounts.overdue],
        backgroundColor: ['#1e90ff', '#ffa500', '#ffff00', '#28a745', '#dc3545'],
      }],
    });

    setBarOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            generateLabels: (chart) => {
              const labels = chart.data.labels.map((label, index) => ({
                text: label,
                fillStyle: chart.data.datasets[0].backgroundColor[index],
              }));
              return labels;
            },
          },
        },
        title: {
          display: true,
          text: `Tasks for ${selectedProject.projectName}`,
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              const label = tooltipItem.label || '';
              const value = tooltipItem.raw || 0;
              return `${label}: ${value} tasks`;
            },
          },
        },
      },
    });
  }
}, [tasks, selectedProject]);


  // useEffect(() => {
  //   if (selectedProject) {
  //     if(tasks.length >0){
  //     const taskCounts = {
  //       TODO: tasks.filter(task => task.status === 'TODO').length,
  //       IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS').length,
  //       COMPLETED: tasks.filter(task => task.status === 'COMPLETED').length,
  //       OVERDUE: tasks.filter(task => task.status === 'OVERDUE').length,
  //     };
  
  //     setBarData({
  //       labels: ['To Do', 'In Progress', 'Completed', 'Overdue'],
  //       datasets: [{
  //         label: 'Tasks',
  //         data: [taskCounts.TODO, taskCounts.IN_PROGRESS, taskCounts.COMPLETED, taskCounts.OVERDUE],
  //         backgroundColor: ['#1e90ff', '#ffcc00', '#28a745', '#dc3545'],
  //       }],
  //     });
  
  //     setBarOptions({
  //       responsive: true,
  //       plugins: {
  //         legend: { position: 'top' },
  //         title: { display: true, text: `Tasks for ${selectedProject.projectName}` },
  //       },
  //     });
  //   }
  // }}, [tasks,selectedProject]);
  



  const handleAddProject = async (newProject) => {
    if (!managerId) {
      console.error("Manager ID not found in local storage.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:9093/api/v2/project/addProject/${managerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
      if (!response.ok) {
        throw new Error('Failed to add project');
      }
      const data = await response.json();
      setProjectData(prevData => [...prevData, data]);
      setShowPopup(false); // Close the popup after adding
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:9093/api/v2/project/deleteProjects/${projectId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete the project');
      }
      setProjectData(prevData => {

        const updatedData = prevData.filter(p => p.projectId !== projectId);
        if (selectedProject?.projectId === projectId) {
          setSelectedProject(updatedData.length > 0 ? updatedData[0] : null);
        }
        return updatedData;
      });
    } catch (error) {
      console.error('Error deleting the project:', error);
    }
  };

  const handleViewProject = (projectId) =>{
    navigate(`/ManageProjects/${projectId}`);
  }

  const handleViewEmployees = () =>{
    navigate("/ViewEmployees");
  }

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    navigate('/HomePage');
  };

  const handleProjectSelect = (e) => {
    const name = e.target.value;
    setSelectedProjectName(name);
    const selected = projectData.find(p => p.projectName ===name);
    setSelectedProject(selected);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogout}
          >
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
            value={selectedProjectName}
                onChange={handleProjectSelect}
                className= "mb-4 p-2 border rounded w-full max-x-sm">
                  <option value="" >Select a project</option>
                  {projectData.map(project => (
                    <option key={project.projectId}>
                      {project.projectName}
                    </option>
                  ))}
                </select>

                {barData && (
              <Bar
                data={barData}
                options={barOptions}
              />
            )}

          </div>

          <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-between" style={{ height: '300px' }}>
            <div className="flex flex-col">
              <h3 className="flex flex-col items-center text-lg font-semibold mb-4">Manager Profile</h3>
              <p><strong>Name:</strong> {managerDetails.name}</p>
              <p className="py-2"><strong>Email ID:</strong> {managerDetails.email}</p>
              <p><strong>Contact:</strong> {managerDetails.contact}</p>
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
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-600 transition-colors mx-4 font-bold"
            onClick={() => setShowPopup(true)}
          >
            Add Project
          </button>
          
<button
            className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-green-600 transition-colors font-bold"
            onClick={() => handleViewEmployees()}
          >
            View Employees
          </button>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {/* <th className="px-4 py-2 text-left">Project ID</th> */}
                <th className="px-4 py-2 text-left">Project Name</th>
                <th className="px-4 py-2 text-left">Start Date</th>
                <th className="px-4 py-2 text-left">End Date</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectData.map((project, index) => (
                <tr key={project.projectId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  {/* <td className="px-4 py-2">{project.projectId}</td> */}
                  <td className="px-4 py-2">{project.projectName}</td>
                  <td className="px-4 py-2">{project.startDate}</td>
                  <td className="px-4 py-2">{project.endDate}</td>
                  <td className="px-4 py-2">{project.projectDescription}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
                      onClick={() => handleDeleteProject(project.projectId)}
                    >
                      <Trash2 className="h-4 w-4 inline" /> Delete
                    </button>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2 hover:bg-blue-600 transition-colors"
                      onClick={() => handleViewProject(project.projectId)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AddProjectPopup
          show={showPopup}
          onClose={() => setShowPopup(false)}
          onAddProject={handleAddProject}
        />
      </main>
    </div>
  );
};

export default ManagerDashboard;
