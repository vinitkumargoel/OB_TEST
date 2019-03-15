import React from 'react';
import './style.css';
import Cards from '../cards'
import images from './config'

export default class AccountDetails extends React.Component{
  constructor(props){
    super(props);
    this.state ={
        business :this.props.accSummary.business
    }
  }
  handleClick() {
      console.log(this.props.history);
    this.props.history.push('commercialOptimizations');
  }

    render(){
      console.log(this.props.accSummary.business, 'accSumary');
        return(
        <div >
            <div style={{display:'flex',justifyContent:'space-evenly',paddingLeft:'7%',width:'1200px'}}>
                {this.state.business.map((value,index) =>{
                    return(
                        <div className="company-card" key={index}>
                        <div className="icon" ><img src={images.Icons[index]} alt="icon"/>  </div>
                        <div>
                            <div><b>{value.name}</b></div>
                            <div>{value.address}</div>
                            <div><b style={{color:'grey'}}>Contact</b>:{value.contactNumber}</div>
                        </div> 
                        </div>
                    )
                })}
            </div>
            <div className='accounts-Card' style={{display:'flex',justifyContent:'space-evenly',paddingLeft:'7%',width:'1200px'}}> 
                {this.state.business.map((value,index) =>{
                    return(
                        <div key={index} style={{color:'black',width:'33%' ,paddingLeft:'20px'}}><Cards accounts={value.accounts}/></div>
                    )
                })}   
            </div>
            <div className ="services-button">
            <button className='btn payout-button optimize-btt rectangle'onClick={this.handleClick.bind(this)}>
                  <div>SERVICES</div>
                  <div>
                    <i style = {{width: '26px',height: '18.3px'}} className='fas fa-arrow-right'></i>
                  </div>
                </button>
            </div>
        </div> 
        )
    }
}
