import React from 'react';
import './style.css';
import { HashRouter as Router } from 'react-router-dom'
import Header from '../headernew'
import Sidebar from '../sidebar'
import Banner from '../banner'
import Balance from '../Balances'
import Services from '../../services'

export default class Rel extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      debitData : [],
      creditData : [],
      accSumary: {}
    }
  }
  componentWillMount() {
      let type= sessionStorage.getItem("type")
      var token = sessionStorage.getItem("token");
      if(type ==="retail"){
      Services.totalBalancesCall(token, function(data){
          this.setState({accSumary : data});
          console.log(data)
     }.bind(this),function(err){
         console.log(err);
     })
      Services.creditCall(token, function(data){
          this.setState({creditData : data.banks});

     }.bind(this),function(err){
         console.log(err);
     })
      Services.debitCall(token,function(data){
          this.setState({debitData : data.banks});
      }.bind(this),function(err){
          console.log(err);
      })
    } else if(type ==="commercial"){
        Services.commercialCreditCall(token, function(data){
            this.setState({creditData : data.banks});
  
       }.bind(this),function(err){
           console.log(err);
       })
        Services.commercialDebitCall(token,function(data){
            this.setState({debitData : data.banks});
        }.bind(this),function(err){
            console.log(err);
        })
    }
  }
    render(){
        let type = sessionStorage.getItem("type")
        console.log(type);
        let amount = 0
        this.state.debitData.forEach((bank) => {
            amount = amount + bank.accounts[0].balance
        })
        return(
            <div className='container-fluid' style={{paddingLeft:'0px',paddingRight:'0px'}}>
              <Header username = {this.state.accSumary.username} history = {this.props.history}/>
              <div style = {{display:"flex"}}>
                <Sidebar activeComponent = "home" type={type}/>
              <div className='row main-content' style = {{backgroundColor:"#f5f6fa",width:"94.5%",height:'100vh',overflow:'auto'}}>
                <div className='col-9' style={{paddingTop:'5%'}}>
                <Banner accounts = {this.state.debitData.length} amount = {amount} accSumary = {this.state.accSumary} history = {this.props.history} />
                <Balance creditData = {this.state.creditData} history = {this.props.history}
                debitData = {this.state.debitData}/>
                </div>
                <div className='col-3'>
                <img style = {{height:'677px',width:'260px',paddingTop:'11px',marginTop:'18%',paddingTop: '89%'}} src='images/image-ad@3x.png'/>
                </div>
                </div>
              </div>
            </div>
        );
    }
}
