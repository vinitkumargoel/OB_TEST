import React from 'react';
import './style.css';

export default class Rel extends React.Component{
  constructor(props){
    super(props);
  }
  yesClick(){
    this.props.history.push('./payout')
  }
    render(){
      console.log(this.props.accSumary, 'accSumary');
      let bannerImage = 'url("../../../../images/Banners/img-banner.png")'
        return(
          <div>
            <div className="title">
              <p className = 'My_financials'>My financials</p>
            </div>
            <div className = 'banner-11' style={{display:'flex' ,backgroundImage: bannerImage,backgroundRepeat:'no-repeat'}}>
                <div className="banner-col">
                  <span className = 'Savings-accounts1' style ={{whiteSpace: 'nowrap',display: 'block'}}>Debit Accounts</span>
                  <span className = 'layer1'>{this.props.accounts}</span>
                  <span className = 'Credit-Accounts1' style ={{whiteSpace: 'nowrap'}}>Credit Accounts</span>
                  <span className = 'layer1'>{this.props.accSumary.noOfCreditAccounts}</span>
                </div>
                <div  style = {{display:'flex',flexDirection:'column'}}>
                <span className = 'Savings-accounts1'  style ={{whiteSpace: 'nowrap'}}>Debit Balance</span>
                <span className = 'layer1' style ={{whiteSpace: 'nowrap'}}>£ {this.props.amount}</span>
                <span className = 'Credit-Accounts1'  style ={{whiteSpace: 'nowrap'}}>Credit outstanding</span>
                <span className = 'layer1' style ={{whiteSpace: 'nowrap'}}>£ {this.props.accSumary.totalAvailableCreditBalance}</span>
                </div>
                <div  style = {{display:'flex',flexDirection:'column'}}>
                <span className = 'Want-to-reduce-your1' style={{paddingRight:'30px'}}>Looking for best option to
maximise your savings
and optimise your
expenses ? </span>
                  <div className = 'Rectangle-41' style = {{padding:"16px 45px 16px 36px",
                  display:'flex',marginTop:'16px',cursor:'pointer'}}
                   onClick = {this.yesClick.bind(this)} tabIndex = '1'>
                    <span className = 'YES1' >YES</span><i style = {{ color:'white'}} className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
          </div>
        );
    }
}
