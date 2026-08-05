import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("email");

        if (token) {

            api.defaults.headers.common["Authorization"] =
                `Bearer ${token}`;

            setUser({
                username,
                email
            });

        }

        setLoading(false);

    }, []);

    const login = (data) => {

        localStorage.setItem(
            "token",
            data.access_token
        );

        localStorage.setItem(
            "username",
            data.username
        );

        localStorage.setItem(
            "email",
            data.email
        );

        api.defaults.headers.common["Authorization"] =
            `Bearer ${data.access_token}`;

        setUser({
            username: data.username,
            email: data.email
        });

    };

    const logout = () => {

    localStorage.clear();

    delete api.defaults.headers.common["Authorization"];

    setUser(null);

    window.location.href = "/login";

};

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export const useAuth = () => useContext(AuthContext);