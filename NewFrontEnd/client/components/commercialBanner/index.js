import React from 'react';
import './style.css';

export default class Rel extends React.Component {
  constructor(props) {
    super(props);
  }

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    console.log(this.props.accSummary, 'accSumary');
    let bannerImage = 'url("../../../../images/commercialBanner/img-banner.png")'
    return (
      <div style={{ width: '100%', padding: '0px' }}>
        <div style={{ margin: '1.5% 0' }}>
          <p className='My-financials'>My businesses</p>
        </div>
        <div className="row" style={{
          margin: '0', width: '100%', backgroundImage: bannerImage,
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover', color: 'white', padding: '20px 30px 10px 30px'
        }}>
          <div className='col'>
            <span><div className="header-title">Total Balance</div><div className="header-value">£ {this.numberWithCommas(this.props.accSummary.totalBalance)}</div></span>
          </div>
          <div className='col'>
            <span><div className="header-title">Total Accounts</div><div className="header-value"> {this.numberWithCommas(this.props.accSummary.totalAccounts)}</div></span>
          </div>
          <div className='col'>
            <span><div className="header-title">Total Business</div><div className="header-value"> {this.numberWithCommas(this.props.accSummary.totalBusinesses)}</div></span>
          </div>
        </div>
      </div>
    );
  }
}
