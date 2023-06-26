import React, { useState } from 'react';
import socialdesk from "../images/social-desktop.PNG";
import socialmob from "../images/social-mobile.PNG";
import "./Login.css";
import { useDispatch } from 'react-redux'
import { Link , useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Swal from 'sweetalert2';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [userName, setUserName] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const login = (event) => {
        setLoading(true);
        event.preventDefault();
        const requestData = { email, password }
        axios.post(`${API_BASE_URL}/login`, requestData)
            .then((result) => {
                if (result.status === 200){
                    setLoading(false);
                    localStorage.setItem("token" , result.data.result.token);
                    localStorage.setItem("User" , JSON.stringify(result.data.result.user));
                    dispatch({type:'LOGIN_SUCCESS' ,payload : result.data.result.user});
                    setLoading(false);
                    navigate('/profile');
                }
                setEmail('');
                setPassword('');
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error
                })
            })
    }


    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-7 col-sm-12 d-flex justify-content-center align-item-center">
                    <img className="social-desk-img" src={socialdesk} alt="Logo for dektop !" />
                    <img className="social-mob-img" src={socialmob} alt="Logo for Mobile !" />
                </div>
                <div className="col-sm-12 col-md-5">
                    <div className="card shadow">
                        {loading ? (<div className='col-md-12 mt-3 text-center'>
                            <div className="spinner-border text-secondary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>) : ('')}
                        <div className="card-body px-5">
                            <h4 className="card-title mt-3 fw-bold text-center">Login</h4>
                            <form onSubmit={(e)=>{login(e)}}>
                                <input type="text" value={email} onChange={(ev) => setEmail(ev.target.value)} className="p-2 mt-4 mb-2 form-control input-bg" placeholder='Phone number, username or email' />
                                <input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)} className="p-2 mb-2 form-control input-bg" placeholder='Password' />
                                <div className="mt-3 d-grid">
                                    <button type="submit" className="custom-btn custom-btn-blue">Login</button>
                                </div>
                                <div className="my-4">
                                    <hr className="text-muted" />
                                    <h6 className="text-muted text-center">OR</h6>
                                    <hr className="text-muted" />
                                </div>
                                <div className="mt-3 mb-5 d-grid">
                                    <button type="button" className="custom-btn custom-btn-white">
                                        <span className="text-muted fs-6">Don't have an account?</span>
                                        <Link to={'/signup'} className="ms-1 text-info fw-bold">Sign up</Link>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
