import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
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
        if (!formData.email) newErrors.email = "Email is required";
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
            .post(`${API_BASE_URL}/api/register`, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
            .then( (res) => {
                console.log("Username:", localStorage.getItem("username"));
                const { token, username, email } = res.data;

                localStorage.setItem('token', token)
                localStorage.setItem('username', username);
                localStorage.setItem('email', email);

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
            });
            
    }

    return (
        <div className='register-form'>
            <h1>Register Here</h1>
            <div>
                {loading && <p>Submitting...</p>}
                {apiError && <p style={{ color: "red" }}>{apiError}</p>}
                {success && <p style={{ color: "green" }}>Signup successful!</p>}
            </div>
            <form onSubmit={handleSubmit}>
                <div className='form-control'>
                    <p style={{ color: "red" }}>{fieldErrors.username}</p>
                    <input
                        name="username"
                        type="text"
                        value={formData.username}
                        placeholder="Enter username"
                        onChange={handleChange}
                    />
                </div>
                <div className='form-control'>
                    <p style={{ color: "red"}}>{fieldErrors.email}</p>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        placeholder="Enter email address"
                        onChange={handleChange}
                    />
                </div>
                <div className='form-control last'>
                    <p style={{ color: "red" }}>{fieldErrors.password}</p>
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        placeholder="Enter password"
                        onChange={handleChange}
                    />
                </div>
                <button disabled={loading}>Submit</button>
                <p>Already have an account? <Link to='/login'>Login Here</Link></p>
            </form>
        </div>
    )
}
