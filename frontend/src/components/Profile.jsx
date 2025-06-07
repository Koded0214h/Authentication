import { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';

export default function Dashboard() {
    const username = localStorage.getItem('username');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000); // simulate load delay
    }, []);

    if (loading) return <p>Loading your dashboard...</p>;

    return (
        <div>
            <h1>Welcome, {username} 👋</h1>
            <LogoutButton />
        </div>
    );
}
