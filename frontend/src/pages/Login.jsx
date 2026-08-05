import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

import "./Auth.css";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await api.post("/login", {

                email,

                password

            });

            login(response.data);

            navigate("/");

        }

        catch (err) {

            alert(

                err.response?.data?.detail ||

                "Login Failed"

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="auth-container">

            <div className="auth-card">

                <h1>AI Career Coach</h1>

                <p>

                    Welcome Back 👋

                </p>

                <form onSubmit={handleLogin}>

                    <input

                        type="email"

                        placeholder="Email"

                        value={email}

                        onChange={(e)=>setEmail(e.target.value)}

                        required

                    />

                    <input

                        type="password"

                        placeholder="Password"

                        value={password}

                        onChange={(e)=>setPassword(e.target.value)}

                        required

                    />

                    <button type="submit">

                        {

                            loading

                            ?

                            "Signing In..."

                            :

                            "Login"

                        }

                    </button>

                </form>

                <p>

                    Don't have an account?

                    {" "}

                    <Link to="/register">

                        Register

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;