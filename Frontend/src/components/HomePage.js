import React from 'react';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router';


const ProjectManagementHomepage = () => {

    const navigate = useNavigate();
    


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition-colors" onClick={() => navigate("/register")}>Register</button>
            {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors" onClick={navigate("/login")}>Login</button> */}
            <button
  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
  onClick={() => navigate("/login")}
>
  Login
</button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-8 flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Streamline Your Success With Our Project Management System</h2>
              <p className="text-gray-600 mb-6">
                Elevate your project execution with our cutting-edge Project Management System. Designed for efficiency and
                clarity, it offers real-time collaboration, task tracking, and insightful analytics to keep your team aligned and
                productive. Transform complexity into simplicity and ensure every project milestone is met with precision.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img src="homephoto.jpg" alt="Project management illustration" className="max-w-full h-auto" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="bg-gray-50 p-8 rounded-lg shadow mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
          <ul className="space-y-4 text-gray-600">
            <li><strong>Task Tracking:</strong> Keep tabs on every task with our intuitive tracking system.</li>
            <li><strong>Real-time Collaboration:</strong> Collaborate with your team seamlessly, from anywhere.</li>
            <li><strong>Insightful Analytics:</strong> Get detailed insights to drive better decision-making.</li>
            <li><strong>Custom Workflows:</strong> Tailor workflows to fit your project needs perfectly.</li>
          </ul>
        </section>

        {/* Call to Action Section */}
        <section className="bg-blue-500 text-white p-8 rounded-lg shadow text-center">
          <h3 className="text-xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="mb-6">Join thousands of teams who are achieving more with TaskFlow.</p>
          <button className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
            Sign Up Now
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm">&copy; 2024 TaskFlow. All rights reserved.</p>
            <div className="space-x-4">
              <a href="/privacy-policy" className="text-sm hover:underline">Privacy Policy</a>
              <a href="/terms-of-service" className="text-sm hover:underline">Terms of Service</a>
              <a href="/contact-us" className="text-sm hover:underline">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectManagementHomepage;
