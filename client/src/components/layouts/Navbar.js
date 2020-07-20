import React,{Fragment} from 'react';
import {Link} from 'react-router-dom';
import '../styles/Navbar.css';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {logout} from '../../actions/auth';
import { BrowserRouter as Router } from 'react-router-dom';
const NavBar = ({isAuthenticated,loading,logout}) => {

    const userLinks = (
        <ul className="navbar-nav">
        <li className="nav-item" onClick={logout}>
            <Link className="nav-link" to="/register">
                <i className="fas fas-signout"></i>
                <span>Log Out</span>
            </Link>
        </li>
        </ul>
    )

    const guestLinks = (
        <ul className="navbar-nav">
            <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
            </li>
        </ul>
    )
      return(
          <div className="navbar-navigation-bar">
              <nav className="navbar navbar-expand-lg navbar-primary bg-dark">
                  
                    <Link className="navbar-brand" to="/">DevConnect</Link>
                    <button className="navbar-toggler navbar-toggler-primary" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon">   
                            <i className="fas fa-bars" style={{color:"#fff",fontSize:"28px"}}></i>
                        </span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <div className="ml-auto text-center">
                        {!loading && (<Fragment>{isAuthenticated? userLinks: guestLinks}</Fragment>)}
                        </div>
                    </div>
                </nav>
          </div>
      )
}

const mapStateToProps = state=>({
    isAuthenticated:state.auth.isAuthenticated,
    loading:state.auth.loading,
})

export default connect(mapStateToProps,{logout})(NavBar);