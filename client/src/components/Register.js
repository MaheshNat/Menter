import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerUser } from '../actions/authActions';
import { Alert } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      age: '',
      grade: '',
      biography: '',
      email: '',
      password: '',
      skills: [],
      courses: [],
      needSkills: [],
      skill: '',
      course: '',
      needSkill: '',
      msg: null,
    };
  }

  componentDidUpdate(prevProps, nextProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error)
      if (error.id === 'REGISTER_FAIL') {
        this.setState({ msg: error.msg.message });
      } else this.setState({ msg: null });
    if (isAuthenticated) this.props.history.push('/invitations');
  }

  handleChange = (e) => {
    if (e.target.value !== ',')
      this.setState({ [e.target.id]: e.target.value });
  };

  handleKeyPress = (e, property) => {
    if (e.key === ',') {
      let newProperties = this.state[property];
      let subProperty = property.substring(0, property.length - 1);
      if (newProperties.includes(e.target.value)) return;
      newProperties.push(this.state[subProperty]);
      this.setState({
        [property]: newProperties,
        [subProperty]: '',
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (
      !this.state.firstName ||
      !this.state.lastName ||
      !this.state.email ||
      !this.state.password ||
      !this.state.age ||
      !this.state.grade
    )
      return;
    this.props.register(
      this.state.firstName,
      this.state.lastName,
      this.state.age,
      this.state.grade,
      this.state.biography,
      this.state.email,
      this.state.password,
      this.state.skills,
      this.state.courses,
      this.state.needSkills
    );
  };

  handleDelete = (property, value) => {
    let newProperties = this.state[property];
    newProperties.splice(newProperties.indexOf(value), 1);
    this.setState({ [property]: newProperties });
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
            <h3 className="text-center">Register</h3>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                value={this.state.firstName}
                onChange={this.handleChange}
                type="text"
                className="form-control"
                id="firstName"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                value={this.state.lastName}
                onChange={this.handleChange}
                type="text"
                className="form-control"
                id="lastName"
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                onChange={this.handleChange}
                type="number"
                className="form-control"
                id="age"
                min="0"
                max="99"
              />
            </div>
            <div className="form-group">
              <label htmlFor="grade">Grade</label>
              <input
                onChange={this.handleChange}
                type="number"
                className="form-control"
                id="grade"
                min="0"
                max="99"
              />
            </div>
            <div className="form-group">
              <label htmlFor="biography">Biography</label>
              <textarea
                value={this.state.biography}
                onChange={this.handleChange}
                rows="5"
                className="form-control"
                id="biography"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                value={this.state.email}
                onChange={this.handleChange}
                type="email"
                className="form-control"
                id="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                value={this.state.password}
                onChange={this.handleChange}
                type="password"
                className="form-control"
                id="password"
              />
            </div>
            <div className="row" style={{ marginLeft: '0.05em' }}>
              {this.state.skills.map((skill) => (
                <span
                  key={skill}
                  className="badge badge-pill badge-primary"
                  style={{
                    marginBottom: '0.5em',
                    marginRight: '0.5em',
                    cursor: 'pointer',
                  }}
                  onClick={() => this.handleDelete('skills', skill)}
                >
                  {skill} &times;
                </span>
              ))}
            </div>
            <div className="form-group">
              <label htmlFor="skill">Skills</label>
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => (
                  <Tooltip id="button-tooltip" {...props}>
                    Press ',' to add skill to list of skills
                  </Tooltip>
                )}
              >
                <input
                  value={this.state.skill}
                  onChange={this.handleChange}
                  onKeyPress={(e) => this.handleKeyPress(e, 'skills')}
                  type="text"
                  className="form-control"
                  id="skill"
                />
              </OverlayTrigger>
            </div>
            <div className="row" style={{ marginLeft: '0.05em' }}>
              {this.state.courses.map((course) => (
                <span
                  key={course}
                  className="badge badge-pill badge-primary"
                  style={{
                    marginBottom: '0.5em',
                    marginRight: '0.5em',
                    cursor: 'pointer',
                  }}
                  onClick={() => this.handleDelete('courses', course)}
                >
                  {course} &times;
                </span>
              ))}
            </div>
            <div className="form-group">
              <label htmlFor="course">Courses</label>
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => (
                  <Tooltip id="button-tooltip" {...props}>
                    Press ',' to add course to list of courses
                  </Tooltip>
                )}
              >
                <input
                  value={this.state.course}
                  onChange={this.handleChange}
                  onKeyPress={(e) => this.handleKeyPress(e, 'courses')}
                  type="text"
                  className="form-control"
                  id="course"
                />
              </OverlayTrigger>
            </div>
            <div className="row" style={{ marginLeft: '0.05em' }}>
              {this.state.needSkills.map((needSkill) => (
                <span
                  key={needSkill}
                  className="badge badge-pill badge-primary"
                  onClick={() => this.handleDelete('needSkills', needSkill)}
                  style={{
                    marginBottom: '0.5em',
                    marginRight: '0.5em',
                    cursor: 'pointer',
                  }}
                >
                  {needSkill} &times;
                </span>
              ))}
            </div>
            <div className="form-group">
              <label htmlFor="needSkill">
                Skills Needed / Things You Want To Learn
              </label>{' '}
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => (
                  <Tooltip id="button-tooltip" {...props}>
                    Press ',' to add skill to list of need-to-learn skills
                  </Tooltip>
                )}
              >
                <input
                  value={this.state.needSkill}
                  onChange={this.handleChange}
                  onKeyPress={(e) => this.handleKeyPress(e, 'needSkills')}
                  type="text"
                  className="form-control"
                  id="needSkill"
                />
              </OverlayTrigger>
            </div>
            <div className="row justify-content-center col-xs-12">
              <button
                className="btn btn-success"
                type="submit"
                disabled={
                  !this.state.firstName ||
                  !this.state.lastName ||
                  !this.state.email ||
                  !this.state.password ||
                  !this.state.age ||
                  !this.state.grade
                }
                style={{
                  cursor:
                    !this.state.firstName ||
                    !this.state.lastName ||
                    !this.state.email ||
                    !this.state.password ||
                    !this.state.age ||
                    !this.state.grade
                      ? 'not-allowed'
                      : 'default',
                }}
              >
                Register
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
    isLoading: state.auth.isLoading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    register: (
      firstName,
      lastName,
      age,
      grade,
      biography,
      email,
      password,
      skills,
      courses,
      needSkills
    ) => {
      dispatch(
        registerUser(
          firstName,
          lastName,
          age,
          grade,
          biography,
          email,
          password,
          skills,
          courses,
          needSkills
        )
      );
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
