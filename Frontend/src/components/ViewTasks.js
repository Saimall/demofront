import React, { useState, useEffect } from 'react';
import { Edit, Activity, List, Grid } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';

// Popup Component for Editing Task
const EditTaskPopup = ({ task, onClose, onSave }) => {
  const [status, setStatus] = useState(task.status);

  const handleSubmit = () => {
    onSave(task.taskId, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Main TaskManagement Component
const TaskManagement = () => {
  const { projectId } = useParams();
  const [searchDate, setSearchDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [view, setView] = useState('list');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (projectId) {
      // Fetch tasks based on projectId from the API
      axios.get(`http://localhost:9093/api/v2/task/getTaskByProjectId/${projectId}`)
        .then(response => {
          setTasks(response.data);
          setFilteredTasks(response.data); // Initialize filteredTasks
        })
        .catch(error => console.error('Error fetching tasks:', error));
    }
  }, [projectId]);

  useEffect(() => {
    if (searchDate) {
      const tasksOnDate = tasks.filter(task => task.dueDate === searchDate);
      setFilteredTasks(tasksOnDate);
    } else {
      setFilteredTasks(tasks); // Reset filtered tasks when search date is cleared
    }
  }, [searchDate, tasks]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    updatedTasks.splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks); // Update filteredTasks to reflect changes

    // Optionally send update to the server
    axios.put(`http://localhost:9092/api/v2/task/updateTaskStatus/${movedTask.taskId}/${movedTask.status}`)
      .catch(error => console.error('Error updating task status:', error));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsPopupOpen(true);
  };

  const handleSave = (taskId, status) => {
    // Update local state with the new status
    const updatedTasks = tasks.map(task =>
      task.taskId === taskId ? { ...task, status } : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks); // Update filteredTasks to reflect changes

    // Send updated status to the backend
    axios.put(`http://localhost:9092/api/v2/task/updateTaskStatus/${taskId}/${status}`)
      .then(response => {
        // Optionally handle the response, e.g., show a success message
      })
      .catch(error => console.error('Error updating task status:', error));
  };

  const listView = (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max bg-white shadow-md rounded-lg">
        <thead>
          <tr className="text-left border-b bg-gray-100 text-gray-700">
            <th className="py-3 px-6">Task ID</th>
            <th className="py-3 px-6">Task</th>
            <th className="py-3 px-6">Due Date</th>
            <th className="py-3 px-6">Priority</th>
            <th className="py-3 px-6">Status</th>
            <th className="py-3 px-6">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <tr key={task.taskId} className="border-b hover:bg-gray-50 transition-colors">
                <td className="py-3 px-6">{task.taskId}</td>
                <td className="py-3 px-6">{task.taskTitle}</td>
                <td className="py-3 px-6">{task.dueDate}</td>
                <td className="py-3 px-6">{task.priority}</td>
                <td className="py-3 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    onClick={() => handleEditClick(task)}
                  >
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-3 px-6 text-center text-gray-500">
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isPopupOpen && (
        <EditTaskPopup
          task={selectedTask}
          onClose={() => setIsPopupOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );

  const boardView = (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4">
        {['TODO', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'].map(status => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 p-4 bg-white rounded-lg shadow"
              >
                <h2 className="text-xl font-bold mb-4">{status}</h2>
                {filteredTasks.filter(task => task.status === status).map((task, index) => (
                  <Draggable key={task.taskId} draggableId={task.taskId} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`mb-4 p-4 rounded ${getStatusColor(task.status)}`}
                      >
                        <h3 className="font-semibold">{task.taskTitle}</h3>
                        <p>{task.dueDate}</p>
                        <p>Priority: {task.priority}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => navigate("/EmployeeDashboard")}>
              View Dashboard
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => navigate("/HomePage")}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              onClick={() => setView('list')}
            >
              <List size={20} />
            </button>
            <button
              className={`p-2 rounded ${view === 'board' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              onClick={() => setView('board')}
            >
              <Grid size={20} />
            </button>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Search By Date</label>
            <input
              type="date"
              id="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
        {view === 'list' ? listView : boardView}
      </main>
    </div>
  );
};

export default TaskManagement;
