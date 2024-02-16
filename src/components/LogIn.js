import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, logIn } from "../config/firebase";
import "./auth.css";
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/Auth';

const LogIn = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError("");
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await logIn(auth, email, password);
            setEmail("");
            setPassword("");
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="col-lg-6 login">
            <h1 className="text-center mb-5">Log In</h1>
            {
                error &&
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            }
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input type="email" className="form-control email" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={handleEmailChange} placeholder="Enter Your Email..." autoComplete="off" />
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={handlePasswordChange} placeholder="Enter Your Password..." />
                </div>
                <button type="submit" className="w-100 btn btn-primary submit">Submit</button>
            </form>
            <p>Don't have an account yet ?<NavLink to="/signup" className="span">Sign Up</NavLink></p>
        </div>
    );
}

export default LogIn;
