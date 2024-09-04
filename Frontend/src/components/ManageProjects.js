import React, { useState, useEffect } from 'react';
import { Activity, Edit, Trash2, List, Grid } from 'lucide-react';
import { useNavigate,useParams } from 'react-router';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddTaskPopup from './AddTaskPopup'; 
import EditTaskPopup from './EditTaskPopup'; 

const ManageProjects = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'board'
  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);
  // const [editTaskId, setEditTaskId] = useState(null); // For editing
  // const [editTaskData, setEditTaskData] = useState(null); // For edit form data
  const navigate = useNavigate();
  localStorage.setItem('projectId',projectId);
  console.log(projectId)

  const statusClasses = {
    'TODO': 'bg-blue-100 text-blue-800',
    'IN_PROGRESS': 'bg-orange-100 text-orange-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'OVERDUE': 'bg-red-100 text-red-800',
  };

  const priorityClasses = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  // useEffect(() => {
  //   if (editTaskId) {
  //     // Fetch the task details for editing
  //     axios.get(`http://localhost:3001/tasks/${editTaskId}`)
  //       .then(response => setEditTaskData(response.data))
  //       .catch(error => console.error('Error fetching task details:', error));
  //   }
  // }, [editTaskId]);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = () => {
    axios.get(`http://localhost:9093/api/v2/task/getTaskByProjectId/${projectId}`)
      .then(response =>{
        console.log(response.data);
        
        setTasks(response.data)
      })
      .catch(error => console.error('Error fetching tasks:', error));
  };


  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return; // No movement
    }

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(source.index, 1);

    // Update the task status based on the new column
    movedTask.status = destination.droppableId;
    updatedTasks.splice(destination.index, 0, movedTask);

    // Update task in backend
    axios.put(`http://localhost:3001/tasks/${movedTask.id}`, movedTask)
      .then(() => setTasks(updatedTasks))
      .catch(error => console.error('Error updating task status:', error));
  };

  const handleAddTask = () => {
    setIsAddTaskPopupOpen(true);
  };

  const handleTaskAdded = () => {
    fetchTasks(); // Refresh tasks after adding
  };

  const [showedit,setShowedit]= useState(false)
  // const handleEditTask = (task) => {
  //   console.log(task)
  //   setShowedit(true)
  //   setEditTaskData(task);

  // };

//   const handleDeleteTask = (taskId) => {
//     axios.delete(`http://localhost:9093/api/v2/task/deleteTask/${taskId}`)
//       .then(() => {
//         setTasks(tasks.filter(task => task.taskId !== taskId));
//       })
//       .catch(error => console.error('Error deleting task:', error));
// };

const handleDeleteTask = (taskId) => {
  console.log("Deleting task with ID:", taskId);

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




  // const handleDeleteTask = (taskId) => {
  //   axios.delete(`http://localhost:3001/tasks/${taskId}`)
  //     .then(() => {
  //       setTasks(tasks.filter(task => task.id !== taskId));
  //     })
  //     .catch(error => console.error('Error deleting task:', error));
  // };


  // const handleUpdateTask = (updatedTask) => {
  //   axios.put(`http://localhost:9093/api/v2/task/updateTasks/${updatedTask.taskId}`, updatedTask)
  //     .then(() => {
  //       fetchTasks(); // Refresh tasks after updating
  //       setEditTaskId(null);
  //       setEditTaskData(null);
  //     })
  //     .catch(error => console.error('Error updating task:', error));
  // };

  // const handleUpdateTask = (updatedTask) => {
  //   axios.put(`http://localhost:3001/tasks/${updatedTask.id}`, updatedTask)
  //     .then(() => {
  //       fetchTasks(); // Refresh tasks after updating
  //       setEditTaskId(null);
  //       setEditTaskData(null);
  //     })
  //     .catch(error => console.error('Error updating task:', error));
  // };

  const columns = {
    'To Do': tasks.filter(task => task.status === 'To Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Completed': tasks.filter(task => task.status === 'Completed'),
    'Overdue': tasks.filter(task => task.status === 'Overdue'),
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
              onClick={handleAddTask} // Open Add Task Popup
            >
              + Add Task
            </button>
            <div className="flex space-x-2">
              <List
                className={`h-8 w-8 cursor-pointer ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-500'}`}
                onClick={() => setViewMode('list')}
              />
              <Grid
                className={`h-8 w-8 cursor-pointer ${viewMode === 'board' ? 'text-blue-600' : 'text-gray-500'}`}
                onClick={() => setViewMode('board')}
              />
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th> */}
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
                <tr key={task.taskId}>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.taskId}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.taskTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.employeeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityClasses[task.priority]}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* <Edit
                      className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                      onClick={() => handleEditTask(task)} // Handle Edit
                    /> */}
                    <Trash2
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      onClick={() => handleDeleteTask(task.taskId)} // Handle Delete
                    />
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
                                  {/* <Edit
                                    className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                    onClick={() => handleEditTask(task.taskId)} // Handle Edit
                                  /> */}
                                  <Trash2
                                    className="text-red-600 hover:text-red-900 cursor-pointer"
                                    onClick={() => handleDeleteTask(task.taskId)} // Handle Delete
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
        {/* {showedit && (
          <EditTaskPopup
            task={editTaskData}
            onClose={() => setShowedit(false)}
            onTaskUpdated={handleUpdateTask}
          />
        )} */}
      </main>
    </div>
  );
};

export default ManageProjects;
