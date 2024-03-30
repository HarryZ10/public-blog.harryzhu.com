// src/contexts/AuthContext.tsx
import React, { 
    createContext,
    useContext,
    useState,
    useEffect
} from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { JSONPayload } from '../components/feed/CreateCommentForm';
interface User {
    username: string;
    userId: string;
    token: string;
}

interface AuthContextProps {
    user: User | null;
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
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
