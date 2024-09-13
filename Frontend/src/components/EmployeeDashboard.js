import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router';
import axios from 'axios';

const empId = localStorage.getItem('userId');
const jwtToken = localStorage.getItem('jwtToken');

const EmployeeDashboard = () => {
  const [taskData, setTaskData] = useState({
    labels: ['Completed', 'To do', 'In Progress', 'In Review','Over Due'],
    datasets: [{ data: [0, 0, 0, 0, 0], backgroundColor: ['#10B981', '#6366F1', '#F59E0B','#FFD700', '#EF4444'] }],
  });

  const [priorityData, setPriorityData] = useState({
    labels: ['Low', 'Medium', 'High'],
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#10B981', '#F59E0B', '#EF4444'] }],
  });
  const [employeeDetails, setEmployeeDetails] = useState({});

  const navigate = useNavigate();


//fetching employee detaiils
  useEffect(() => {
    const fetchEmployeeDetails = async () => { 
      try {
        const response = await axios.get(`http://localhost:9093/api/v1/employee/viewEmployeeDetails/${empId}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setEmployeeDetails(response.data);
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmployeeDetails();
  }, []);





  useEffect(() => {
    // Ensure empId is valid before making the request
    if (empId) {
      axios.get(`http://localhost:9093/api/v2/task/getTasksByEmployeeId/${empId}`)
        .then((response) => {
          const tasks = response.data;
  
          // Process task data
          const completed = tasks.filter(task => task.status === 'COMPLETED').length;
          const pending = tasks.filter(task => task.status === 'TODO').length;
          const inProgress = tasks.filter(task => task.status === 'IN_PROGRESS').length;
          const inReview = tasks.filter(task => task.status === 'IN_REVIEW').length;
          const overdue = tasks.filter(task => task.status === 'OVERDUE').length;
  
          setTaskData({
            labels: ['Completed', 'To do', 'In Progress','In Review', 'Over Due'],
            datasets: [{
              data: [completed, pending, inProgress,inReview, overdue],
              backgroundColor: ['#10B981', '#6366F1', '#F59E0B','#FFD700', '#EF4444'],
            }],
          });
  
          // Process priority data
          const lowPriority = tasks.filter(task => task.priority === 'LOW').length;
          const mediumPriority = tasks.filter(task => task.priority === 'MEDIUM').length;
          const highPriority = tasks.filter(task => task.priority === 'HIGH').length;
  
          setPriorityData({
            labels: ['Low', 'Medium', 'High'],
            datasets: [{
              data: [lowPriority, mediumPriority, highPriority],
              backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
            }],
          });
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
          // Handle error as needed
        });
    }
  }, [empId]);
  



  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => navigate("/EmployeeViewTasks")}>
              View Tasks
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => navigate("/HomePage")}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">EMPLOYEE DASHBOARD</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="bg-white overflow-hidden shadow rounded-lg col-span-2 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tasks</h3>
            <div className="flex justify-center w-[300px] h-[300px] items-center mx-auto">
              <Pie data={taskData} />
            </div>
            <div className="mt-2 flex justify-center">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">This Week</span>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-4">
            <h3 className="flex flex-col justify-center items-center text-xl font-medium text-gray-900 mb-6">User Profile</h3>
            <dl className="grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2 text-m">
              <div className="sm:col-span-1">
                <dt className="font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-gray-900">{employeeDetails.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="font-medium text-gray-500">Designation</dt>
                <dd className="mt-1 text-gray-900">{employeeDetails.designation}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-gray-900">{employeeDetails.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="font-medium text-gray-500">Contact</dt>
                <dd className="mt-1 text-gray-900">{employeeDetails.contact}</dd>
              </div>
              {/* <div className="sm:col-span-2">
                <dt className="font-medium text-gray-500">Manager</dt>
                <dd className="mt-1 text-gray-900">{employeeDetails.managerId}</dd>
              </div> */}
            </dl>
          </div>
        </div>

        <div className="mt-4 bg-white overflow-hidden shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tasks Based On Priority</h3>
          <Bar 
  data={priorityData} 
  width={200}
  height={50}
  options={{
    indexAxis: 'y',
    scales: {
      x: { display: false },
    },
    elements: {
      bar: {
        borderRadius: 10,
      },
    },
    plugins: {
      legend: {
        display: true, // Enable the legend
        position: 'top', // Position of the legend
        labels: {
          color: '#000', // Color of the legend labels
          generateLabels: (chart) => {
            // Generate custom legend labels
            const { data } = chart;
            return data.datasets[0].data.map((value, index) => ({
              text: data.labels[index], // Label text
              fillStyle: data.datasets[0].backgroundColor[index], // Color of the legend
            }));
          },
        },
      },
    },
  }} 
/>

        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
