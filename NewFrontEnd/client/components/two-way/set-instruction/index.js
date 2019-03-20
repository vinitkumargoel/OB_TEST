import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import { Button, Icon, Modal, Radio } from 'semantic-ui-react'
import Header from '../../headernew'
import Sidebar from '../../sidebar'
import Services from '../../../services'
import 'bootstrap/dist/css/bootstrap.min.css';
import InstructionModal from '../../history/instExeModal/index';
import History from '../../history/index';

export default class TwoWay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setInstructionTabActive: true,
      historyTabActive: false,
      showHistory: false,
      instExeModalOpen: false,
      modalOpen: true,
      accSumary: {},
      value: '',
      input: '',
      instructionData: null,
      instructionSelected: [],
      popupFlag: false,
      dropDownAccountData: [],
      newInstruction: {
        controlBankAccountNumber: "none", controlBusinessName: "", forceDebitControlAccount: false, contraBankAccountNumber: "none"
        , contraBusinessName: "", forceDebitContraAccount: false, target: "", instructionType: "Target Balance", executionMode: "Manual",
        reversal: false
      },
      accountInfos: [],
      availableBalance: { controlBankAccountBalance: "", contraBankAccountBalance: "" }
    }
  }
  componentDidMount() {
    var token = sessionStorage.getItem("token");
    Services.commercialDebitCall(token, function (data) {
      let accountNumbers = this.dropdownList(data["business"]);
      this.setState({ dropDownAccountData: accountNumbers });
      console.log(accountNumbers)
      console.log(data)
    }.bind(this), function (err) {
      // console.log(err);
    })

    Services.instructionCall(token, function (data) {
      // data=JSON.parse(data);
      let instList = []
      this.setState({ instructionData: data })
      data.currentInstructions.map(instruction => {
        const instructionSelected = {};
        let id = instruction.instructionId;
        instructionSelected.instructionId = id
        instructionSelected.selected = false
        instList.push(instructionSelected)
      })
      this.setState({ instructionSelected: instList })
      console.log("data-instructions", this.state.instructionData)
      console.log("selected", this.state.instructionSelected)
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
    let accountInfos = []
    businesses.map((business, index) => {
      business["accounts"].map((account, i) => {
        let accountInfo = {}
        accountInfo.accountNumber = account["accountNumber"]
        accountInfo.availableBalance = account["availableBalance"]
        accountInfo.business = business["name"]
        accountNumbers.push(account["accountNumber"])
        accountInfos.push(accountInfo)
      })
    })
    this.setState({ accountInfos: accountInfos }, () => console.log(this.state.accountInfos))
    // console.log(data, typeof (data));
    return accountNumbers;
  }
  loadAvailableBalance(accountNumber) {

  }
  changeSetInstructionValues = (event) => {
    const { name, type } = event.target
    let data = ""
    type === "checkbox" ? data = event.target.checked : data = event.target.value
    const instruction = {}
    Object.assign(instruction, this.state.newInstruction)
    if (name === "controlBankAccountNumber" || name === "contraBankAccountNumber") {
      let requiredAccountNumAndBalance = this.state.accountInfos.filter(
        accountInfo =>
          accountInfo.accountNumber === event.target.value)
      let availableBalance = {}
      let bankAccountBalance = parseInt(requiredAccountNumAndBalance[0].availableBalance).toLocaleString()
      Object.assign(availableBalance, this.state.availableBalance)
      name === "controlBankAccountNumber" ? availableBalance.controlBankAccountBalance = bankAccountBalance :
        availableBalance.contraBankAccountBalance = bankAccountBalance
      this.setState({ availableBalance: availableBalance })
    }

    if (name === "target") {
      let regExTarget = new RegExp("^[0-9]*[.]?[0-9]{0,3}?$")
      if (!regExTarget.test(data)) {
        let target = this.state.newInstruction.target
        instruction[name] = target
      }
      else {
        instruction[name] = data
      }
    }
    else {
      instruction[name] = data
    }
    console.log(instruction)
    this.setState({
      newInstruction: instruction
    })
  }
  changeInstructionSelection = (index, event) => {
    const updatedInstructionSelected = [...this.state.instructionSelected]
    const instruction = updatedInstructionSelected[index]
    instruction.selected = event.target.checked
    this.setState({ instructionSelected: updatedInstructionSelected })
  }
  addInstruction = () => {
    let instruction = {}
    Object.assign(instruction, this.state.newInstruction)
    this.state.accountInfos.map(accountInfo => {
      if (instruction.controlBankAccountNumber === accountInfo.accountNumber) {
        instruction.controlBusinessName = accountInfo.business
      }
      if (instruction.contraBankAccountNumber === accountInfo.accountNumber) {
        instruction.contraBusinessName = accountInfo.business
      }
    })
    if (instruction.controlBankAccountNumber === "none" || instruction.contraBankAccountNumber === "none" || instruction.target === "") {
      this.setState({ showModal: false })
      alert("Please fill the required fields")
    }
    else {
      this.setState({ showModal: true })
      console.log(instruction)
      this.submitInstruction(instruction)
    }
  }
  resetAddNewInstruction = () => {
    let instruction = {
      controlBankAccountNumber: "none", controlBusinessName: "", forceDebitControlAccount: false, contraBankAccountNumber: "none"
      , contraBusinessName: "", forceDebitContraAccount: false, target: "", instructionType: "Target Balance", executionMode: "Manual",
      reversal: false
    }
    console.log(instruction)
    let availableBalance = { controlBankAccountBalance: "", contraBankAccountBalance: "" }
    this.setState({ newInstruction: instruction })
    this.setState({ availableBalance: availableBalance })
  }
  submitInstruction = (instruction) => {
    var token = sessionStorage.getItem("token");
    let query = {
      token: token,
      data: instruction
    }

    Services.submitInstruction(query, function (data) {
      this.refresh();
    }.bind(this))

  }
  executeInstructions = () => {
    let accountList = []
    this.state.instructionSelected.filter(instruction => instruction.selected === true).map(instruction => {
      accountList.push(instruction.instructionId.toString())
    })
    let data = {}
    data.accountList = accountList;
    accountList.length !== 0 ? this.execute(data) : alert("Please select an instruction")
  }

  onPreviousClick = () => {
    this.setState({
      value: ''
    })
  }

  handleOk(evt) {
    // alert('OK');
    evt.preventDefault()
    this.closeModal();
  }

  closeModal = () => {
    this.setState({ showModal: false })
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
      this.setState({ instructionData: data })
      let addedInstruction = data.currentInstructions[data.currentInstructions.length - 1]
      let id = addedInstruction.instructionId
      this.setState(prevState => ({
        instructionSelected: [...prevState.instructionSelected, { instructionId: id, selected: false }]
      }))
      // console.log(data)
    }.bind(this), function (err) {
      // console.log(err);
    })
  }

  setTarget = (e) => {
    this.handleChange(e, true);
    this.setState({ target: e.target.value });
  }
  selectAllInstructionsHandler = (event) => {
    let instructionSelected = [...this.state.instructionSelected]
    if (event.target.checked === true) {
      instructionSelected.map(instruction => {
        instruction.selected = true;
      })
    }
    else {
      instructionSelected.map(instruction => {
        instruction.selected = false;
      })
    }
    this.setState({ instructionSelected: instructionSelected })
  }

  execute = (data) => {
    var token = sessionStorage.getItem("token");
    let query = {
      token: token,
      data: data
    }

    Services.transact(query, response => {
      if (response.success) {
        this.setState({ showModal: true });
      } else if (!response.success) {
        this.setState({ instExeModalOpen: true });
      }
    });
  }

  popup = () => {
    console.log("okay");
    this.setState({ popupFlag: true });
  }
  toggleModal = () => {
    this.setState({ popupFlag: !this.state.popupFlag });
  }

  handleInstExeModalOpen = () => {
    this.setState({ instExeModalOpen: true });
  }

  handleInstExeModalClose = () => {
    this.setState({ instExeModalOpen: false });
  }

  handleViewEventInstExeModal = () => {
    this.handleInstExeModalClose();

    this.setState({ showHistory: true });
  }

  openModal = () => {
    this.setState({ instExeModalOpen: true });
  }

  renderScreen() {
    if (this.state.showHistory) {
      return <History></History>
    }
    else {
      return (
        <div>
          <div className='addInstr'>
            {/* <div className="ui segment active tab">
        <button className='colorbtn2'>ADD NEW INSTRUCTION</button>
      </div> */}
            <div>
              <h3 className='heading2'>Add new instruction</h3>
            </div>
            <div className='optimizingsModal'>
              <Link to='/commercialOptimizations'>
              </Link>
              <div className="container">

                <div className='row'>
                  <div className='col-sm-3' style={{ marginLeft: '-280px' }}>
                    <label className="accounts"> Control account</label>
                    <select name="controlBankAccountNumber" className="dropdown"
                      style={{ width: '310px', height: '40px', border: 'solid 1px #d1d1d1', backgroundColor: 'rgba(196, 198, 205, 0.08)' }}
                      onChange={this.changeSetInstructionValues} value={this.state.newInstruction.controlBankAccountNumber} placeholder="Select a control account">
                      <option value="none" >----Select an Account------</option>
                      {this.state.dropDownAccountData.map((accountNumber, index) => {
                        return (<option value={accountNumber} key={index}>{accountNumber}</option>);
                      })}
                    </select>
                    <div style={{ width: '175px' }}>
                      <label className='availBal'>Available balance: {this.state.availableBalance.controlBankAccountBalance} </label></div>

                  </div>
                  <div className='col-sm-3 ui checkbox chkBoxDebit' style={{ marginLeft: '180px', marginTop: '47px' }} >

                    <input name="forceDebitControlAccount" onChange={this.changeSetInstructionValues} type="checkbox" style={{ backgroundColor: '#00864f' }} checked={this.state.newInstruction.forceDebitControlAccount} disabled />
                    <label>Force debit</label>

                  </div>
                  <div className='col-sm-3 contraAcc' >
                    <label className="accounts">Contra account</label>

                    <select name="contraBankAccountNumber" className="dropdown"
                      style={{ width: '310px', height: '40px', border: 'solid 1px #d1d1d1', backgroundColor: 'rgba(196, 198, 205, 0.08)' }}
                      onChange={this.changeSetInstructionValues} value={this.state.newInstruction.contraBankAccountNumber} placeholder="Select a contra account">
                      <option value="none" >----Select an Account------</option> */}
            {this.state.dropDownAccountData.map((accountNumber, index) => {
                        return (<option value={accountNumber} key={index}>{accountNumber}</option>);
                      })}
                    </select>
                    <div style={{ width: '200px' }}>
                      <label className='availBal'>Available balance: {this.state.availableBalance.contraBankAccountBalance}</label></div>

                  </div>
                  <div className='col-sm-3 ui checkbox' style={{ marginLeft: '645px', marginTop: '-57px' }}>
                    <input name="forceDebitContraAccount" onChange={this.changeSetInstructionValues} type="checkbox" style={{ backgroundColor: '#00864f' }} checked={this.state.newInstruction.forceDebitContraAccount} disabled />
                    <label>Force debit</label>
                  </div>
                  <div className="col-sm-3 ui form " style={{ marginTop: '60px', marginLeft: '-280px' }}>
                    <div className="field">
                      <label style={{ color: '#00864f', width: '200px' }}>VALUE</label>
                      <input name="target" onChange={this.changeSetInstructionValues} type="text" style={{ width: '200px', height: '40px', border: 'solid 1px #d1d1d1', backgroundColor: 'rgba(196, 198, 205, 0.08)' }}
                        placeholder="0.000" value={this.state.newInstruction.target} />
                    </div>
                  </div>
                  <div className='col-sm-5' style={{ marginLeft: '92px', marginTop: '60px', width: '175px' }}>
                    <label style={{ color: '#00864f', width: '132px', height: '19px' }}>INSTRUCTION TYPE</label>
                    <select name="instructionType" className="dropdown" style={{ width: '250px' }} placeholder="Select an instruction type"
                      onChange={this.changeSetInstructionValues} value={this.state.newInstruction.instructionType}>
                      <option value="none" >Target balance</option>
                    </select>
                  </div>
                  <div className='col-sm-3' style={{ marginLeft: '456px', marginTop: '-67px' }}>

                    <label style={{ color: '#00864f', width: '129px', height: '19px' }}>
                      EXECUTION MODE
            </label>
                    <select name="executionMode" className="dropdown" style={{ width: '250px' }} placeholder="Select an execution mode"
                      onChange={this.changeSetInstructionValues} value={this.state.newInstruction.executionMode}>
                      <option value="none" >Manual</option>
                    </select>

                  </div>
                </div>
                <div style={{ marginTop: '82px', marginLeft: '209px' }}>
                  <div className="ui grid">
                    <div className="four wide column"> <div className='ui checkbox revsl' style={{ marginLeft: '-490px' }}>

                      <input name="reversal" type="checkbox" onChange={this.changeSetInstructionValues} checked={this.state.newInstruction.reversal} disabled />
                      <label>Reversal</label>
                    </div></div>
                    <div className="four wide column"> <button className="ui secondary basic button" style={{ width: '139px', marginLeft: '-34px', height: '42px', border: 'solid 1px #979797' }}>CANCEL</button></div>
                    <div className="four wide column">
                      <button onClick={this.resetAddNewInstruction} className="ui secondary basic button" style={{ width: '139px', height: '42px', marginLeft: '30px', border: 'solid 1px #979797' }}>RESET</button></div>
                    <div className="four wide column">
                      {/* <button className="colorbtn" onClick={this.addInstruction}>ADD</button></div> */}
                      <Modal className='modalCon' open={this.state.showModal} onClose={this.closeModal} trigger={<button className="colorbtn" onClick={this.addInstruction}>ADD</button>} basic size='small' >
                        {/* () => this.setState({ showModal: true })} */}
                        <div className='modalAdd' style={{ backgroundImage: 'url(images/Added1.png)', backgroundSize: 'cover' }}>

                          <Modal.Content>
                            <div className='headStyle'>
                              <h1>
                                Instruction added!
                              </h1>
                            </div>
                          </Modal.Content>
                          <Modal.Actions className='okBtn'>

                            <Button color='green' className='btn2' onClick={(evt) => this.handleOk(evt)}>
                              OK
                            </Button>
                          </Modal.Actions>
                        </div>
                      </Modal>
                    </div>
                    {/* <div className="four wide column"> <button className="colorbtn" onClick={this.popup}>ADD</button></div> */}
                  </div>

                </div>
              </div>
            </div>
          </div>


          <React.Fragment>
            <div>
              <h2 className='curr_instruction'>Current instructions</h2>
            </div>
            <div className="tableContainer tablCntr">
              <table className="ui striped table table_heading">
                <thead>
                  <tr className="currentInstruction">
                    <th>

                      <input onChange={this.selectAllInstructionsHandler} type="checkbox" />

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
                  {this.state.instructionData !== null && this.state.instructionSelected.length !== 0 && this.state.instructionSelected.length === this.state.instructionData.currentInstructions.length ? this.state.instructionData.currentInstructions.map((instruction, index) =>
                    <tr>
                      <td>
                        <input onChange={this.changeInstructionSelection.bind(this, index)} type="checkbox" checked={this.state.instructionSelected[index].selected} />
                      </td>
                      <td>{instruction.controlBankAccountNumber}</td>
                      <td>{instruction.contraBankAccountNumber}</td>
                      <td>{instruction.target}</td>
                      <td>{instruction.instructionType}</td>
                      <td>{instruction.priorityId}</td>
                      <td>{instruction.executionMode}</td>
                      <td>No</td>
                      <td><img src={'images/ic-edit-copy-7.png'} onClick={this.handleOk} /></td>
                      <td className='delete1'><img src={'images/ic-delete-copy-7.png'} onClick={this.handleOk} /></td>

                      <td><img src={'images/ic-reorder.png'} onClick={this.handleOk} /></td>
                      {/* style ={{marginTop: '10px !important',marginLeft: '-16px !important'}} */}
                    </tr>
                  ) : ""}


                </tbody>
              </table>

            </div>

          </React.Fragment>

          <div style={{ width: '100%' }}>
            <button className="executeBtn" onClick={this.executeInstructions}>EXECUTE SELECTED<Icon name="arrow right icon" style={{ marginLeft: '15px' }}></Icon></button>
          </div>

          <InstructionModal open={this.state.instExeModalOpen}
            onOpen={this.handleInstExeModalOpen} onClose={this.handleInstExeModalClose} handleView={this.handleViewEventInstExeModal}
          ></InstructionModal>
        </div>
      )
    }
  }

  showHistory = () => {
    this.setState({ setInstructionTabActive: false, historyTabActive: true })
    this.setState({ showHistory: true });
  }

  showInstruction = () => {
    this.setState({ setInstructionTabActive: true, historyTabActive: false })
    this.setState({ showHistory: false });
  }

  setActiveClass = (value) => {
    if (value) {
      return "active tab1";
    }

    return "tab1";
  }

  render() {
    return (
      <div className='container-fluid contnr1' >
        <Header username={this.state.accSumary.username} history={this.props.history} />
        <div style={{ display: "flex" }}>
          <Sidebar activeComponent="wallet" />
          <div className='main-content' style={{ backgroundColor: "#f5f6fa", width: "90%", paddingBottom: '20px' }}>
            <div>
              <div className="ui pointing secondary menu">
                <a className={this.setActiveClass(this.state.setInstructionTabActive)} onClick={this.showInstruction}><b>SET INSTRUCTIONS</b></a>
                <a className={this.setActiveClass(this.state.historyTabActive)} onClick={this.showHistory}><b>HISTORY</b></a>
              </div>
              {this.renderScreen()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}