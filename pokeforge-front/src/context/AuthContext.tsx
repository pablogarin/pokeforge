import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthUser {
    userId: number;
    email: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => void;
    refreshSession: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refreshSession = async () => {
        try {
            const response = await fetch('http://localhost:8001/api/v1/auth/me', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setUser({ userId: data.user_id, email: data.email });
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error(err);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        refreshSession();
    }, []);

    const logout = () => {
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, logout, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be wrapped inside a matching AuthProvider");
    }
    return context;
}
