import React,{useState} from 'react'
import {Link,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {login} from '../../actions/auth'
import '../styles/Login.css';
const Login = ({isAuthenticated,login}) => {
        const [formData,setFormData] = useState({
            email:'',
            password:'',
        });
        
        const {email,password} = formData;

        const onInputChange = (e) => {
            setFormData({...formData,[e.target.name]:e.target.value});
        }
        const submitForm = (e)=>{
            e.preventDefault();
            console.log('submit')
            login({email,password})
        }

        if(isAuthenticated){
            return <Redirect to="/dashboard"></Redirect>
        }
        
        return(
            <div className="login-form p-5">
                <p className="login-form-title">Login</p>
                <hr/>
                 <form onSubmit={e=>submitForm(e)}>
                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                        </div>
                        <input name="email" className="form-control" placeholder="Email address" type="email" value={email} 
                        onChange={e=>onInputChange(e)}/>
                    </div>  
                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-lock" aria-hidden="true"></i></span>
                        </div>
                        <input name="password" className="form-control" placeholder="Password" type="password" value={password}
                        onChange={e=>onInputChange(e)}/>
                    </div> 
                    <button type="submit" className="btn btn-primary text-light form-control">Login</button>
                </form>
                <hr/>
                <p className="text-center">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>
        )
}

Login.prototypes = {
    login:PropTypes.func.isRequired,
    isAuthenticated:PropTypes.bool
}

const mapStateToProps = state =>({
    isAuthenticated:state.auth.isAuthenticated
});
export default connect(mapStateToProps,{login})(Login);