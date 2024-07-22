import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ImportedURL from '../../common/api';
import { Error, Success } from '../../common/swal';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(true);
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
                    if (res.data.status == 1) {
                        Success('Logged in successfully');
                        localStorage.setItem('vooshtoken', res.data.token);
                        window.location.href = "/";
                    } else {
                        console.log('----',res);
                        Error(res.data.message)
                    }
                }).catch(({ response }) => {
                    Error('Internal server error')
                });
        } catch (error) {
            console.error('Error signing in', error);
        }
    };

    const handleSignUpClick = () => {
        history.push('/signup');
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

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
                    <div className="input-group">
                        <input
                            type={passwordVisible ? "password" : "text"}
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="input-group-text eye-icon" onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                        </span>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Login</button>
            </form>
            <div className="text-center">
                <div className='login'>
                    <span>Don't have an account? </span>
                    <span style={{ color: "#0d6efd", cursor: "pointer" }} onClick={handleSignUpClick}>Sign Up</span>
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
