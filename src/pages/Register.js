import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
    });

    const handleRegister = async (event) => {
        event.preventDefault();
        setLoading(true);

        const data = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            userName: formData.userName,
            email: formData.email,
            password: formData.password,
        };

        try {
            // Perform POST API call
            const response = await fetch("http://localhost:8080/stackUp/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            console.log(result);
            if (response.ok && result.hasError === false) {
                setTimeout(() => {
                    alert("Registration complete."); // Delayed alert
                }, 100);
                navigate('/login');
            } else {
                setError(result.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred');
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
            <div className="login-form">
                <form onSubmit={handleRegister}>
                    <input
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        autoComplete="firstName"
                        placeholder="firstName"
                    />
                    <input
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        autoComplete="lastName"
                        placeholder="lastName"
                    />
                    <input
                        name="userName"
                        type="text"
                        value={formData.userName}
                        onChange={handleChange}
                        autoComplete="userName"
                        placeholder="Username"
                    />
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        placeholder="Email"
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
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                <a href='/login'>Already have an account?</a>
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}
