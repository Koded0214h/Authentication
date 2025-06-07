import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/register.css'

export default function LoginForm() {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })

    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})
    const [apiError, setApiError] = useState(null)
    const [success, setSuccess] = useState(false)

    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    const validate = () => {
        const newErrors = {}

        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.password) newErrors.password = "Password is required";

        return newErrors;
    }


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({...prev, [name]:value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            return;
        }

        setLoading(true)
        setSuccess(false)
        setApiError (null)
        setFieldErrors({});

        axios
            .post(`${API_BASE_URL}/api/login/`, {
                username: formData.username,
                password: formData.password
            })
            .then( (res) => {
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('username', res.data.username);
                localStorage.setItem('email', res.data.email);
                setTimeout(() => {
                    setSuccess(true);
                    setLoading(false);
                    navigate('/profile')
                }, 1500);
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    const data = error.response.data;
            
                    if (typeof data === 'object') {
                        setFieldErrors(data);  
                    } else {
                        setApiError(data.toString());
                    }
                } else {
                    setApiError("An error occurred. Please try again.");
                }
            
                setLoading(false);
            })
    }

    return (
        <div className='register-form'>
            <h1>Login Here</h1>
            <div>
                {loading && <p>Submitting...</p>}
                {apiError && <p style={{ color: "red" }}>{apiError}</p>}
                {success && <p style={{ color: "green" }}>Signup successful!</p>}
            </div>
            <form onSubmit={handleSubmit}>
                <div className='form-control'>
                    <input
                        name="username"
                        type="text"
                        value={formData.username}
                        placeholder="Enter username"
                        onChange={handleChange}
                    />
                    <p>{fieldErrors.username}</p>
                </div>
                <div className='form-control'>
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        placeholder="Enter password"
                        onChange={handleChange}
                    />
                    <p>{fieldErrors.password}</p>
                </div>
                <button disabled={loading}>Submit</button>
                <p>Already have an account? <Link to='/'>Register Here</Link></p>
            </form>
        </div>
    )
}
