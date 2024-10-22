import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        userName: "",
        password: "",
    });

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);

        const loginData = {
            userName: formData.userName,
            password: formData.password,
        };

        try {
            const response = await fetch("http://localhost:8080/stackUp/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('authToken', result.content.token);
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('sessionUser', loginData.userName);
                setIsAuthenticated(true);
                navigate('/backlog');
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred while logging in');
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="login-container">
            <div className="login-form" >
                <form onSubmit={handleLogin}>
                    <input
                        name="userName"
                        type="text"
                        value={formData.userName}
                        onChange={handleChange}
                        autoComplete="userName"
                        placeholder="Username"
                    />
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        placeholder="Password"
                    />
                    <button type="submit" className="btn btn-primary">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <a href='/register'>Don't have an account?</a>
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}
