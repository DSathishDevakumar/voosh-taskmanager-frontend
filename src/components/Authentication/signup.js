import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ImportedURL from '../../common/api';
import { Error, Success } from '../../common/swal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
    const [confirmpassworderror, setConfirmPasswordError] = useState(false);
    const history = useHistory();

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmpassword) {
            setConfirmPasswordError(true);
            return;
        }
        try {
            let formData = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            }
            axios.post(ImportedURL.API.addUser, formData).then((res) => {
                Success('Success')
                history.push('/signin');
            }).catch((err) => {
                if (err.response.status === 409) {
                    Error('Email Already exists')
                } else {
                    Error('Something went wrong')
                }
            });
        } catch (error) {
            console.error('Error signing up', error);
        }
    };

    const handlePass = (name, value) => {
        if (name === 'cpass') {
            setConfirmPassword(value);
            if (password === value) {
                setConfirmPasswordError(false);
            } else {
                setConfirmPasswordError(true);
            }
        } else {
            setPassword(value);
            if (confirmpassword) {
                if (confirmpassword === value) {
                    setConfirmPasswordError(false);
                } else {
                    setConfirmPasswordError(true);
                }
            }
        }
    };

    const handleLoginClick = () => {
        history.push('/signin');
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    return (
        <div className="container mt-5 signup">
            <h2 className="text-center mb-4">Sign Up</h2>
            <form onSubmit={handleSignUp} className="signup-form">
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={firstname}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={lastname}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
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
                            onChange={(e) => handlePass("pass", e.target.value)}
                            required
                        />
                        <span className="input-group-text eye-icon" onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-group">
                        <input
                            type={confirmPasswordVisible ? "password" : "text"}
                            className="form-control"
                            value={confirmpassword}
                            onChange={(e) => handlePass("cpass", e.target.value)}
                            required
                        />
                        <span className="input-group-text eye-icon" onClick={toggleConfirmPasswordVisibility}>
                            <FontAwesomeIcon icon={confirmPasswordVisible ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    {confirmpassworderror && (
                        <div className="text-danger mt-2">Passwords do not match</div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
            </form>
            <div className="text-center">
                <div className='login'>
                    <span>Already have an account? </span><span style={{ color: "#0d6efd", cursor: "pointer" }} onClick={handleLoginClick}>Login</span>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
