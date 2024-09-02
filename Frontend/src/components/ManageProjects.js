// src/components/ProjectManagementPage.js

import React, { useState, useEffect } from 'react';
import { Activity, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import AddTaskPopup from './AddTaskPopup'; // Import the AddTaskPopup component

const ProjectManagementPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false); // State for Add Task Popup
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  const priorityClasses = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = (date = '') => {
    const url = date ? `http://localhost:3001/tasks?dueDate=${date}` : 'http://localhost:3001/tasks';
    axios.get(url)
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchTasks(date);
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:3001/tasks/${taskId}`)
      .then(() => setTasks(tasks.filter(task => task.id !== taskId)))
      .catch(error => console.error('Error deleting task:', error));
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditPopupOpen(true);
  };

  const handleSaveTask = () => {
    axios.put(`http://localhost:3001/tasks/${selectedTask.id}`, selectedTask)
      .then(() => {
        setTasks(tasks.map(task => task.id === selectedTask.id ? selectedTask : task));
        setIsEditPopupOpen(false);
        setSelectedTask(null);
      })
      .catch(error => console.error('Error saving task:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTask({ ...selectedTask, [name]: value });
  };

  const handleAddTask = () => {
    setIsAddTaskPopupOpen(true);
  };

  const handleTaskAdded = () => {
    fetchTasks(selectedDate); // Refresh tasks after adding
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <div className="flex space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => navigate('/ManagerDashboard')}
            >
              Go to Dashboard
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => navigate('/HomePage')}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">XYZ Project - Task List</h2>
          <div className="flex space-x-2">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="bg-white border border-gray-300 rounded px-4 py-2"
            />
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded"
              onClick={handleAddTask} // Open Add Task Popup
            >
              + Add Task
            </button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center text-gray-500">No tasks found</div>
        ) : (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
                           <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.taskname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.assignedTo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityClasses[task.priority]}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center space-x-2">
                    <Edit className="text-indigo-600 hover:text-indigo-900 cursor-pointer" onClick={() => handleEditTask(task)} />
                    <Trash2 className="text-red-600 hover:text-red-900 cursor-pointer" onClick={() => handleDeleteTask(task.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {isEditPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Task Name</label>
                <input
                  type="text"
                  name="taskname"
                  value={selectedTask.taskname}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={selectedTask.dueDate}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  name="priority"
                  value={selectedTask.priority}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={selectedTask.status}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                >
                  <option value="New">New</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Task Description</label>
              <textarea
                name="description"
                value={selectedTask.description}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSaveTask}
              >
                Save
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={() => setIsEditPopupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddTaskPopupOpen && (
        <AddTaskPopup
          onClose={() => setIsAddTaskPopupOpen(false)}
          onTaskAdded={handleTaskAdded}
        />
      )}
    </div>
  );
};

export default ProjectManagementPage;

