import React from 'react';
import './style.css';
import { HashRouter as Router } from 'react-router-dom'
import Header from '../headernew'
import Sidebar from '../sidebar'
import Banner from '../commercialBanner'
import Balance from '../Balances'
import Services from '../../services'
import AccountDetails from '../accountDetails'



export default class Rel extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      accSumary:null
    }
  }
  componentWillMount() {
    var token = sessionStorage.getItem("token");
    console.log(token);
    Services.commercialDebitCall(token,function(data){
      console.log(token);
      console.log(data);
      this.setState({accSumary:data});
    }.bind(this));
  }
  
    render(){
        var type = sessionStorage.getItem("type");
        if(this.state.accSumary !== null){ 
        return(
          
            <div className='container-fluid' style={{paddingLeft:'0px',paddingRight:'0px'}}>
              <Header username = {this.state.accSumary.username} history = {this.props.history}/>
              <div style = {{display:"flex"}}>
                <Sidebar activeComponent = "home" type={type}/>
              <div className='row main-content' style = {{backgroundColor:"#f5f6fa",width:"94.5%"}}>
                <Banner accSummary ={this.state.accSumary}  history = {this.props.history}/>
                <AccountDetails  accSummary ={this.state.accSumary}  history = {this.props.history}/>
                </div>
              </div>
            </div>
        );
       }
       else{
         return null;
       }
    }
}
