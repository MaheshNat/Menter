import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { loadUser } from './actions/authActions';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers/rootReducer';
import thunk from 'redux-thunk';
import axiosDefaults from 'axios/lib/defaults';

import './App.css';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Invitations from './components/Invitations';
import Profile from './components/Profile';
import Teach from './components/Teach';
import Learn from './components/Learn';
import 'bootswatch/dist/lux/bootstrap.min.css';

axiosDefaults.baseURL = process.env.REACT_APP_BASE_URL;
const store = createStore(rootReducer, applyMiddleware(thunk));

class App extends Component {
  constructor(props) {
    super(props);
    // this.state = { stylePath: 'bootswatch/dist/lux/bootstrap.min.css' };
  }

  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Navigation />
          <div className="container">
            <Route path="/" exact component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/invitations" component={Invitations} />
            <Route path="/profile" component={Profile} />
            <Route path="/teach" component={Teach} />
            <Route path="/learn" component={Learn} />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}
export default App;
