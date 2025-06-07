import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); // or remove only token & user info
        navigate('/login');
    };

    return <button onClick={handleLogout}>Logout</button>;
}
