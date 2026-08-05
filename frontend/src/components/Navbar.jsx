import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./Navbar.css";

function Navbar() {

    const { user, logout } = useAuth();

    return (

        <header className="navbar">

            <NavLink
                to="/"
                className="brand"
            >

                <span className="brand-mark">

                    AI

                </span>

                <span>

                    AI Career Coach

                </span>

            </NavLink>

            <nav className="nav-links">

                {user ? (

                    <>

                        <NavLink to="/">

                            Resume

                        </NavLink>

                        <NavLink to="/interview">

                            Interview

                        </NavLink>

                        <NavLink to="/dashboard">

                            Dashboard

                        </NavLink>

                        <span className="username">

                            👋 {user.username}

                        </span>

                        <button
                            className="logout-btn"
                            onClick={logout}
                        >

                            Logout

                        </button>

                    </>

                ) : (

                    <>

                        <NavLink to="/login">

                            Login

                        </NavLink>

                        <NavLink to="/register">

                            Register

                        </NavLink>

                    </>

                )}

            </nav>

        </header>

    );

}

export default Navbar;