// src/contexts/AuthContext.tsx
import React, { 
    createContext,
    useContext,
    useState,
    useEffect
} from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { JSONPayload } from '../components/feed/CreateCommentForm';
import toast from 'react-hot-toast';
import { getAllUsers } from '../api/UsersAPI';

interface User {
    username: string;
    userId: string;
    token: string;
}

interface AuthContextProps {
    user: User | null;
    appUsers: any[];
    login: (username: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be within an AuthProvider');
    }
    return context;
}

export const AuthProvider: React.FC<any> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [appUsers, setAppUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getUsers = async () => {
            await getAllUsers()
            .then((res) => {
                setAppUsers(res.results);
            })
            .catch((err: any) => {
                console.log("Cannot use search");
                console.error(err);
            });
        };

        getUsers();

    }, [user]);

    useEffect(() => {
        const token = Cookies.get("token");

        if (token) {
            try {
                const decodedToken = jwtDecode<JSONPayload>(token);
                const userData: User = {
                    username: decodedToken.username,
                    userId: decodedToken.user_id,
                    token: token,
                };
                setUser(userData);
            } catch (error) {
                console.error(`Invalid token: ${error}`);
                Cookies.remove('token');
            }
        }
    }, [])

    const login = (username: string, token: string) => {
        const userData: User = {
            username: username,
            userId: jwtDecode<JSONPayload>(token).user_id,
            token: token,
        };
        setUser(userData);
        Cookies.set('token', token, { secure: false });
    };

    const logout = () => {
        setUser(null);
        Cookies.remove('token');
        toast.dismiss();
        toast.success("Signed out successfully")
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, appUsers }}>
            {children}
        </AuthContext.Provider>
    )
}
