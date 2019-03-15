import React from 'react';
import './style.css';

export default class Rel extends React.Component{
  constructor(props){
    super(props);
  }
  
    render(){
      console.log(this.props.accSummary, 'accSumary');
      let bannerImage = 'url("../../../../images/commercialBanner/img-banner.png")'
        return(
          <div>
            <div className="title">
              <p className = 'My-financials'>My business</p>
            </div>
            <div style={{display:'flex',paddingLeft:'7%',width:'1250px',backgroundImage: bannerImage}} >
              <div className='flex-container'>
                <span><div className="header-title">Total Balance</div><div className="header-value">£ {this.props.accSummary.totalBalance}</div></span>
              </div>
              <div className='flex-container'>
                <span><div className="header-title">Total Accounts</div><div className="header-value"> {this.props.accSummary.totalAccounts}</div></span>
              </div>
              <div className='flex-container'>
                <span><div className="header-title">Total Business</div><div className="header-value"> {this.props.accSummary.totalBusinesses}</div></span>
              </div>  
            </div>
          </div>
        );
    }
}
