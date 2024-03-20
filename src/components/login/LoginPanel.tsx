import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { login, register } from "../../api/UsersAPI";
import themes from "../../styles/themes";

const PageStyles: { 
    registerLink: React.CSSProperties;
    container: React.CSSProperties;
    form: React.CSSProperties;
    button: React.CSSProperties;
    buttonHover: React.CSSProperties;
} = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '500px',
        backgroundColor: themes.dark.colors.background,
    },
    form: {
        width: '300px',
        padding: '20px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow for the box effect
        borderRadius: '5px',
        backgroundColor: themes.dark.colors.postBackground,
    },
    button: {
        backgroundColor: '#2286f2',
        borderColor: '#2286f2',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        transition: 'background-color 0.3s, transform 0.3s',
        marginTop: '50px',
        display: 'block',
        height: '40px',
        marginLeft: 'auto', // Centers the button
        marginRight: 'auto', // Centers the button
        width: '100%' // Full width
    },
    buttonHover: {
        backgroundColor: '#114278',
        borderColor: '#114278',
        transform: 'scale(1.05)'
    },
    registerLink: {
        color: '#007bff', // Blue color for the link
        textDecoration: 'none',
        marginTop: '10px',
        display: 'block', // Ensures the link is on a new line
        textAlign: 'center',
        cursor: 'pointer'
    }
};

const LoginPanel: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register
    const history = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Capture the current URL and store it as returnUri
        const currentUrl = window.location.href.replace("/login", "")
        localStorage.setItem('returnUri', currentUrl);
    }, []);

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    const onLoginHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await login(username, password)
        .then(res => {
            const token = res.token;
            Cookies.set('token', token, { secure: false });
            history("/")
            toast.success("User logged in successfully.")
        })
        .catch(err => {
            if (err?.code == "LOGIN_FAILED") {
                toast.error(err?.message);
            } else {
                toast.error("Failed to login: Please check console for more details.")
            }
        });
    };

    const onRegisterHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await register(username, password)
        .then(res => {
            if (res?.message === "Success") {
                history("/");
                toast.success("Account was registered successfully! Please log in again.")
            }
        })
        .catch(err => {
            if (err?.code == "REGISTER_USER_FAILED") {
                toast.error(err?.message);
            } else {
                toast.error("Failed to register: Please check console for more details.")
            }
        })
    };

    return (
        <div style={PageStyles.container}>
            <Form style={PageStyles.form}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update username
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update username
                    />
                </Form.Group>

                <Button
                    style={{ ...PageStyles.button, ...(isHovered ? PageStyles.buttonHover : null) }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    variant="primary"
                    onClick={!isRegistering ? onLoginHandler : onRegisterHandler}
                    type="submit"
                >
                    {isRegistering ? "Register" : "Login"}
                </Button>

                <a href="#" style={PageStyles.registerLink} onClick={toggleForm}>
                    {isRegistering ? "or login" : "or register"}
                </a>
            </Form>
        </div>
    )
}

export default LoginPanel;
