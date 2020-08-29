import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerUser } from '../actions/authActions';
import { Alert } from 'react-bootstrap';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      age: null,
      email: null,
      password: null,
      msg: null,
    };
  }

  componentDidUpdate(prevProps, nextProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error)
      if (error.id === 'REGISTER_FAIL') {
        this.setState({ msg: error.msg.message });
      } else this.setState({ msg: null });
    if (isAuthenticated) this.props.history.push('/posts');
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.name || !this.state.email || !this.state.password) return;
    const { name, email, password } = this.state;
    this.props.register(name, email, password);
  };

  render() {
    return (
      <div>
        <div
          className='shadow p-3 bg-light'
          style={{
            borderRadius: '0.5em',
            maxWidth: '40em',
            margin: '0 auto',
            marginTop: '1em',
          }}
        >
          <form onSubmit={this.handleSubmit}>
            <h3 className='text-center'>Register</h3>
            <div className='form-group required'>
              <label htmlFor='name'>Name</label>
              <input
                onChange={this.handleChange}
                type='text'
                className='form-control'
                id='name'
              />
            </div>
            <div className='form-group required'>
              <label htmlFor='email'>Email</label>
              <input
                onChange={this.handleChange}
                type='email'
                className='form-control'
                id='email'
              />
            </div>
            <div className='form-group required'>
              <label htmlFor='password'>Password</label>
              <input
                onChange={this.handleChange}
                type='password'
                className='form-control'
                id='password'
              />
            </div>
            <div className='row justify-content-center col-xs-12'>
              <button
                className='btn btn-success'
                type='submit'
                disabled={
                  !this.state.name || !this.state.email || !this.state.password
                }
                style={{
                  cursor:
                    !this.state.name ||
                    !this.state.email ||
                    !this.state.password
                      ? 'not-allowed'
                      : 'default',
                }}
              >
                Register
              </button>
            </div>
          </form>
        </div>
        {this.state.msg && (
          <Alert
            style={{
              borderRadius: '0.5em',
              maxWidth: '40em',
              margin: '0 auto',
              marginTop: '1em',
            }}
            variant='danger'
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
    register: (name, email, password) => {
      dispatch(registerUser(name, email, password));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
