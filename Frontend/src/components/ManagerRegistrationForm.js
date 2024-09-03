import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManagerRegistrationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.contact) newErrors.contact = 'Contact No is required';
        else if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = 'Contact No must be 10 digits';
        if (!formData.email) newErrors.email = 'Email ID is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email ID is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            try {
                const response = await axios.post('http://localhost:9093/api/v1/manager/register', formData);
                if (response.status === 201) {
                    toast.success('Registration successful');
                    navigate('/Login');
                } else if (response.status === 409) {
                    toast.error('User already exists.');
                }
            } catch (error) {
                toast.error('Some error occurred.');
            }
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors({
            ...errors,
            [e.target.name]: '',
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <ToastContainer />
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <Activity className="h-8 w-8 text-blue-500 mr-2" />
                        <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
                    </div>
                    <div>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition-colors" onClick={() => navigate("/Login")}>Login</button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors" onClick={() => navigate("/HomePage")}>Go Back</button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                    <h2 className="text-2xl font-semibold text-center mb-6">REGISTER AS MANAGER</h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                                <input
                                    type="tel"
                                    id="contact"
                                    name="contact"
                                    className={`w-full px-3 py-2 border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    value={formData.contact}
                                    onChange={handleChange}
                                />
                                {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                Submit
                            </button>
                        </div>
                    </form>
                    <p className="mt-4 text-center text-sm text-blue-600 hover:underline">
                        <a href="/Login">Already Have an Account? Login</a>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ManagerRegistrationForm;
