import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
// import type { UserRole } from '../shared/types';

interface User {
    role: 'SUPER_ADMIN' | 'TERRITORY_MANAGER';
    territory: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (role: 'SUPER_ADMIN' | 'TERRITORY_MANAGER') => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Recover user from local storage if available
        const storedRole = localStorage.getItem('userRole') as 'SUPER_ADMIN' | 'TERRITORY_MANAGER';
        if (storedRole) {
            login(storedRole);
        }
    }, []);

    const login = (role: 'SUPER_ADMIN' | 'TERRITORY_MANAGER') => {
        let newUser: User;
        if (role === 'SUPER_ADMIN') {
            newUser = {
                role: 'SUPER_ADMIN',
                territory: 'All',
                name: 'Admin User'
            };
        } else {
            newUser = {
                role: 'TERRITORY_MANAGER',
                territory: 'Cairo - Nasr City',
                name: 'Tarek Manager'
            };
        }
        setUser(newUser);
        localStorage.setItem('userRole', role);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userRole');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
