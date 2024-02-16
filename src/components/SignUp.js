import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth , signUp } from "../config/firebase" ; 
import "./auth.css" ;
import { NavLink } from 'react-router-dom';


function SignUp() {
    
    const [ email , setEmail ] = useState("") ;
    const [ password , setPassword ] = useState("") ;
    const [ confirmPassword , setConfirmPassword ] = useState("") ;
    const [ error , setError ] = useState("") ;


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError("")
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError("")
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setError("")
    }

    const navigate = useNavigate() ;

    const handleSubmit = async (e) => {
        e.preventDefault() ;
        if (password !== confirmPassword) {
            return setError("Passord does not match...") ;
        }
        try {
            await signUp ( auth , email , password ) ;
            setEmail("") ;
            setPassword("") ;
            setConfirmPassword("") ;
            setError("Okay")
                navigate("/login");
        } catch ( error ) {
            setError(error.message) ;
        }
    }

    return (
        <div className="col-lg-6 login">
            <h1 className="text-center mb-5">Sign Up</h1>
            {
                // error !== "" ? 
                // <div class="alert alert-danger text-center" role="alert">
                //     { error }
                // </div>
                // : 
                // <div class="alert alert-success text-center" role="alert">
                //     { error }
                // </div>
            }
            <form onSubmit={ handleSubmit }>
                {/* <div className="mb-3">
                    <input type="text" className="form-control username" value={ username } onChange={ handleUsernameChange } placeholder="Enter Your Username..." autoComplete="off"/>
                </div> */}
                <div className="mb-3">
                    <input type="email" className="form-control email" id="exampleInputEmail1" aria-describedby="emailHelp" value={ email } onChange={ handleEmailChange } placeholder="Enter Your Email..." autoComplete="off"/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" id="exampleInputPassword" value={ password } onChange={ handlePasswordChange } placeholder="Enter Your Password..." />
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" id="exampleInputPassword1" value={ confirmPassword } onChange={ handleConfirmPasswordChange } placeholder="Confirm Your Password..." />
                </div>
                <button type="submit" className="w-100 btn btn-primary submit">Submit</button>
            </form>
            <p>already have an account login<NavLink to="/login" className="span">Here</NavLink></p>
        </div>
    )
}

export default SignUp ;