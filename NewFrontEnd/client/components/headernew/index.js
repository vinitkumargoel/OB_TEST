import React from 'react';
import './style.css';
import { HashRouter as Router } from 'react-router-dom'


export default class Header extends React.Component {
  constructor(props) {
    super(props);
    if (!sessionStorage.getItem('token'))
      this.props.history.push('/')
    this.onLogoutClick = this.onLogoutClick.bind(this)

  }
  obClick() {
    this.props.history.push('/home')
  }
  onLogoutClick() {
    sessionStorage.clear();
    this.props.history.push("/")
  }
  render() {
    return (
      <React.Fragment>
        <div style={{ position: 'fixed', width: '100%', top: '0' }}>
          <div className='Rectangle-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ padding: "20px", cursor: 'pointer' }}
              tabIndex='1' onClick={this.obClick.bind(this)}>
              <span className='OPEN-BANK'>OPTIMA</span>
              <small style={{ marginLeft: '5px', paddingTop: '10px' }}><i>Pay Less, Save More</i></small>
            </div>
            <div style={{ width: '20%', margin: '0' }} className="row">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '0.5px solid rgb(151, 150, 150, .39)' }} className="col">
                <img className="notification-1" src='images/not.png' />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="col">
                <img className="img_user" src='images/img-u.png' />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="col-3">
                <span className='Alice-Salas' style={{ paddingRight: '7px', textTransform: 'capitalize' }}>{this.props.username}</span>
                <i className="fas fa-caret-down"></i>
              </div>

              <div style={{ display: 'flex', color: 'rgb(216, 217, 222)', justifyContent: 'center', alignItems: 'center' }} className="col">
                <i className="fas fa-sign-out-alt logout" onClick={this.onLogoutClick}></i>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '70px' }}></div>
      </React.Fragment>

    );
  }
}
