import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const AddTaskPopup = ({ onClose, onTaskAdded }) => {

  const { projectId } = useParams();
  const [task, setTask] = useState({
    taskTitle: '',
    taskDescription: '',
    dueDate: '',
    dueTime: '', // New state for time
    priority: 'LOW',
    employeeId: ''
  });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const managerId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('jwtToken');

    try {
      const response = await fetch(`http://localhost:9093/api/v1/manager/${managerId}/viewEmployees`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching employees');
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: name === 'employeeId' ? Number(value) : value
    }));
  };

  const handleSubmit = async () => {
    if (!task.dueDate || !task.dueTime || !task.taskTitle || !task.taskDescription || !task.employeeId) {
      setError('Please fill in all fields');
      return;
    }
  
    // Combine dueDate and dueTime into a LocalDateTime-compatible format
    const formattedDueDateTime = `${task.dueDate}T${task.dueTime}:00`; // yyyy-MM-ddTHH:mm:ss
  
    // Ensure priority matches expected enum values
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    const formattedPriority = validPriorities.includes(task.priority) ? task.priority : 'LOW';
  
    const requestData = {
      ...task,
      dueDateTime: formattedDueDateTime, // Send as dueDateTime for LocalDateTime field
      priority: formattedPriority
    };
  
 
  
    try {
      const response = await axios.post(`http://localhost:9093/api/v2/task/addTask/${projectId}`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Task created successfully:', response.data);
      onTaskAdded(); // Call the callback to update the UI
      onClose(); // Close the modal or popup
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task');
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Task Name</label>
            <input
              type="text"
              name="taskTitle"
              value={task.taskTitle}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Due Time</label>
            <input
              type="time"
              name="dueTime"
              value={task.dueTime}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Assign To</label>
            <select
              name="employeeId"
              value={task.employeeId}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full max-h-48 overflow-y-auto"
            >
              <option value="">Select an employee</option>
              {employees.map(employee => (
                <option key={employee.empId} value={employee.empId}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Task Description</label>
          <textarea
            name="taskDescription"
            value={task.taskDescription}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskPopup;
