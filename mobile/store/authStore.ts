import { create } from 'zustand';
import { User, UserRole } from '@shared/types';
import { users } from '@shared/mockData';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (mobile: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: async (mobile: string) => {
        // Mock login logic
        const foundUser = users.find((u) => u.mobile === mobile);
        if (foundUser) {
            set({ user: foundUser, isAuthenticated: true });
            return true;
        }
        return false;
    },
    logout: () => set({ user: null, isAuthenticated: false }),
    setUser: (user: User) => set({ user }),
}));
