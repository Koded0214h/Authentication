import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import { Navigate } from 'react-router-dom';

import RegisterForm from "./components/RegisterForm";
import LoginForm from './components/LoginForm';
import Profile from './components/Profile';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<RegisterForm />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App;