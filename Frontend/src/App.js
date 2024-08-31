import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage.js';
import Login from './components/Login.js';
import ManagerRegistrationForm from './components/ManagerRegistrationForm.js';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/HomePage" element={<HomePage/>}></Route>
          <Route path="/Login" element={<Login/>}></Route>
          <Route path="/Register" element={<ManagerRegistrationForm/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
