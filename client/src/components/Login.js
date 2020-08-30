import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authActions';
import { Alert } from 'react-bootstrap';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      msg: null,
    };
  }

  componentDidUpdate(prevProps, nextProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error)
      if (error.id === 'LOGIN_FAIL') {
        this.setState({ msg: error.msg.message });
      } else this.setState({ msg: null });
    if (isAuthenticated) this.props.history.push('/profile');
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.email || !this.state.password) return;
    const { email, password } = this.state;
    this.props.login(email, password);
  };

  render() {
    return (
      <div>
        <div
          className="shadow p-3 bg-light"
          style={{
            borderRadius: '0.5em',
            maxWidth: '40em',
            margin: '0 auto',
            marginTop: '1em',
          }}
        >
          <form onSubmit={this.handleSubmit}>
            <h3 className="text-center">Login</h3>
            <div className="form-group required">
              <label htmlFor="email">Email</label>
              <input
                onChange={this.handleChange}
                type="email"
                className="form-control"
                id="email"
              />
            </div>
            <div className="form-group required">
              <label htmlFor="password">Password</label>
              <input
                onChange={this.handleChange}
                type="password"
                className="form-control"
                id="password"
              />
            </div>
            <div className="row justify-content-center col-xs-12">
              <button
                className="btn btn-success"
                type="submit"
                disabled={!this.state.email || !this.state.password}
                style={{
                  cursor:
                    !this.state.email || !this.state.password
                      ? 'not-allowed'
                      : 'default',
                }}
              >
                Login
              </button>
            </div>
          </form>
        </div>
        {this.props.isLoading && (
          <div className="row justify-content-center">
            <div className="col text-center">
              <div
                className="spinner-border"
                style={{ width: '5em', height: '5em' }}
                role="status"
              ></div>
            </div>
          </div>
        )}
        {this.state.msg && (
          <Alert
            style={{
              borderRadius: '0.5em',
              maxWidth: '40em',
              margin: '0 auto',
              marginTop: '1em',
            }}
            variant="danger"
          >
            {this.state.msg}
          </Alert>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    login: (email, password) => {
      dispatch(loginUser(email, password));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
