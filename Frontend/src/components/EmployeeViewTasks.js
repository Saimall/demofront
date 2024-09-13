import React, { useState, useEffect } from 'react';
import { Edit, Activity, List, Grid } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import format from 'date-fns/format';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Main TaskManagement Component
const TaskManagement = () => {
  const { projectId } = useParams();
  const [searchDate, setSearchDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [view, setView] = useState('list');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(null); // State to manage details visibility
  const empId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (empId) {
      axios.get(`http://localhost:9093/api/v2/task/getTasksByEmployeeId/${empId}`)
        .then(response => {
          setTasks(response.data);
          setFilteredTasks(response.data); // Initialize filteredTasks
        })
        .catch(error => console.error('Error fetching tasks:', error));
    }
  }, [empId]);



  useEffect(() => {
    if (searchDate) {
      const formattedSearchDate = new Date(searchDate).toISOString().split('T')[0];
      const tasksOnDate = tasks.filter(task => {
        const taskDate = new Date(task.dueDateTime).toISOString().split('T')[0];
        return taskDate === formattedSearchDate;
      });
      setFilteredTasks(tasksOnDate);
    } else {
      setFilteredTasks(tasks); // Reset filtered tasks when search date is cleared
    }
  }, [searchDate, tasks]);
  // useEffect(() => {
  //   if (searchDate) {
  //     const tasksOnDate = tasks.filter(task => task.dueDate === searchDate);
  //     setFilteredTasks(tasksOnDate);
  //   } else {
  //     setFilteredTasks(tasks); // Reset filtered tasks when search date is cleared
  //   }
  // }, [searchDate, tasks]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    updatedTasks.splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks); // Update filteredTasks to reflect changes

    axios.put(`http://localhost:3001/tasks/${movedTask.taskId}`, movedTask)
      .catch(error => console.error('Error updating task status:', error));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_REVIEW': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAcceptTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.taskId === taskId ? { ...task, status: 'IN_PROGRESS' } : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);

    axios.put(`http://localhost:9093/api/v2/task/updateTaskStatus/${taskId}/IN_PROGRESS`)
      .catch(error => console.error('Error updating task status:', error));
  };

  const handleMarkForReview = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.taskId === taskId ? { ...task, status: 'IN_REVIEW' } : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);

    axios.put(`http://localhost:9093/api/v2/task/updateTaskStatus/${taskId}/IN_REVIEW`)
      .catch(error => console.error('Error updating task status:', error));

    toast.success('Task marked for review!');
  };

  const handleRowClick = (task) => {
    if (detailsVisible === task.taskId) {
      setDetailsVisible(null); // Hide details if the same row is clicked again
    } else {
      setDetailsVisible(task.taskId); // Show details for the clicked row
    }
  };

  const listView = (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max bg-white shadow-md rounded-lg">
        <thead>
          <tr className="text-left border-b bg-gray-100 text-gray-700">
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
              <React.Fragment key={task.taskId}>
                <tr 
                  className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(task)}
                >
                  <td className="py-3 px-6">{task.taskTitle}</td>
                  <td className="py-3 px-6">{format(new Date(task.dueDateTime), 'dd/MM/yyyy HH:mm')}</td>
                  <td className="py-3 px-6">{task.priority}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    {task.status === 'TODO' ? (
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptTask(task.taskId);
                        }}
                      >
                        Accept Task
                      </button>
                    ) : task.status === 'IN_PROGRESS' ? (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkForReview(task.taskId);
                        }}
                      >
                        Mark for Review
                      </button>
                    ) : null}
                  </td>
                </tr>
                {detailsVisible === task.taskId && (
                  <tr>
                    <td colSpan="5" className="bg-gray-50 p-4">
                      <h3 className="text-m font-bold">Description:</h3>
                      <p className="mt-2">{task.taskDescription || `No description`}</p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-3 px-6 text-center text-gray-500">
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const boardView = (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4">
        {['TODO', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'IN_REVIEW'].map(status => (
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
                        <p>{format(new Date(task.dueDateTime), 'dd/MM/yyyy HH:mm')}</p>
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

      <ToastContainer />
    </div>
  );
};

export default TaskManagement;
