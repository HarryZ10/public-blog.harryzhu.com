import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { 
    RetrieveUsernameResponse,
    RegisterResponse,
    LoginResponse
} from '../interfaces/apiResponses';
import ToastError from '../utils/ToastError';

const API_BASE_URL = process.env.REACT_APP_API_ROOT ?? 'http://10.10.10.25:80';

export const getUsername = async (id: string): Promise<string> => {

    const response: RetrieveUsernameResponse = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
    }).then(async res => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json()
            .then(err => {
                const error = new ToastError(
                    `Failed to get username: ${err?.message}`,
                    'GET_USERNAME_FAILED'
                );
                throw error;
            });
        }
    }).catch(err => {
        throw err;
    });

    return response.username;
};

// Login
export const login = async (username: string, password: string): Promise<LoginResponse> => {

    const response: LoginResponse = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(async res => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json()
            .then(err => {
                const error = new ToastError(
                    `Failed to login: ${err?.message}`,
                    'LOGIN_FAILED'
                );
                throw error;
            });
        }
    }).catch(err => {
        throw err;
    });

    return response;
};

export const Logout: React.FC  = () => {
    const navigate = useNavigate();
    Cookies.remove('token');

    // Wait for a short time before navigating
    setTimeout(() => {
        navigate("/");
    }, 500);

    return null;
}

// Register
export const register = async (username: string, password: string): Promise<RegisterResponse> => {
    const response: RegisterResponse = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(async res => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json()
            .then(err => {
                const error = new ToastError(
                    `Failed to register: ${err?.message}`,
                    'REGISTER_USER_FAILED'
                );
                throw error;
            });
        }
    }).catch(err => {
        // console.error(`Registration: ${err}`);
        throw err;
    });

    return response;
};
