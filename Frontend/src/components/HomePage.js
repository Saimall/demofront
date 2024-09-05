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
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition-colors" onClick={() => navigate("/ManagerRegistration")}>Register</button>
            {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors" onClick={navigate("/login")}>Login</button> */}
            <button
  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors" onClick={() => navigate("/login")}>Login</button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-8 flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Streamline Your Success with TaskFlow</h2>
              <p className="text-gray-600 mb-6 ">
              Elevate your project management with TaskFlow, the innovative system designed for ultimate efficiency and clarity. 
              TaskFlow offers real-time collaboration, intuitive task tracking, and powerful analytics, ensuring your team remains aligned and productive. 
              Transform the complexity of project management into simplicity, and achieve every milestone with precision. 
              Embrace TaskFlow to make every project smoother and more effective.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img src="homephoto.jpg" alt="Project management illustration" className="max-w-full h-auto" />
            </div>
          </div>
        </div>
      <section className="bg-white p-8 rounded-lg shadow mb-8 flex items-center">

  <div className="flex-shrink-0 w-1/2 pr-4">
    <img src="homepage2.jpg" alt="TaskFlow" className="w-full h-auto rounded-lg" />
  </div>

  <div className="w-1/2">
    <h3 className="text-xl font-bold text-gray-900 mb-4">Discover What TaskFlow Can Do for You</h3>
    <p className="text-gray-600 mb-6">
      With TaskFlow, elevate your project management experience to new heights. Effortlessly track every task with our intuitive system, ensuring nothing ever falls through the cracks. Collaborate seamlessly with your team in real-time, transcending geographical barriers to boost productivity from anywhere. Dive deep into powerful analytics that provide the insights needed for informed decision-making and project success. And with our flexible, customizable workflows, tailor the platform to perfectly suit your unique project needs, ensuring an efficient and personalized management experience. TaskFlow is designed to transform how you manage projects, making every task smoother and every collaboration more effective.
    </p>

    <h3 className="text-xl font-bold mb-4">Ready to Get Started?</h3>
    <p className="mb-6">Join thousands of teams who are achieving more with TaskFlow.</p>
    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors" onClick={() => navigate("/ManagerRegistration")}>
      Sign Up Now
    </button>
  </div>
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
