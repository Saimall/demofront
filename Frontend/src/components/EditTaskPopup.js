import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditTaskPopup = ({ task, onClose, onTaskUpdated }) => {
  const [taskData, setTaskData] = useState(task || {
    taskname: '',
    dueDate: '',
    priority: ''
  });

  console.log(taskData)
  useEffect(() => {
    if (task) {
      setTaskData(task);
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!taskData.taskname || !taskData.dueDate || !taskData.priority) {
    //   alert('Please fill in all fields');
    //   return;
    // }
    console.log(taskData)

    axios.put(`http://localhost:9093/api/v2/task/updateTasks/${taskData.taskId}`, taskData)
  .then(() => {
    onTaskUpdated(taskData); // Notify parent component of the update
    onClose(); // Close the popup
  })
  .catch(error => console.error('Error updating task:', error));
  };

  if (!taskData) {
    return null; // or you can display a loading spinner or a message here
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Task Name</label>
            <input
              type="text"
              name="taskname"
              value={taskData.taskname}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskPopup;
