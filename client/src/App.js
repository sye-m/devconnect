import React,{Fragment, useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import NavBar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import {Provider} from 'react-redux';
import store from './store.js';
import {loadUser} from './actions/auth';
import Alert from './components/layouts/Alert';
import setAuthToken from './utils/setAuthToken';

const token = localStorage.getItem("token");

const App = () => {

  useEffect(()=>{
    store.dispatch(loadUser());
  },[])
  return (
  <Provider store={store}>
    <Router>
      <Fragment>
        <NavBar/>
          <div className="app-container p-2">
            <Alert/>
            <Switch>
                <Route exact path="/" component={Landing}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
            </Switch>
          </div>
      </Fragment>
    </Router>
  </Provider>
);
}
export default App;
