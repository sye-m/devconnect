import React from 'react'
import '../styles/Landing.css';
import {Link} from 'react-router-dom';
const Landing = () => {
    return (
        <div className="landing-container">
            <div className="landing-bg-image"></div>
            <div className="landing-welcome p-4">
                <p className="landing-description">
                Find and connect with developers
                </p>
                <div>
                    <button className="btn btn-primary">
                        <Link to="/register" className="text-light">
                            Sign Up
                        </Link>
                    </button>
                    <button className="btn btn-secondary ml-2">
                        <Link to="/login" className="text-light">
                            Login
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Landing
