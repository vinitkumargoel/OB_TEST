import React from 'react';
import './style.css';
import {Link} from 'react-router-dom';

import { Button, Icon, Modal, Radio} from 'semantic-ui-react'
import Header from '../headernew'
import Sidebar from '../sidebar'
import Services from '../../services'

export default class Options extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      modalOpen: true,
      debitData : [],
      creditData : [],
      accSumary: {},
      value: ''
    }
  }
  componentWillMount() {
      var token = sessionStorage.getItem("token");
     
     Services.getSISuggestions(token, function(data){
         this.setState({siSuggest : data});
         console.log(data, "getSI")
    }.bind(this),function(err){
        console.log(err);
    })
  }
  handleChange = (e, { value }) => this.setState({ value })
  onCancelClick = () => {
    this.setState({
      value: ''
    })
  }
  onPreviousClick = () => {
    this.setState({
      value: ''
    })
  }
  onNextClick = () => {
    if(this.state.value == 'two-way'){
      this.props.history.push('/setInstructions');
    }
    else{
      console.log('Next');
    }
  }
    render(){
        return(
          <div className='container-fluid' style={{paddingLeft:'0px',paddingRight:'0px'}}>
              <Header username = {this.state.accSumary.username} history = {this.props.history}/>
            <div style = {{display:"flex"}}>
                <Sidebar activeComponent = "wallet" type="commercial"/>
              <div className='main-content' style = {{backgroundColor:"#f5f6fa",width:"94.5%",paddingBottom:'20px'}}>
                <div>
                <h1 style = {{fontWeight: '300',marginTop:'20PX'}}>Commercial Services</h1>
                </div>
                <div className = 'optimizingsModal'>
                    <div className = 'optimizingsModalHeader'>
                    What would you like OPTIMA to do?
                    </div>
                    <div className = 'option' style = {{backgroundColor: (this.state.value === 'two-way') ? 'rgba(0, 106, 77, 0.14)' : 'rgba(196, 198, 205, 0.08)'}}>
                      <div className = 'optionHeader'>
                      Cash Pooling
                      </div>
                        <Radio value = 'two-way' className = 'radioStyle' checked={this.state.value === 'two-way'}
                          onChange={this.handleChange}/>
                      <div className = 'optionMeta'>
                      Manage Cash Pooling transactions for your businesses.
                      </div>
                    </div>
                    
                    <div className = "flex-container">
                      <Link to='/commercialOptimizations'><button className="flex-item" onClick = {this.onCancelClick}>CANCEL</button></Link>
                      <button className="flex-item1" style = {{marginLeft: '310px', display: (this.state.value != '') ? '' : 'none'}}
                      onClick = {this.onNextClick}>NEXT</button>
                    </div>
                </div>
              <div>
            </div>
            </div>
            </div>
            </div>
        );
    }
}
