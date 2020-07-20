import React,{useState} from 'react'
import '../styles/Register.css';
import {Link,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert'
import {register} from '../../actions/auth'
import {PropTypes} from 'prop-types'
const Register = ({isAuthenticated,setAlert,register}) => {
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:'',
        password2:''
    });

    const {name, email, password, password2} = formData;

    const onInputChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const submitForm = async (e) => {
        e.preventDefault();
        if(password!==password2){
            setAlert('password does not match','danger');
        }
        else{
            register({name,email,password})
        }
    }

    if(isAuthenticated){
        return <Redirect to="/dashboard"></Redirect>
    }
    
    return (
        <div className="register-form p-5">
            <p className="register-form-title">Create Account</p>
            <hr/>
                <form onSubmit={e=>submitForm(e)}>
                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-user"></i> </span>
                        </div>
                        <input 
                        name="name" className="form-control" 
                        placeholder="Full name" type="text" 
                        value={name}
                        onChange={e=>onInputChange(e)}/>
                    </div> 
                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                        </div>
                        <input 
                        name="email" className="form-control" 
                        placeholder="Email address" 
                        type="email"
                        value={email}
                        onChange={e=>onInputChange(e)} />
                    </div>  
                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-lock" aria-hidden="true"></i></span>
                        </div>
                        <input name="password" className="form-control" 
                        placeholder="Password" type="password"
                        value={password}
                        onChange={e=>onInputChange(e)} />
                    </div>                                 
                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><i className="fa fa-lock" aria-hidden="true"></i></span>
                        </div>
                        <input name="password2" className="form-control"
                         placeholder="Confirm Password" type="password" 
                        value={password2}
                        onChange={e=>onInputChange(e)}/>
                    </div>                                                                                            
                    <button type="submit" className="btn btn-primary text-light form-control">Sign Up</button>
                </form>
                <hr/>
                <p className="text-center">
                    Already have an account with us? <Link to="/login">Login</Link>
                </p>
            </div>
    )
}

Register.propTypes ={
    setAlert:PropTypes.func.isRequired,
}

const mapStateToProps = state =>({
    isAuthenticated:state.auth.isAuthenticated
});
export default connect(mapStateToProps,{setAlert,register})(Register);
