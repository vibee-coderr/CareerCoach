import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import api from "../api";

import "./Auth.css";

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await api.post("/register",{

                username,

                email,

                password

            });

            alert("Registration Successful!");

            navigate("/login");

        }

        catch(err){

            alert(

                err.response?.data?.detail ||

                "Registration Failed"

            );

        }

        finally{

            setLoading(false);

        }

    };

    return(

        <div className="auth-container">

            <div className="auth-card">

                <h1>Create Account</h1>

                <p>

                    Start your AI Career Journey

                </p>

                <form onSubmit={handleRegister}>

                    <input

                        placeholder="Username"

                        value={username}

                        onChange={(e)=>setUsername(e.target.value)}

                        required

                    />

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

                            "Creating..."

                            :

                            "Register"

                        }

                    </button>

                </form>

                <p>

                    Already have an account?

                    {" "}

                    <Link to="/login">

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;