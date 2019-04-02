import React from 'react';
import './style.css';
import Services from '../../services';
import images from '../accountDetails/config';
import buttonImages from './config';
import { Modal, Button } from 'semantic-ui-react';

export default class Accordians extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      accSumary: null,
      selectedBusiness: this.props.index,
      selectedControlAccount: null,
      selectedContraAccount: null,
      target: 0,
      execMode: null,
      execFrequency: null
    }
  }
  componentWillMount() {
    var token = sessionStorage.getItem("token");
    Services.commercialDebitCall(token, function (data) {
      this.setState({ accSumary: data });
    }.bind(this));
  }

  handleAddInstr = () => {
    var token = sessionStorage.getItem("token");
    let data = {}
    data.controlBusinessName = this.state.accSumary.business[this.state.selectedBusiness].name;
    data.contraBusinessName = this.state.accSumary.business[this.state.selectedBusiness].name;
    data.contraBankAccountNumber = this.state.accSumary.business[this.state.selectedBusiness].accounts[this.state.selectedContraAccount].accountNumber;
    data.controlBankAccountNumber = this.state.accSumary.business[this.state.selectedBusiness].accounts[this.state.selectedControlAccount].accountNumber;
    data.target = this.state.target;
    data.contraAccountType =this.state.accSumary.business[this.state.selectedBusiness].accounts[this.state.selectedContraAccount].type;
    data.controlAccountType =this.state.accSumary.business[this.state.selectedBusiness].accounts[this.state.selectedControlAccount].type;
    let query = {
      token: token,
      data: data
    }

    Services.submitInstruction(query, function (data) {
      this.props.refresh();
      this.setState({ showModal: true });
    }.bind(this))
  }

  handleTarget = (e) => {
    this.setState({ target: e.target.value });
  }

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  handleControlAccount = (index) => {
    this.setState({ selectedControlAccount: index });
    let controlBox = document.getElementById('controlBox');
    controlBox.style.pointerEvents = 'none';
    let controlAccount = document.getElementsByClassName('accountCard1')[index];
    controlAccount.style.background = '#00864f';
    let pTags = controlAccount.getElementsByTagName('p');
    for (let i in pTags) {
      if (pTags[i].tagName === 'P') {
        pTags[i].style.color = 'white';
      }
    }
    let contraAccount = document.getElementsByClassName('accountCard2');
    for (let i in contraAccount) {
      if (contraAccount[i].tagName === "DIV") {
        contraAccount[i].style.display = 'block';
      }
    }
    contraAccount[index].style.opacity = 0.5;
    contraAccount[index].style.pointerEvents = 'none';
  }

  handleContraAccount = (index) => {
    this.setState({ selectedContraAccount: index });
    let contraAccount = document.getElementsByClassName('accountCard2')[index];
    contraAccount.style.background = '#66980c';
    let pTags = contraAccount.getElementsByTagName('p');
    for (let i in pTags) {
      if (pTags[i].tagName === 'P') {
        pTags[i].style.color = 'white';
      }
    }
    let contraAccounts = document.getElementsByClassName('accountCard2');
    for(let i of contraAccounts) {
      i.style.pointerEvents = 'none';
    }
    let finalAccordion = document.getElementById('collapseThree');
    let currentAccordion = document.getElementById('collapseTwo');
    currentAccordion.className = 'collapse';
    finalAccordion.className = 'collapse show';
     
  }

  closeModal = () => {
    this.setState({ showModal: false });
    this.props.getAccordian()
  }

  manipulateAccountNumber = (accountNumber) => {
    accountNumber.toString();
    let number = '';
    for (let index = 0; index < accountNumber.length; index++) {
      if (index === 1 || index === 3) {
        number = number + accountNumber[index] + '-';
      } else if (index === 5) {
        number = number + accountNumber[index] + ' ';
      } else {
        number = number + accountNumber[index];
      }
    }

    return number;
  }

  handleExecMode = (e) => {
    this.setState({execMode: e.target.value})
  }

  handleFrequencyChange = (e) => {
    this.setState({execFrequency: e.target.value});
  }
  renderWeeklyList = () => {
    const WeeklyList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return (
      <div style={{ width: '25%' }}>
          <label htmlFor="instType" style={{ width: '100%' }}>Frequency</label>
          <select style={{ borderRadius: '5px', width: '75%' }} id="WeeklyDay" name="Day">
            {WeeklyList.map((day) => {
              return <option key={day}>{day}</option>
            })}
          </select>
        </div>
    )
  }
  renderMonthlyList = () => {
    return (
      <div style={{ width: '25%' }}>
        <label htmlFor="instType" style={{ width: '100%' }}>Day</label>
        <input type="date" className="monthDate" id="Day" name="Day"/>
      </div>
    )
  }

  renderExtraDropDown = () => {
    return (
      <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '4%' }}>
        <div style={{ width: '25%' }}>
          <label htmlFor="instType" style={{ width: '100%' }}>Frequency</label>
          <select style={{ borderRadius: '5px', width: '75%' }} id="instType" name="Frequency" onChange={(e) => this.handleFrequencyChange(e)}>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
        <div style={{ width: '25%' }}>
          <label htmlFor="instType" style={{ width: '100%' }}>Time</label>
          <select style={{ borderRadius: '5px', width: '75%' }} id="instType" name="Time">
            <option>E.O.D</option>
            <option>B.O.D</option>
          </select>
        </div>
        {this.state.execFrequency === 'Weekly' ?
          this.renderWeeklyList() : this.state.execFrequency === 'Monthly' ?
          this.renderMonthlyList() : <div></div>}
      </div>
      <hr />
      </div>
    )
    
  }

  //Reset Button. To be handled properly
  handleReset = () => {
    window.location.reload();
  }

  render() {
    if (this.state.accSumary) {
      return (
        <div style={{ width: '100%' }}>
          <div style={{ margin: '1.5% 0' }}>
            <p className='My-financials'>Add new instruction for {this.state.accSumary.business[this.props.index].name}</p>
          </div>

          <div className="accordion" id="accordionExample">
            <div className="card accordianCard">
              <div className="cardHeader" id="headingTwo" data-toggle="collapse" data-target="#collapseTwo">
                <div style={{ width: '100%', color: '#00864f' }}>
                  <span><b>ASSIGN ACCOUNTS</b></span>
                  <span style={{ float: 'right' }}><i className='fa fa-angle-down'></i></span>
                  <span className="stepsListing">Step 1 of 2 &nbsp; &nbsp;</span>
                </div>
              </div>
              <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                <div className="card-body" style={{ padding: '0 2% 3% 2%' }}>
                  <div className="secondAccordionMain">
                    <div id="controlBox" style={{ width: '50%', display: 'flex', flexWrap: 'wrap' }}>
                      <h6 style={{ width: '50%', margin: '15px', fontWeight: 'bold' }}>Select Control Account</h6>
                      <input type="checkbox" style={{ marginTop: '15px' }} disabled id="controlCheckbox" />
                      <label htmlFor="controlCheckbox" style={{ margin: '10px', fontWeight: 'lighter' }}>
                        Force Debit
                      </label>
                      {this.state.accSumary.business[this.state.selectedBusiness].accounts.map((value, index) => {
                        return (
                          <div id="accountCard1" className="card accountCard1" key={index} onClick={() => this.handleControlAccount(index)}>
                            <div className="card-body secondAccordionMain">
                              <div style={{ width: '50%' }}>
                                <p className="accountName" style={{ marginBottom: '5px' }}>{value.accountName}</p>
                                <p className="accountNumber" style={{ fontSize: '20px' }}>{this.manipulateAccountNumber(value.accountNumber)}</p>
                              </div>
                              <div style={{ width: '50%' }}>
                                <p className="availableBalance">₤ {this.numberWithCommas(value.availableBalance)}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div id="contraBox" style={{ width: '50%', display: 'flex', flexWrap: 'wrap' }}>
                      <h6 style={{ width: '50%', margin: '15px', fontWeight: 'bold' }}>Select Contra Account</h6>
                      <input type="checkbox" style={{ marginTop: '15px' }} disabled id="contraCheckbox" />
                      <label htmlFor="controlCheckbox" style={{ margin: '10px', fontWeight: 'lighter' }}>
                        Force Debit
                      </label>
                      {this.state.accSumary.business[this.state.selectedBusiness].accounts.map((value, index) => {
                        return (
                          <div className="card accountCard2" key={index} onClick={() => this.handleContraAccount(index)}>
                            <div className="card-body secondAccordionMain">
                              <div style={{ width: '50%' }}>
                                <p className="accountName" style={{ marginBottom: '5px' }}>{value.accountName}</p>
                                <p className="accountNumber" style={{ fontSize: '20px' }}>{this.manipulateAccountNumber(value.accountNumber)}</p>
                              </div>
                              <div style={{ width: '50%' }}>
                                <p className="availableBalance">₤ {this.numberWithCommas(value.availableBalance)}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {(this.state.selectedContraAccount !==null && this.state.selectedControlAccount !==null) ?
              (
                <div style={{ width: '100%', display: 'flex',marginBottom:'2%'}}>
                          <div className="card accountCard1" style={{width:'40%',background:'#00864f',marginRight:'11%'}}>
                            <div className="card-body secondAccordionMain">
                              <div style={{ width: '50%' }}>
                                <p className="accountName" style={{ marginBottom: '5px',color:'white' }}>{this.state.accSumary.business[this.state.selectedBusiness].accounts[this.state.selectedControlAccount].accountName}</p>
                                <p style={{ fontSize: '20px',color:'white' }}>{this.manipulateAccountNumber(this.state.accSumary.business[this.state.selectedBusiness].accounts[this.state.selectedControlAccount].accountNumber)}</p>
                              </div>
                              <div style={{ width: '50%' }}>
                                <p className="availableBalanceDisplay">₤ {this.numberWithCommas(this.state.accSumary.business[this.state.selectedBusiness].accounts[this.state.selectedControlAccount].availableBalance)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="card accountCard1" style={{width:'40%',background:'rgb(102,152,12)',marginRight:'2%'}}>
                            <div className="card-body secondAccordionMain">
                              <div style={{ width: '50%' }}>
                                <p className="accountName" style={{ marginBottom: '5px',color:'white' }}>{this.state.accSumary.business[this.state.selectedBusiness].accounts[this.state.selectedContraAccount].accountName}</p>
                                <p style={{ fontSize: '20px' ,color:'white'}}>{this.manipulateAccountNumber(this.state.accSumary.business[this.state.selectedBusiness].accounts[this.state.selectedContraAccount].accountNumber)}</p>
                              </div>
                              <div style={{ width: '50%' }}>
                                <p className="availableBalanceDisplay">₤ {this.numberWithCommas(this.state.accSumary.business[this.state.selectedBusiness].accounts[this.state.selectedContraAccount].availableBalance)}</p>
                              </div>
                            </div>
                          </div>
                    </div>
 
              ):(null)}
            <div className="card accordianCard">
              <div className="cardHeader" id="headingThree" data-toggle="collapse" data-target="#collapseThree">
                <div style={{ width: '100%', color: '#00864f' }}>
                  <span><b>SET VALUES AND INSTRUCTION</b></span>
                  <span style={{ float: 'right' }}><i className='fa fa-angle-down'></i></span>
                  <span className="stepsListing">Step 2 of 2 &nbsp; &nbsp;</span>
                </div>
              </div>
              <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                <div className="card-body">
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '4%' }}>
                    <div style={{ width: '25%' }}>
                      <label htmlFor="numberIP" style={{ width: '100%' }}>Value</label>
                      <input type="number" min='0' id="numberIP" onChange={(e) => this.handleTarget(e)} style={{ border: '1px solid rgb(169, 169, 169)', padding: '2%' }} />
                    </div>
                    <div style={{ width: '25%' }}>
                      <label htmlFor="instType" style={{ width: '100%' }}>Instruction Type</label>
                      <select style={{ borderRadius: '5px', width: '75%' }} id="instType" name="Instruction Type" onChange={(e) => this.handleExecMode(e)}>
                        <option>Target Balance</option>
                        <option>Percentage</option>
                        <option>Fixed Amount</option>
                      </select>
                    </div>
                    <div style={{ width: '25%' }}>
                      <label htmlFor="execMode" style={{ width: '100%' }}>Execution Mode</label>
                      <select onChange={(e) => this.handleExecMode(e)} style={{ borderRadius: '5px', width: '75%' }} id="execMode" name="Execution Mode">
                        <option>Manual</option>
                        <option>Auto</option>
                      </select>
                    </div>
                    <div style={{ width: '25%' }}>
                      <input type="checkbox" id="instReversal" checked disabled style={{ display: 'none' }} />
                      <label htmlFor="instReversal" style={{ margin: '30px 0 0 30px' }}>
                        <img src={buttonImages.buttons[2]} />&nbsp; Reversal
                      </label>
                    </div>
                  </div>
                  <hr />
                  {this.state.execMode === 'Auto' ? this.renderExtraDropDown() : <div></div>}
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div style={{ width: '100%' }}>
                      <button className="greenBtn addInst_addBtn" onClick={this.handleAddInstr}>
                        <span>ADD</span>
                      </button>
                      <button className="greenBtn addInst_resetBtn" onClick={this.handleReset}>
                        <span>RESET</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Modal open={this.state.showModal} onClose={this.closeModal} basic size='tiny' style={{ width: '100%' }}>
            <div className="instAddModalContainer">
              <div className="instAddModal" style={{ backgroundImage: 'url(images/Added1.png)', backgroundSize: 'cover' }}>
                <div className='headStyle'>
                  <h1 style={{ color: 'white' }}>Instruction added!</h1>
                </div>
                <Button color='green' className='btn2' onClick={this.closeModal}>OK</Button>
              </div>
            </div>
          </Modal>
        </div>
      )
    } else {
      return null;
    }
  }
}