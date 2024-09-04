import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });

    const validateForm = () => {
        let valid = true;
        const newErrors = { email: '', password: '' };

        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email address is invalid';
            valid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:9093/api/v1/login', { email, password });
            const { status, data } = response;
            if (status === 200) {
                toast.success('Login successful');
                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('userId', data.id);

                // Redirect based on role
                if (data.role === 'MANAGER') {
                    navigate('/ManagerDashboard');
                } else if (data.role === 'EMPLOYEE') {
                    navigate('/EmployeeDashboard');
                } else {
                    // Handle unknown role
                    toast.error('Unknown role');
                }
            } else if (status === 403) {
                toast.error('Invalid credentials');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error('Invalid credentials');
            } else if (error.response && error.response.status === 403 && error.response.data === null) {
                toast.error('Invalid credentials');
            } else {
                toast.error('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex flex-col">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <Activity className="h-8 w-8 text-blue-500 mr-2" />
                        <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
                    </div>
                    <div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition-colors"
                            onClick={() => navigate('/ManagerRegistration')}
                        >
                            Register
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                            onClick={() => navigate('/HomePage')}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-center mb-6">LOGIN</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
