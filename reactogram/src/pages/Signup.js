import React, { useEffect, useState } from 'react';
import './Signup.css';
import socialdesk from "../images/social-desktop.PNG";
import socialmob from "../images/social-mobile.PNG";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Swal from 'sweetalert2';



const Signup = () => {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNo, setPhoneno] = useState("");
    const [userName, setUserName] = useState("");
    const [disabled, setDisabled] = useState(true);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const signup = (event) => {
        setLoading(true);
        event.preventDefault();
        const requestData = { fullName: fullName, email: email, password: password, userName: userName }
        axios.post(`${API_BASE_URL}/signup`, requestData)
            .then((result) => {
                if (result.status === 201) {
                    setLoading(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'User successfully registered'
                    });
                }
                setEmail('');
                setFullName('');
                setPassword('');
                setPhoneno('');
                setUserName('');
                navigate('/login')
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Some error occured , Please try again later !'
                })
            })
    }

    useEffect(() => {
        if (email !== "" && password !== "" && fullName !== "" && phoneNo !== "" && userName !== "") {
            setDisabled(false);
        }
    }, [email, password , fullName , phoneNo , userName]);


    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-7 col-sm-12 d-flex justify-content-center align-item-center">
                    <img className="social-desk-img" src={socialdesk} alt="Logo for dektop !" />
                    <img className="social-mob-img" src={socialmob} alt="Logo for Mobile !" />
                </div>
                <div className="col-sm-12 col-md-5">
                    <div className="card shadow">
                        <div className="card-body px-5">
                            <h4 className="card-title mt-3 fw-bold text-center">Sign Up</h4>
                            <form onSubmit={(e) => signup(e)}>
                                <input type="tel" value={phoneNo} onChange={(ev) => {setPhoneno(ev.target.value); if(ev.target.value==="")setDisabled(true)}} className="p-2 mt-4 mb-2 form-control input-bg" placeholder='Phone' />
                                <input type="text" value={userName} onChange={(ev) => {setUserName(ev.target.value); if(ev.target.value==="")setDisabled(true)}} className="p-2 mb-2 form-control input-bg" placeholder='Username' />
                                <input type="email" value={email} onChange={(ev) => {setEmail(ev.target.value); if(ev.target.value==="")setDisabled(true)}} className="p-2 mb-2 form-control input-bg" placeholder='Email' />
                                <input type="text" value={fullName} onChange={(ev) => {setFullName(ev.target.value); if(ev.target.value==="")setDisabled(true)}} className="p-2 mb-2 form-control input-bg" placeholder='Full Name' />
                                <input type="password" value={password} onChange={(ev) => {setPassword(ev.target.value); if(ev.target.value==="")setDisabled(true)}} className="p-2 mb-2 form-control input-bg" placeholder='Password' />
                                <div className="mt-3 d-grid">
                                    {
                                        loading ?
                                            <div className='col-md-12 mt-3 text-center'>
                                                <div className="spinner-border text-secondary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>
                                            :
                                            <button type="submit" className={disabled ? "custom-btn custom-btn-blue custom-btn-disabled" : "custom-btn custom-btn-blue"} disabled={disabled}>Sign Up</button>
                                    }
                                </div>
                                <div className="my-4">
                                    <hr className="text-muted" />
                                    <h6 className="text-muted text-center">OR</h6>
                                    <hr className="text-muted" />
                                </div>
                                <div className="mt-3 mb-5 d-grid">
                                    <button type="button" className="custom-btn custom-btn-white">
                                        <span className="text-muted fs-6">Already have an account?</span>
                                        <Link to={'/login'} className="ms-1 text-info fw-bold">Log in</Link>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup