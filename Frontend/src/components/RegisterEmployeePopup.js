import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterEmployeePopup = ({ isOpen, onClose, onAddEmployee }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
    if (!contact || !/^\d{10}$/.test(contact)) newErrors.contact = 'Valid contact number is required';
    if (!password) newErrors.password = 'Password is required';
    if (!designation) newErrors.designation = 'Designation is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      fetch('http://localhost:3001/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, contact, password, designation }),
      })
        .then((response) => response.json())
        .then((data) => {
          onAddEmployee(data);
          toast.success('Employee registered successfully');
          onClose();
        });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-5xl mx-auto z-10">
        <Dialog.Title className="text-2xl font-bold">Register Employee</Dialog.Title>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email ID</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.contact && <p className="text-red-500 text-xs">{errors.contact}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Designation</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.designation && <p className="text-red-500 text-xs">{errors.designation}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
        <ToastContainer />
      </div>
    </Dialog>
  );
};

export default RegisterEmployeePopup;
