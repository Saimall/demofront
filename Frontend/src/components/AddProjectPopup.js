import React, { useState, useEffect } from 'react';

const AddProjectPopup = ({ onClose, onAddProject }) => {
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch employees list
    fetch('http://localhost:3001/employees')
      .then(response => response.json())
      .then(data => setEmployees(data));
  }, []);

  const handleToggleEmployeeSelection = (employee) => {
    if (selectedEmployees.includes(employee)) {
      setSelectedEmployees(selectedEmployees.filter(e => e !== employee));
    } else {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
  };

  const handleAddProject = () => {
    if (!projectName || !startDate || !endDate || !description || selectedEmployees.length === 0) {
      setErrorMessage('Fill in all the fields');
      setSuccessMessage('');
      return;
    }

    const newProject = {
      name: projectName,
      startDate,
      endDate,
      description,
      assignedTo: selectedEmployees
    };

    onAddProject(newProject);
    setSuccessMessage('Project added successfully');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Add Project</h3>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="border px-4 py-2 mb-4 w-full"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-4 py-2 mb-4 w-full"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-4 py-2 mb-4 w-full"
        />

<div className="relative mb-4">
  <button
    className="border px-4 py-2 w-full text-left"
    onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
  >
    Assign Employees
  </button>
  {showEmployeeDropdown && (
    <div className="absolute z-10 w-full bg-white border mt-2 rounded shadow-lg max-h-48 overflow-y-auto">
      {employees.map((employee) => (
        <div key={employee.id} className="flex items-center px-4 py-2 hover:bg-gray-100">
          <input
            type="checkbox"
            checked={selectedEmployees.includes(employee.name)}
            onChange={() => handleToggleEmployeeSelection(employee.name)}
            className="mr-2"
          />
          <span>{employee.name}</span>
        </div>
      ))}
    </div>
  )}
</div>


        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-4 py-2 mb-4 w-full"
        />

        

        <div className="flex justify-end space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleAddProject}
          >
            Add Project
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProjectPopup;
