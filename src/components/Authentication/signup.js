import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ImportedURL from '../../common/api';
import { Error, Success } from '../../common/swal';
import axios from 'axios';

const SignUp = () => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
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
                if (err.response.status == 409) {
                    Error('Email Already exist')
                } else {
                    Error('Something went wrong')
                }
            });
        } catch (error) {
            console.error('Error signing up', error);
        }
    };

    const handlePass = (name, value) => {
        if (name == 'cpass') {
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
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => handlePass("pass", e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmpassword}
                        onChange={(e) => handlePass("cpass", e.target.value)}
                        required
                    />
                    {confirmpassworderror && (
                        <div className="text-danger mt-2">Passwords do not match</div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
            </form>
            <div className="text-center">
                <div className='login'>
                    <span>Already have an account ? </span><span style={{ color: "#0d6efd", cursor: "pointer" }} onClick={handleLoginClick}>Login</span>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
