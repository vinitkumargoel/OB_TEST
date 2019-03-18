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
      input: '',
      instructionData: null,
      currentInstructions:[],
      updatedInstruction: null,
      popupFlag: false,
      dropDownAccountData:[],
      controlAccountNumber:"",
      contraAccountNumber:"",
      target: null,
      instructionType:"Target Balance",
      executionMode:"Manual",
      reversal:false,
      forceDebitControlAccount:false,
      forceDebitContraAccount:false
    }
  }
  componentWillMount() {
    var token = sessionStorage.getItem("token");
    Services.commercialDebitCall(token, function (data) {
      let accountNumbers = this.dropdownList(data["business"]);
      this.setState({ dropDownAccountData: accountNumbers });
      console.log(accountNumbers)
    }.bind(this), function (err) {
      // console.log(err);
    })

    Services.instructionCall(token, function (data) {
      // data=JSON.parse(data);
      this.setState({ instructionData: data },()=>console.log(this.state.instructionData));
      console.log("data-instructions", this.state.instructionData)
    }.bind(this), function (err) {
      // console.log(err);
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

  dropdownList = (businesses) => {
    let accountNumbers = [];
    businesses.map((business, index) => {
      business["accounts"].map((account,i)=>
      {
        accountNumbers.push(account["accountNumber"])
      })
    })
    // console.log(data, typeof (data));
    return accountNumbers;
  }
  changeSetInstructionValues=(event)=>
  {
    const {name,type} = event.target
    let data = ""
    type==="checkbox"?data=event.target.checked:data=event.target.value
    console.log(data)
    this.setState({
    [name]:data
    })
  }
  addInstruction=()=>{
    let instruction = {}
    instruction.controlBankAccountNumber = this.state.controlAccountNumber
    instruction.contraBankAccountNumber = this.state.contraAccountNumber
    instruction.forceDebitControlAccount = this.state.forceDebitControlAccount
    instruction.forceDebitContraAccount = this.state.forceDebitContraAccount
    instruction.target = this.state.target
    instruction.instructionType = this.state.instructionType
    instruction.executionMode = this.state.executionMode
    instruction.reversal = this.state.reversal
    console.log(instruction)
    this.submitInstruction(instruction)

    
  }
  submitInstruction = (instruction) => {
    var token = sessionStorage.getItem("token");
    let query = {
      token: token,
      data: instruction
    }

    Services.submitInstruction(query, function (data) {
       //console.log(data);
      return data;
    })

    Services.instructionCall(token, function (data) {
      // data=JSON.parse(data);
      this.setState({ instructionData: data });
      console.log("Submit instruction",data);
    }.bind(this), function (err) {
      // console.log(err);
    })

    this.setState({ contraAccount: "", controlAccount: "", input: '', target: null });
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
      // console.log('Next');
    }
  }

  refresh = () => {
    var token = sessionStorage.getItem("token");
    Services.instructionCall(token, function (data) {
      // data=JSON.parse(data);
      this.setState({ instructionData: data });
      // console.log(data)
    }.bind(this), function (err) {
      // console.log(err);
    })
  }

  setTarget = (e) => {
    this.handleChange(e, true);
    this.setState({ target: e.target.value });
  }


  execute = () => {
    var token = sessionStorage.getItem("token");
    Services.transact(token, function (data) {
      // console.log(data);
      if (data) {
        alert("Execution complete.");
      }
    })
  }

  popup = () => {
    console.log("okay");
    this.setState({ popupFlag: true });
  }
  toggleModal = () => {
    this.setState({ popupFlag: !this.state.popupFlag });
  }


  render() {
    console.log("Modal", this.state.popupFlag);

    return (
      <div className='container-fluid contnr1' >
        <Header username={this.state.accSumary.username} history={this.props.history} />
        <div style={{ display: "flex" }}>
          <Sidebar activeComponent="wallet" />
          <div className='main-content' style={{ backgroundColor: "#f5f6fa", width: "90%", paddingBottom: '20px' }}>
            <div>
              <h2 style={{ fontWeight: '200', marginTop: '20PX', height: '4px' }}>Add new instruction</h2>
            </div>
            <div className='optimizingsModal'>
              <Link to='/commercialOptimizations'>
              </Link>
              <div className="container">
                
                <div className='row'>
                  <div className='col-sm-3' style={{ marginLeft: '-280px' }}>
                    <label style={{ color: '#00864f' }}> Control account</label>
                    <select name = "controlAccountNumber" className="dropdown"
                      style={{ width: '310px', height: '40px', border: 'solid 1px #d1d1d1', backgroundColor: 'rgba(196, 198, 205, 0.08)' }}
                      onChange={this.changeSetInstructionValues} value={this.state.controlAccountNumber} placeholder="Select a control account">
                      <option value="none" >----Select an Account------</option>
                      {this.state.dropDownAccountData.map((accountNumber, index) => {
                        return (<option value={accountNumber} key={index}>{accountNumber}</option>);
                      })}
                    </select>
                    <div style={{ width: '175px' }}>
                      <label className='availBal'>Available balance: 60,000</label></div>

                  </div>
                  <div className='col-sm-3 ui checkbox' style={{ marginLeft: '173px', marginTop: '38px' }} >

                    <input name="forceDebitControlAccount" onChange={this.changeSetInstructionValues} type="checkbox" style={{ backgroundColor: '#00864f' }} checked={this.state.forceDebitControlAccount} />
                    <label>Force debit</label>

                  </div>
                  <div className='col-sm-3' >
                    <label style={{ color: '#00864f' }}>Contra account</label>
                    
                    <select name = "contraAccountNumber" className="dropdown"
                      style={{ width: '310px', height: '40px', border: 'solid 1px #d1d1d1', backgroundColor: 'rgba(196, 198, 205, 0.08)' }}
                      onChange={this.changeSetInstructionValues} value={this.state.contraAccountNumber} placeholder="Select a contra account">
                      <option value="none" >----Select an Account------</option> */}
                      {this.state.dropDownAccountData.map((accountNumber, index) => {
                        return (<option value={accountNumber} key={index}>{accountNumber}</option>);
                      })}
                    </select>
                    <div style={{ width: '200px' }}>
                      <label className='availBal'>Available balance: 1,00,000</label></div>

                  </div>
                  <div className='col-sm-3 ui checkbox' style={{ marginLeft: '550px', marginTop: '-58px' }}>
                    <input name = "forceDebitContraAccount" onChange = {this.changeSetInstructionValues} type="checkbox" style={{ backgroundColor: '#00864f' }} checked={this.state.forceDebitContraAccount} />
                    <label>Force debit</label>
                  </div>
                  <div className="col-sm-3 ui form " style={{ marginTop: '60px', marginLeft: '-280px' }}>
                    <div className="field">
                      <label style={{ color: '#00864f', width: '200px' }}>VALUE</label>
                      <input name = "target" onChange={this.changeSetInstructionValues} type="text" style={{ width: '200px', height: '40px', border: 'solid 1px #d1d1d1', backgroundColor: 'rgba(196, 198, 205, 0.08)' }}
                        placeholder="0.000" value={this.state.target} />
                    </div>
                  </div>
                  <div className='col-sm-5' style={{ marginLeft: '92px', marginTop: '60px', width: '175px' }}>
                    <label style={{ color: '#00864f', width: '132px', height: '19px' }}>INSTRUCTION TYPE</label>
                    <select name = "instructionType" className="dropdown" style={{ width: '250px' }} placeholder="Select an instruction type"
                    onChange={this.changeSetInstructionValues} value={this.state.instructionType}>
                      <option value="none" >Target balance</option>
                    </select>
                  </div>
                  <div className='col-sm-3' style={{ marginLeft: '456px', marginTop: '-67px' }}>

                    <label style={{ color: '#00864f', width: '129px', height: '19px' }}>
                      EXECUTION MODE
                      </label>
                    <select name = "executionMode" className="dropdown" style={{ width: '250px' }} placeholder="Select an execution mode"
                    onChange={this.changeSetInstructionValues} value={this.state.executionMode}>
                      <option value="none" >Manual</option>
                    </select>

                  </div>
                </div>
                <div style={{ marginTop: '82px', marginLeft: '209px' }}>
                  <div class="ui grid">
                    <div class="four wide column"> <div className='ui checkbox' style={{ marginLeft: '-490px' }}>

                      <input name = "reversal" type="checkbox" onChange={this.changeSetInstructionValues} checked={this.state.reversal} />
                      <label>Reversal</label>
                    </div></div>
                    <div class="four wide column"> <button className="ui secondary basic button" style={{ width: '139px', marginLeft: '-34px', height: '42px', border: 'solid 1px #979797' }}>CANCEL</button></div>
                    <div class="four wide column">
                      <button className="ui secondary basic button" style={{ width: '139px', height: '42px', marginLeft: '30px', border: 'solid 1px #979797' }}>RESET</button></div>
                    <div class="four wide column"> <button className="colorbtn" onClick={this.addInstruction}>ADD</button></div>
                  </div>
                </div>
                <div>
                </div>
              </div>
              
              <React.Fragment>
                <div>
                  <h2 className='curr_instruction'>Current instructions</h2>
                </div>
                <div className="tableContainer">
                  <table className="ui single line table table_heading">
                    <thead>
                      <tr className="currentInstruction">
                        <th>
                          <div className='ui checkbox chkBox1'>
                            <input type="checkbox" />
                          </div>
                        </th>
                        <th>Control A/C</th>
                        <th>Contra A/C </th>
                        <th>Value </th>
                        <th>Instruction type</th>
                        <th>Priority</th>
                        <th>Execution mode</th>
                        <th>Reversal</th>
                        <th>Actions</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.instructionData!==null?this.state.instructionData.currentInstructions.map((instruction,index)=>
                        <tr className="currentInstruction">
                        <td><div className='ui checkbox chkBox2'>
                          <input type="checkbox" checked="true" />
                        </div></td>
                        <td>{instruction.controlBankAccountNumber}</td>
                        <td>{instruction.contraBankAccountNumber}</td>
                        <td>{instruction.target}</td>
                        <td>{instruction.instructionType}</td>
                        <td>{instruction.priorityId}</td>
                        <td>{instruction.executionMode}</td>
                        <td>{instruction.reversal}</td>
                        <td><Icon name="edit icon" /></td>
                        <td><Icon name="trash icon" className='delete1' /></td>
                        <td><Icon name=' disabled bars icon' /></td>
                        {/* style ={{marginTop: '10px !important',marginLeft: '-16px !important'}} */}
                      </tr>
                      ):""}
                     

                    </tbody>
                  </table>

                </div>

              </React.Fragment>

              <div>
                <button className="executeBtn">EXECUTE SELECTED
               <Icon name="arrow right icon"></Icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}