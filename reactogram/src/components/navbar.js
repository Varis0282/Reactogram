import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom';
import React from 'react';
import './navbar.css';
import logo from '../images/logo2.PNG';


const Navbar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () =>{
        localStorage.removeItem("token");
        localStorage.removeItem("User");
        dispatch({type : "LOGIN_ERROR"});
        navigate('/login');
    }

    return (
        <div>
            <nav className="navbar bg-light shadow-sm">
                <div className="container-fluid">
                    <NavLink className="navbar-brand ms-5" to='/'>
                        <img alt='Logo' src={logo} height="55px" className='navbar-pic' />
                    </NavLink>
                    <form className="d-flex me-md-5 align-items-center">
                        { localStorage.getItem("token") != null ?<input className="searchbox form-control me-2" type="search" placeholder="Search" /> : ''}
                        <NavLink className="nav-link text-dark fs-5 icons searchicon icons-hide" to="#"><i className="fa-solid fa-magnifying-glass"></i></NavLink>
                        {localStorage.getItem("token") != null ? <NavLink className="nav-link text-dark fs-5 icons" to="/posts"><i className="fa-solid fa-house"></i></NavLink>:<NavLink className="nav-link text-dark fs-5 icons" to="/"><i className="fa-solid fa-house"></i></NavLink>}
                        { localStorage.getItem("token") != null ?<NavLink className="nav-link text-dark fs-5 icons icons-hide" to="#"><i className="fa-regular fa-heart"></i></NavLink> : ''}
                        { localStorage.getItem("token") != null ?<Dropdown>
                            <Dropdown.Toggle variant="none" className="custom-toggle">
                            <img className='nav-profile-pic' alt="profile pic" src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d2ludGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item><NavLink className="text-decoration-none text-dark mt-0" to="/profile">My Profile</NavLink></Dropdown.Item>
                                <Dropdown.Item onClick={()=>{logout()}}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown> : ''}
                    </form>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;