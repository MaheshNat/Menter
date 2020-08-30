import React, { Component } from 'react';

export default class Home extends Component {
  render() {
    return (
      <>
        <div className="jumbotron text-center" style={{ marginTop: '2em' }}>
          <h1>Menter</h1>
          <h3>Teach to learn.</h3>
          <h5 style={{ marginBottom: '2em' }}>
            Made for students, by students.
          </h5>
          <h2>
            Sample Accounts If You Want To Test Out Invitations / Matching
            Logic:
          </h2>
          <h3>Password for all accounts: 'test' (all lowercase)</h3>
          <ul>
            <li>vilma.triana@gmail.com</li>
            <li>kortney.rittenberry@gmail.com</li>
            <li>karri.mullen@gmail.com</li>
            <li>flavia.gutter@gmail.com</li>
            <li>susan.scally@gmail.com</li>
          </ul>
        </div>
      </>
    );
  }
}
