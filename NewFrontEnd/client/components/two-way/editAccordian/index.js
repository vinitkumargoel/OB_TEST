import React from 'react';
import './style.css';
import Services from '../../../services';
import buttonImages from './config';
import { Modal, Button } from 'semantic-ui-react';

export default class EditAccordian extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      accSumary: null,
      businessSavingsAccounts:[],
      selectedBusiness:{first:null,second:null},
      selectedAccount:{first:null,second:null},
      selectedControlAccount: null,
      selectedContraAccount: null,
      execMode: null,
      execFrequency: null,
      target:"",
    }
  }
  componentDidMount() {
    var token = sessionStorage.getItem("token");
    console.log(token);
      Services.commercialDebitCall(token, function (data) {
        let businessSavingsAccounts  = this.populateBusiness(data["business"]);
        this.setState({accSumary: data });
        if(this.props.type==="inter")
        {
        let firstBusiness = businessSavingsAccounts.filter(busi=>busi.business===this.props.instruction.controlBusinessName);
        let secondBusiness = businessSavingsAccounts.filter(busi=>busi.business===this.props.instruction.contraBusinessName);
        let selectedBusiness = {}
        Object.assign(selectedBusiness,this.state.selectedBusiness)
        selectedBusiness.first = firstBusiness[0]
        selectedBusiness.second = secondBusiness[0]
        console.log("sel",selectedBusiness)
        this.setState({selectedBusiness:selectedBusiness})
        }
        else{
          let firstAccount =  data.business[this.props.index].accounts.filter(account=>account.type===this.props.instruction.controlAccountType)
          let secondAccount = data.business[this.props.index].accounts.filter(account=>account.type===this.props.instruction.contraAccountType)
          let selectedAccount= {}
          Object.assign(selectedAccount,this.state.selectedAccount)
          selectedAccount.first = firstAccount[0]
          selectedAccount.second = secondAccount[0]
          console.log("selAgain",selectedAccount)
          this.setState({selectedAccount:selectedAccount})
        }
        this.setState({businessSavingsAccounts:businessSavingsAccounts})
        console.log(data)
        console.log("BSA",businessSavingsAccounts)
      }.bind(this), function (err) {
        // console.log(err);
      })
      this.setState({target:this.props.instruction.target})
  }
  componentDidUpdate(prevProps)
  {
    if(this.props.instruction.instructionId!== prevProps.instruction.instructionId)
    {
      if(this.props.type === "inter")
      {
      let firstBusiness = this.state.businessSavingsAccounts.filter(busi=>busi.business===this.props.instruction.controlBusinessName);
      let secondBusiness = this.state.businessSavingsAccounts.filter(busi=>busi.business===this.props.instruction.contraBusinessName);
      let selectedBusiness = {}
      Object.assign(selectedBusiness,this.state.selectedBusiness)
      selectedBusiness.first = firstBusiness[0]
      selectedBusiness.second = secondBusiness[0]
      console.log("selAgain",selectedBusiness)
      this.setState({selectedBusiness:selectedBusiness})
      }
      else{
      let firstAccount =  this.state.accSumary.business[this.props.index].accounts.filter(account=>account.type===this.props.instruction.controlAccountType)
      let secondAccount = this.state.accSumary.business[this.props.index].accounts.filter(account=>account.type===this.props.instruction.contraAccountType)
      let selectedAccount= {}
      Object.assign(selectedAccount,this.state.selectedAccount)
      selectedAccount.first = firstAccount[0]
      selectedAccount.second = secondAccount[0]
      console.log("selAgain",selectedAccount)
      this.setState({selectedAccount:selectedAccount})
      }
      this.setState({target:this.props.instruction.target})
    }
  }
  populateBusiness = (businesses) => {
    let businessSavingsAccounts=[]
    businesses.map((business, index) => {
      let flag = false
     let businessSavingsAccount={}
     businessSavingsAccount.business = business["name"]
      business["accounts"].map((account, i) => {
        if(account["accountName"]==="Business Savings Account")
        {
        businessSavingsAccount.availableBalance = account["availableBalance"]
        businessSavingsAccount.accountNumber = account["accountNumber"]
        flag = true
        }
      })
    if(flag===true)
      businessSavingsAccounts.push(businessSavingsAccount)
    })
    // console.log(data, typeof (data));
    return businessSavingsAccounts;
  }
  handleEditInstr = () => {
    var token = sessionStorage.getItem("token");
    if(this.state.target!=="")
    {
    let data = {}
    data.target = this.state.target
    let query = {
      token: token,
      data: data,
      instructionId:this.props.instruction.instructionId
    }
    Services.editInstruction(query, function (data) {
       console.log("edit",data)
       this.props.refresh("edit")
     }.bind(this))
     this.setState({showModal:true})
    }
  }
  
  handleResetInstr=()=>
  {
    this.props.getEditAccordian()
  }
  handleTarget = (e) => {
    this.setState({ target: e.target.value });
  }

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  closeModal = () => {
    this.setState({ showModal: false });
    this.props.getEditAccordian()
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
    const WeeklyList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
      'Saturday', 'Sunday'];
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
  renderInterEdit=()=>
  {
    return (
    (this.state.selectedBusiness.first !==null && this.state.selectedBusiness.second !==null) ?
      (
        <div style={{ width: '100%', display: 'flex',marginBottom:'2%'}}>
                  <div className="card accountCard1" style={{width:'40%',background:'#00864f',marginRight:'11%'}}>
                    <div className="card-body secondAccordionMain">
                      <div style={{ width: '50%' }}>
                        <p className="accountName" style={{ marginBottom: '5px',color:'white' }}>{this.state.selectedBusiness.first.business}</p>
                        <p style={{ fontSize: '20px',color:'white' }}>{this.manipulateAccountNumber(this.state.selectedBusiness.first.accountNumber)}</p>
                      </div>
                      <div style={{ width: '50%' }}>
                        <p className="availableBalanceDisplay">₤ {this.numberWithCommas(this.state.selectedBusiness.first.availableBalance)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="card accountCard1" style={{width:'40%',background:'rgb(102,152,12)',marginRight:'2%'}}>
                    <div className="card-body secondAccordionMain">
                      <div style={{ width: '50%' }}>
                        <p className="accountName" style={{ marginBottom: '5px',color:'white' }}>{this.state.selectedBusiness.second.business}</p>
                        <p style={{ fontSize: '20px' ,color:'white'}}>{this.manipulateAccountNumber(this.state.selectedBusiness.second.accountNumber)}</p>
                      </div>
                      <div style={{ width: '50%' }}>
                        <p className="availableBalanceDisplay">₤ {this.numberWithCommas(this.state.selectedBusiness.second.availableBalance)}</p>
                      </div>
                    </div>
                  </div>
            </div>

      ):(null)
    )
  }
  renderIntraEdit=()=>
  {
    {
      return (
      (this.state.selectedAccount.first !==null && this.state.selectedAccount.second !==null) ?
        (
          <div style={{ width: '100%', display: 'flex',marginBottom:'2%'}}>
                    <div className="card accountCard1" style={{width:'40%',background:'#00864f',marginRight:'11%'}}>
                      <div className="card-body secondAccordionMain">
                        <div style={{ width: '50%' }}>
                          <p className="accountName" style={{ marginBottom: '5px',color:'white' }}>{this.state.selectedAccount.first.accountName}</p>
                          <p style={{ fontSize: '20px',color:'white' }}>{this.manipulateAccountNumber(this.state.selectedAccount.first.accountNumber)}</p>
                        </div>
                        <div style={{ width: '50%' }}>
                          <p className="availableBalanceDisplay">₤ {this.numberWithCommas(this.state.selectedAccount.first.availableBalance)}</p>
                        </div>
                      </div>
                    </div>
  
                    <div className="card accountCard1" style={{width:'40%',background:'rgb(102,152,12)',marginRight:'2%'}}>
                      <div className="card-body secondAccordionMain">
                        <div style={{ width: '50%' }}>
                          <p className="accountName" style={{ marginBottom: '5px',color:'white' }}>{this.state.selectedAccount.second.accountName}</p>
                          <p style={{ fontSize: '20px' ,color:'white'}}>{this.manipulateAccountNumber(this.state.selectedAccount.second.accountNumber)}</p>
                        </div>
                        <div style={{ width: '50%' }}>
                          <p className="availableBalanceDisplay">₤ {this.numberWithCommas(this.state.selectedAccount.second.availableBalance)}</p>
                        </div>
                      </div>
                    </div>
              </div>
  
        ):(null)
      )
    }
  }
  render() {
    if (this.state.accSumary && this.state.businessSavingsAccounts!==undefined) {
      return (
        <div style={{ width: '100%' }}>
          <div style={{ margin: '1.5% 0' }}>
            {this.props.type==="inter"?
            <p className='My-financials'>Edit instruction</p>:
            <p className='My-financials'>Edit instruction for {this.state.accSumary.business[this.props.index].name}</p>}
          </div>
          <div className="accordion" id="accordionExample">
            {this.props.type==="inter"?this.renderInterEdit():this.renderIntraEdit()}
            <div className="card accordianCard">
              <div id="col" className="cardHeader" id="headingThree" data-toggle="collapse" data-target="#collapseThree">
                <div style={{ width: '100%', color: '#00864f' }}>
                  <span><b>SET VALUES AND INSTRUCTION</b></span>
                  <span style={{ float: 'right' }}><i className='fa fa-angle-down'></i></span>
                  {/*<span className="stepsListing">(Step 2 of 2) &nbsp; &nbsp;</span>*/}
                </div>
              </div>
              <div id="collapseThree" className="collapse show" aria-labelledby="headingThree" data-parent="#accordionExample">
                <div className="card-body">
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '4%' }}>
                    <div style={{ width: '25%' }}>
                      <label htmlFor="numberIP" style={{ width: '100%' }}>Value</label>
                      <input type="number" value={this.state.target} min='0' id="numberIP" onChange={(e) => this.handleTarget(e)} style={{ border: '1px solid rgb(169, 169, 169)', padding: '2%' }} />
                    </div>
                    <div style={{ width: '25%' }}>
                      <label htmlFor="instType" style={{ width: '100%' }}>Instruction Type</label>
                      <select style={{ borderRadius: '5px', width: '75%' }} id="instType" name="Instruction Type">
                        <option>Target Balance</option>
                        <option>Percentage</option>
                        <option>Fixed Amount</option>
                      </select>
                    </div>
                    <div style={{ width: '25%' }}>
                      <label htmlFor="execMode" style={{ width: '100%' }}>Execution Mode</label>
                      <select onChange={(e) => this.handleExecMode(e)}  style={{ borderRadius: '5px', width: '75%' }} id="execMode" name="Execution Mode">
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
                      <button className="greenBtn addInst_addBtn" onClick={this.handleEditInstr}>
                        <span>SAVE</span>
                      </button>
                      <button className="greenBtn addInst_resetBtn" onClick={this.handleResetInstr}>
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
                  <h1 style={{ color: 'white' }}>Instruction edited!</h1>
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