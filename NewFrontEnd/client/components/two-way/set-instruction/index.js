import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { Button, Icon, Modal, Radio } from 'semantic-ui-react'
import Header from '../../headernew'
import Sidebar from '../../sidebar'
import Services from '../../../services'
import 'bootstrap/dist/css/bootstrap.min.css';

export default class TwoWay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: true,
      debitData: [],
      creditData: [],
      accSumary: {},
      value: '',
      input:'',
      instructionData: null,
      contraAccount: "",
      controlAccount: "",
      target: null,
      updatedInstruction:null
    }
  }
  componentWillMount() {
    var token = sessionStorage.getItem("token");
    Services.debitCall(token, function (data) {
      let list = this.dropdownList(data["banks"]);
      this.setState({ creditData: list });
      console.log(data["banks"]);
    }.bind(this), function (err) {
      console.log(err);
    })

    Services.instructionCall(token, function (data) {
      // data=JSON.parse(data);
      this.setState({ instructionData: data });
      console.log(data)
    }.bind(this), function (err) {
      console.log(err);
    })

    


  //   Services.getSISuggestions(token, function (data) {
  //     this.setState({ siSuggest: data });
  //     console.log(data, "getSI")
  //   }.bind(this), function (err) {
  //     console.log(err);
  //   })
   }
  handleChange = (e, { value }) => this.setState({ value })
  onCancelClick = () => {
    this.setState({
      value: ''
    })
  }

  dropdownList = (details) => {
    let data = [];
    details.map((value, index) => {
      let account = value["accounts"][0]
      let displayValue = value["bankName"] + " - " + account["accountNumber"]
      let obj = {
        "label": displayValue,
        "bankName": value["bankName"],
        "bankID": value["bankId"],
        "value": account["accountNumber"],
        "key": index
      }
      data.push(obj);
    })
    console.log(data, typeof (data));
    return data;
  }


   submitInstruction = () =>{
    var token = sessionStorage.getItem("token");
    let query = {
      token : token,
      data:{
        controlBank : JSON.parse(this.state.controlAccount),
        contraBank: JSON.parse(this.state.contraAccount),
        target: this.state.target
      }
    }
    
    Services.submitInstruction(query,function(data){
      console.log(data);
      return data;
    })

    Services.instructionCall(token, function (data) {
      // data=JSON.parse(data);
      this.setState({ instructionData: data });
      console.log(data)
    }.bind(this), function (err) {
      console.log(err);
    })
    
    this.setState({contraAccount:"",controlAccount:"",input:'',target:null});
    this.refresh();
  }

  onPreviousClick = () => {
    this.setState({
      value: ''
    })
  }

  
  onNextClick = () => {
    if (this.state.value == 'pool') {
      this.props.history.push('/poolfrom');
    } else {
      console.log('Next');
    }
  }

  refresh = () =>{
    var token = sessionStorage.getItem("token");
    Services.instructionCall(token, function (data) {
      // data=JSON.parse(data);
      this.setState({ instructionData: data });
      console.log(data)
    }.bind(this), function (err) {
      console.log(err);
    })
  }

  setControlAccount = (e) => {
    this.setState({ controlAccount: e.target.value,input:true });
  }

  selectContraAccount = (e) => {
    this.setState({ contraAccount: e.target.value });
  }

  setTarget = (e) => {
    this.handleChange(e, true);
    this.setState({ target: e.target.value });
  }


  execute = () =>{
    var token = sessionStorage.getItem("token");
    Services.transact(token,function(data){
      console.log(data);
      if(data){
        alert("Execution complete.");
      }
    })
  }



  render() {
    console.log(this.state, "state");
    
    return (
      <div className='container-fluid' style={{ paddingLeft: '0px', paddingRight: '0px' }}>
        <Header username={this.state.accSumary.username} history={this.props.history} />
        <div style={{ display: "flex" }}>
          <Sidebar activeComponent="wallet" />
          <div className='main-content' style={{ backgroundColor: "#f5f6fa", width: "94.5%", paddingBottom: '20px' }}>
            <div>
              <h1 style={{ fontWeight: '300', marginTop: '20PX' }}>My Instructions</h1>
            </div>
            <div className='optimizingsModal'>
              <Link to='/commercialOptimizations'>
                <div className='closeIcon' tabIndex='1'>
                  <img src={'images/optimizings/close-icon.png'} />
                </div>
              </Link>

              <div className="container">
                <div className="row">
                  
                  <div className="col-sm">
                    <span style={{ fontWeight: '300', marginTop: '20PX' }}> Contra account</span>
                    <select className="dropdown" onChange={this.selectContraAccount} value={this.state.contraAccount} placeholder="Select a contra account">
                    <option value="none" >----Select an Account------</option>
                      {this.state.creditData.map((value, index) => {
                        let obj = JSON.stringify(value);
                        return (<option value={obj} key={value["key"]}>{value["label"]}</option>);
                      })}
                    </select>
                  </div>

                  <div className="col-sm">
                    <span style={{ fontWeight: '300', marginTop: '20PX' }}> Control account</span>
                    
                    <select className="dropdown" onChange={this.setControlAccount} value={this.state.controlAccount} placeholder="Select a control account">
                    <option value="none" >----Select an Account------</option>
                      {this.state.creditData.map((value, index) => {
                        let obj = JSON.stringify(value);
                        return (<option value={obj} key={value["key"]}>{value["label"]}</option>);
                      })}
                    </select>
                  </div>
                </div>
                </div>
                <div className="container">
                <div className="row">
                  <div className="col-sm">  </div>
                  <div className="col-sm" style={{display: (this.state.input != '') ? '' : 'none' }}>
                    <span style={{ fontWeight: '300', marginTop: '20PX' }}> Target Amount </span>  
                    <input type="text" placeholder="0.000" onChange={this.setTarget} value={this.state.target} />
                  </div>
                </div>
              </div>

              <div className="container">
              <div className="row">
                <div className="col-sm"></div> 
                <div className="col-sm"></div>     
                <div className="col-sm"><button className="flex-item1" style={{ display: (this.state.value != '') ? '' : 'none' }} onClick= {this.submitInstruction}
                  >ADD</button></div>
              </div>
              </div>
              {this.state.instructionData !== null ?
              (<div><div className="container">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#Instruction</th>
                      <th scope="col">Contra</th>
                      <th scope="col">Control</th>
                      <th scope="col">Target</th>
                      <th scope="col">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.instructionData["instruction-list"].map((value,index)=>{
                    return(<tr key={index}>
                      <th scope="row">{value.instructionID}</th>
                      <td>{value.contraBankAccountNumber}</td>
                      <td>{value.controlBankAccountNumber}</td>
                      <td>{value.target}</td>
                      <td>{value.priorityID}</td>
                    </tr>)
                    })}
                  </tbody>
                </table>  
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-sm">  </div>
                  <div className="col-sm">  </div>
                  <div className="col-sm"><button className="flex-item1"  onClick={this.execute}
                 >EXECUTE</button> </div>
                </div>  
              </div></div>):(null)}
              
              
            </div>
            <div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
