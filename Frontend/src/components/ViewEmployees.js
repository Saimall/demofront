import React, { useState, useEffect } from 'react';
import { Trash2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router';
import RegisterEmployeePopup from './RegisterEmployeePopup';

const ViewEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const employeesPerPage = 10;

  const managerId = localStorage.getItem('userId'); // Retrieve managerId from local storage
  const jwtToken = localStorage.getItem('jwtToken'); // Retrieve JWT token from local storage


  useEffect(() => {
    const fetchEmployees = async () => {
      
      if (!managerId || !jwtToken) {
        console.error('Manager ID or JWT token is missing.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:9093/api/v1/manager/${managerId}/viewEmployees`, {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
        } else {
          console.error('No employees');
          setEmployees([]);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  // useEffect(() => {
  //   fetch('http://localhost:3001/employees')
  //     .then((response) => response.json())
  //     .then((data) => setEmployees(data));
  // }, []);

  const totalEmployees = employees.length;
  const totalPages = Math.ceil(totalEmployees / employeesPerPage);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
  };



  const handleDeleteEmployee = (empId) => {
    const jwtToken = localStorage.getItem('jwtToken'); // Retrieve JWT token from local storage
  
    fetch(`http://localhost:9093/api/v1/manager/deleteEmployee/${empId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`, // Include the JWT token in the Authorization header
        'Content-Type': 'application/json' // Specify content type as JSON
      },
    })
    .then(response => {
      if (response.ok) {
        // If the response is OK, filter out the deleted employee from the state
        setEmployees(employees.filter(employee => employee.empId !== empId));
      } else {
        // Handle response errors (e.g., show a notification)
        console.error('Failed to delete employee');
      }
    })
    .catch(error => {
      // Handle any errors that occur during fetch
      console.error('Error:', error);
    });
  };
  


  // const handleDeleteEmployee = (empId) => {
  //   fetch(`http://localhost:3001/employees/${empId}`, {
  //     method: 'DELETE',
  //   })
  //   .then(() => {
  //     setEmployees(employees.filter(employee => employee.empId !== empId));
  //   });
  // };

  return (
    <div className="bg-gray-100 min-h-screen">
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">EMPLOYEE LIST</h2>
                <div>
                  <button
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                    onClick={() => setIsPopupOpen(true)}
                  >
                    + Add Employee
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentEmployees.map((employee) => (
                      <tr key={employee.empId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{employee.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.contact}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.designation}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteEmployee(employee.empId)}
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalEmployees > employeesPerPage && (
                <div className="flex justify-center mt-4">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {currentPage > 1 && (
                      <button
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </button>
                    )}
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                          currentPage === index + 1
                            ? 'bg-purple-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                    {currentPage < totalPages && (
                      <button
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next
                      </button>
                    )}
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Register Employee Popup */}
      <RegisterEmployeePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onAddEmployee={handleAddEmployee}
      />
    </div>
  );
};

export default ViewEmployees;
