import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ImportedURL from '../../common/api';
import { Error, Success } from '../../common/swal';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            let formData = {
                email: email,
                password: password
            }
            axios.post(ImportedURL.API.login, formData)
                .then((res) => {
                    if (res.data.status == "1") {
                        Success('Logged in successfully');
                        localStorage.setItem('vooshtoken', res.data.token);
                        window.location.href = "/";
                    } else {
                        Error(res.data.message)
                    }
                }).catch(({ response }) => {
                    Error(response.message)
                });
        } catch (error) {
            console.error('Error signing in', error);
        }
    };
    const handleSignUpClick = () => {
        history.push('/signup');
    };

    // -----gogle login----
    // const handleGoogleSignInSuccess = (response) => {
    //     console.log(response);
    //     // Handle login success, e.g., make an API call to your server
    //     history.push('/tasks');
    // };

    // const handleGoogleSignInFailure = (error) => {
    //     console.error(error);
    //     // Handle login failure
    // };
    return (
        <div className="container mt-5 signin">
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSignIn} className="signin-form">
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Login</button>


            </form>
            <div className="text-center">
                <div className='login'>
                    <span>Don't have an account ? </span><span style={{ color: "#0d6efd", cursor: "pointer" }} onClick={handleSignUpClick}>Sign Up</span>
                </div>
                <div>
                    {/* <GoogleLogin
                        onSuccess={handleGoogleSignInSuccess}
                        onFailure={handleGoogleSignInFailure}
                        className="btn btn-danger btn-block mt-3"
                    /> */}
                </div>
            </div>
        </div>
    );
};

export default SignIn;
