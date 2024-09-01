import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage.js';
import Login from './components/Login.js';
import ManagerDashboard from './components/ManagerDashboard';
import ManagerRegistrationForm from './components/ManagerRegistrationForm.js';
import AddProjectPopup from './components/AddProjectPopup.js';
import ViewEmployees from './components/ViewEmployees';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/HomePage" element={<HomePage/>}></Route>
          <Route path="/Login" element={<Login/>}></Route>
          <Route path="/ManagerRegistration" element={<ManagerRegistrationForm/>}></Route>
          <Route path="/ManagerDashboard" element={<ManagerDashboard/>}></Route>
          <Route path="/AddProjectPopup" element={<AddProjectPopup/>}></Route>
          <Route path="/ViewEmployees" element={<ViewEmployees/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
