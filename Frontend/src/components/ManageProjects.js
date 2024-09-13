import React, { useState, useEffect } from 'react';
import { Activity, Edit, Trash2, List, Grid } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddTaskPopup from './AddTaskPopup'; 
import format from 'date-fns/format';
import EditTaskPopup from './EditTaskPopup'; 

const ManageProjects = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState(null);
  const [reviewTaskId, setReviewTaskId] = useState(null); // State to track task to be reviewed
  const navigate = useNavigate();
  const [employeeNames, setEmployeeNames] = useState({});
  const [filteredTasks, setFilteredTasks] = useState([]);
  const token = localStorage.getItem('jwtToken');

  const statusClasses = {
    'TODO': 'bg-blue-100 text-blue-800',
    'IN_PROGRESS': 'bg-orange-100 text-orange-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'IN_REVIEW': 'bg-yellow-100 text-yellow-800',
    'OVERDUE': 'bg-red-100 text-red-800',
  };

  const priorityClasses = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  const fetchEmployeeNames = async (employeeIds) => {
    try {
      const uniqueEmployeeIds = [...new Set(employeeIds)];
      const employeeRequests = uniqueEmployeeIds.map(id =>
        axios.get(`http://localhost:9093/api/v1/employee/getEmployeeName/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      const responses = await Promise.all(employeeRequests);
      const employeeNames = responses.reduce((acc, response, index) => {
        acc[uniqueEmployeeIds[index]] = response.data;
        return acc;
      }, {});

      setEmployeeNames(employeeNames);
    } catch (error) {
      console.error('Error fetching employee names:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:9093/api/v2/task/getTaskByProjectId/${projectId}`);
      const fetchedTasks = response.data;
      setTasks(fetchedTasks);

      const employeeIds = fetchedTasks.map(task => task.employeeId);
      fetchEmployeeNames(employeeIds);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    updatedTasks.splice(destination.index, 0, movedTask);

    axios.put(`http://localhost:3001/tasks/${movedTask.id}`, movedTask)
      .then(() => setTasks(updatedTasks))
      .catch(error => console.error('Error updating task status:', error));
  };

  const handleAddTask = () => {
    setIsAddTaskPopupOpen(true);
  };

  const handleTaskAdded = () => {
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setEditTaskData(task);
    setEditTaskId(task.taskId);
  };

  const handleDeleteTask = (taskId) => {
    fetch(`http://localhost:9093/api/v2/task/deleteTask/${taskId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setTasks(tasks.filter(task => task.taskId !== taskId));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  const handleUpdateTask = (updatedTask) => {
    axios.put(`http://localhost:9093/api/v2/task/updateTasks/${updatedTask.taskId}`, updatedTask)
      .then(() => {
        fetchTasks();
        setEditTaskId(null);
        setEditTaskData(null);
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const columns = {
    'To Do': tasks.filter(task => task.status === 'TODO'),
    'In Progress': tasks.filter(task => task.status === 'IN_PROGRESS'),
    'Completed': tasks.filter(task => task.status === 'COMPLETED'),
    'Overdue': tasks.filter(task => task.status === 'OVERDUE'),
    'In Review': tasks.filter(task => task.status === 'IN_REVIEW'),
  };

  const handleTaskReview = (taskId) => {
    setReviewTaskId(taskId);
  };

  const handleApproveTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.taskId === taskId ? { ...task, status: 'COMPLETED' } : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);

    axios.put(`http://localhost:9093/api/v2/task/updateTaskStatus/${taskId}/COMPLETED`)
      .catch(error => console.error('Error updating task status:', error));
  };

  const handleRequestRework = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.taskId === taskId ? { ...task, status: 'TODO' } : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);

    axios.put(`http://localhost:9093/api/v2/task/updateTaskStatus/${taskId}/TODO`)
      .catch(error => console.error('Error updating task status:', error));
  };
  
  // const handleApproveTask = (taskId) => {
  //   updateTaskStatus(taskId, 'COMPLETED');
  //   setReviewTaskId(null);
  // };

  // const handleRequestRework = (taskId) => {
  //   updateTaskStatus(taskId, 'IN_PROGRESS');
  //   setReviewTaskId(null);
  // };

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => 
      task.taskId === taskId ? { ...task, status: newStatus } : task
    );
  
    axios.put(`http://localhost:9093/api/v2/task/updateTasks/${taskId}`, { status: newStatus })
      .then(() => setTasks(updatedTasks))
      .catch(error => console.error('Error updating task status:', error));
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
          <h2 className="text-xl font-semibold">Task List</h2>
          <div className="flex space-x-2">
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded"
              onClick={handleAddTask}
            >
              + Add Task
            </button>
            <div className="flex space-x-2">
              <List
                className={`h-8 w-8 cursor-pointer ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-500'}`}
                onClick={() => setViewMode('list')}
              />
              <Grid
                className={`h-8 w-8 cursor-pointer ${viewMode === 'kanban' ? 'text-blue-600' : 'text-gray-500'}`}
                onClick={() => setViewMode('kanban')}
              />
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map(task => (
            <tr key={task.taskId}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.taskTitle}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {employeeNames[task.employeeId]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(task.dueDateTime), 'dd/MM/yyyy HH:mm')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityClasses[task.priority]}`}>
                  {task.priority}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.status}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {task.status === 'IN_REVIEW' && (
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => handleTaskReview(task.taskId)}
                  >
                    Review
                  </button>
                )}
                <button
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  onClick={() => handleEditTask(task)}
                >
                  <Edit size={20} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteTask(task.taskId)}
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex space-x-4">
              {Object.keys(columns).map(status => (
                <Droppable key={status} droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 rounded-lg w-80 ${statusClasses[status]}`}
                    >
                      <h3 className="text-lg font-semibold mb-2">{status}</h3>
                      {columns[status].map((task, index) => (
                        <Draggable key={task.taskId} draggableId={task.taskId.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 mb-2 rounded-lg shadow-sm ${priorityClasses[task.priority]}`}
                            >
                              <h4 className="font-medium">{task.taskTitle}</h4>
                              <p className="text-sm text-gray-600">{task.dueDate}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityClasses[task.priority]}`}>
                                  {task.priority}
                                </span>
                                <div className="flex space-x-2">
                                  <Edit
                                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                    onClick={() => handleEditTask(task)}
                                  />
                                  <Trash2
                                    className="text-red-600 hover:text-red-900 cursor-pointer"
                                    onClick={() => handleDeleteTask(task.taskId)}
                                  />
                                </div>
                              </div>
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
        )}

        {isAddTaskPopupOpen && (
          <AddTaskPopup
            onClose={() => setIsAddTaskPopupOpen(false)}
            onTaskAdded={handleTaskAdded}
          />
        )}

        {editTaskId && (
          <EditTaskPopup
            task={editTaskData}
            onClose={() => {
              setEditTaskId(null);
              setEditTaskData(null);
            }}
            onTaskUpdated={handleUpdateTask}
          />
        )}

        {reviewTaskId && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Review Task</h3>
              <p className="mb-4">{tasks.find(task => task.taskId === reviewTaskId)?.taskDescription}</p>
              <div className="flex space-x-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={() => handleApproveTask(reviewTaskId)}
                >
                  Approve Task
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
                  onClick={() => handleRequestRework(reviewTaskId)}
                >
                  Request Rework
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => setReviewTaskId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageProjects;
