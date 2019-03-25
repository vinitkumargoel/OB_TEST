import React from 'react';
import './style.css';
import Cards from '../cards'
import images from './config'

export default class AccountDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      business: this.props.accSummary.business
    }
  }
  handleClick() {
    console.log(this.props.history);
    this.props.history.push('commercialOptimizations');
  }

  render() {
    console.log(this.props.accSummary.business, 'accSumary');
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
          {this.state.business.map((value, index) => {
            return (
              <div className="company-card" key={index}>
                <div className="icon" ><img src={images.Icons[index]} alt="icon" />  </div>
                <div>
                  <div><b>{value.name}</b></div>
                  <div>{value.address}</div>
                  <div><b style={{ color: 'grey' }}>Contact</b>:{value.contactNumber}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className='accounts-Card' style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
          {this.state.business.map((value, index) => {
            return (
              <div key={index} style={{ color: 'black', width: '33%' }} className="accountCard_item"><Cards accounts={value.accounts} /></div>
            )
          })}
        </div>
        <div className="services-button">
          <button className='greenBtn' onClick={this.handleClick.bind(this)}>
            <span>SERVICES</span>
            <span style={{ paddingLeft: '20px' }}>
              <i className='fa fa-arrow-right'></i>
            </span>
          </button>
        </div>
      </div>
    )
  }
}
