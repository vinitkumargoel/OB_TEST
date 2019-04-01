import React from 'react';
import './style.css';
import { Icon } from 'semantic-ui-react'
import Header from '../../headernew'
import Sidebar from '../../sidebar'
import Services from '../../../services'
import 'bootstrap/dist/css/bootstrap.min.css';
import InstructionModal from '../../history/instExeModal/index';
import History from '../../history/index';
import Accordian from '../../accordians/index';
import images from '../../accountDetails/config';
import ConfirmationModal from '../confirmationModal/index';
import Cards from '../../cards'


export default class TwoWay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBusiness: 0,
      displayInstructions: null,
      exectionInstructionStatus: '',
      setInstructionTabActive: true,
      historyTabActive: false,
      showHistory: false,
      instExeModalOpen: false,
      confirmationModalOpen: false,
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
      availableBalance: { controlBankAccountBalance: "", contraBankAccountBalance: "" },
      showAccordians: false,
      allInstructionForOneBusiness: [],
      accountListData: {},
      predictionData: null
    }
  }
  componentDidMount() {
    var token = sessionStorage.getItem("token");

    Services.commercialDebitCall(token, function (data) {
      let accountNumbers = this.dropdownList(data["business"]);
      this.setState({ dropDownAccountData: accountNumbers, accSumary: data });
      console.log(accountNumbers)
      console.log(data)
    }.bind(this), function (err) {
      // console.log(err);
    })

    // //Sample call for prediction API built by Sathish
    // let instructionData = {
    //   accountList: [
    //     "100001",
    //     "100002"
    //   ],
    //   businessName: "CAFE WILSON"
    // };
    // let someData = {
    //   token: token,
    //   data: instructionData
    // };
    // Services.prediction(someData, function (data) {
    //   console.log(data);
    // })

    Services.instructionCall(token, function (data) {
      // data=JSON.parse(data);
      let instList = []
      let intraBusinessDataInstructions = data.currentInstructions.filter(instruction => instruction.controlBusinessName === instruction.contraBusinessName)
      let intraBusinessData = {}
      intraBusinessData.currentInstructions = intraBusinessDataInstructions
      this.setState({ instructionData: intraBusinessData })
      intraBusinessData.currentInstructions.map(instruction => {
        const instructionSelected = {};
        let id = instruction.instructionId;
        instructionSelected.instructionId = id
        instructionSelected.selected = false
        instructionSelected.business = instruction.controlBusinessName
        instList.push(instructionSelected)
      })
      this.setState({ instructionSelected: instList })
      console.log("data-instructions", this.state.instructionData)
      console.log("selected", this.state.instructionSelected)
    }.bind(this), function (err) {
      // console.log(err);
    })
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
    let allInstructionForOneBusiness = []
    businesses.map((business, index) => {
      let allInstructionForOneBusinessValue = {}
      allInstructionForOneBusinessValue.business = business["name"]
      allInstructionForOneBusinessValue.selected = false
      business["accounts"].map((account, i) => {
        let accountInfo = {}
        accountInfo.accountNumber = account["accountNumber"]
        accountInfo.availableBalance = account["availableBalance"]
        accountInfo.business = business["name"]
        accountNumbers.push(account["accountNumber"])
        accountInfos.push(accountInfo)
      })
      allInstructionForOneBusiness.push(allInstructionForOneBusinessValue)
    })
    this.setState({ accountInfos: accountInfos }, () => console.log(this.state.accountInfos))
    this.setState({ allInstructionForOneBusiness: allInstructionForOneBusiness })
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
  // changeInstructionSelection = (index, event) => {
  //   const updatedInstructionSelected = [...this.state.instructionSelected]
  //   const instruction = updatedInstructionSelected[index]
  //   instruction.selected = event.target.checked
  //   this.setState({ instructionSelected: updatedInstructionSelected })
  // }

  changeInstructionSelection = (id, event) => {
    const updatedInstructionSelected = [...this.state.instructionSelected]
    let selectedInstr = updatedInstructionSelected.filter((value) => value.instructionId === id);
    selectedInstr[0].selected = event.target.checked
    this.setState({ instructionSelected: updatedInstructionSelected })
    this.confirmationFunction();
    console.log(selectedInstr, id);

  }
  selectedInstruction = (id) => {
    const updatedInstructionSelected = [...this.state.instructionSelected]
    let selectedInstr = updatedInstructionSelected.filter((value) => value.instructionId === id);
    console.log(selectedInstr.selected)
    return selectedInstr[0].selected
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
    this.setState({ showModal: true })
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
    this.setState({ confirmationModalOpen: false });

    let accountList = []
    this.state.instructionSelected.filter(instruction => instruction.selected === true).map(instruction => {
      accountList.push(instruction.instructionId.toString())
    })
    let data = {}
    data.accountList = accountList;

    return data;
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
      let intraBusinessDataInstructions = data.currentInstructions.filter(instruction => instruction.controlBusinessName === instruction.contraBusinessName)
      let intraBusinessData = {}
      intraBusinessData.currentInstructions = intraBusinessDataInstructions
      this.setState({ instructionData: intraBusinessData })
      let addedInstruction = intraBusinessData.currentInstructions[intraBusinessData.currentInstructions.length - 1]
      let id = addedInstruction.instructionId
      let business = addedInstruction.controlBusinessName
      this.setState(prevState => ({
        instructionSelected: [...prevState.instructionSelected, { instructionId: id, selected: false, business: business }]
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
        if (instruction.business === this.state.accSumary.business[this.state.selectedBusiness].name)
          instruction.selected = true;
      })
    }
    else {
      instructionSelected.map(instruction => {
        if (instruction.business === this.state.accSumary.business[this.state.selectedBusiness].name)
          instruction.selected = false;
      })
    }
    let allInstructionForOneBusiness = [...this.state.allInstructionForOneBusiness]
    let selectedBusinessInstructions = allInstructionForOneBusiness
      .filter(instruction => instruction.business === this.state.accSumary.business[this.state.selectedBusiness].name)
    console.log(selectedBusinessInstructions)
    selectedBusinessInstructions[0].selected = event.target.checked
    this.setState({ allInstructionForOneBusiness: allInstructionForOneBusiness })
    this.setState({ instructionSelected: instructionSelected })
    this.confirmationFunction();
  }

  execute = () => {
    this.setState({ confirmationModalOpen: false,predictionData:null });


    var token = sessionStorage.getItem("token");
    let query = {
      token: token,
      data: this.state.accountListData
    }

    Services.transact(query, response => {
      if (response.success === 'true') {
        this.setState({ exectionInstructionStatus: 'success', instExeModalOpen: true });
      } else if (response.success === 'false') {
        this.setState({ exectionInstructionStatus: 'fail', instExeModalOpen: true });
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
    this.props.history.replace('/homeCommercial');
  }

  handleViewEventInstExeModal = () => {
    this.setState({ instExeModalOpen: false });
    this.showHistory();
  }

  handleExecuteMoreEvent = () => {
    this.setState({ instExeModalOpen: false });
  }

  openModal = () => {
    this.setState({ instExeModalOpen: true });
  }

  getAccordian = () => {
      this.setState({ showAccordians: !this.state.showAccordians })

  }

  getButtons = () => {
    return (this.state.accSumary.business.map((value, index) => {
      return (
        <div className={this.handleChange(null)} onClick={() => this.handleChange(index)} key={index} id={index}>
          <div className="company-card-button " value={index} >
            <div className="icons" ><img src={images.Icons[index]} alt="icon" />  </div>
            <div>
              <div><b>{value.name}</b></div>
              <div>{value.address}</div>
              <div><b style={{ color: 'grey' }}>Contact</b>:{value.contactNumber}</div>
            </div>
          </div>
        </div>
      )
    }))
  }

  handleButtonChange = (index) => {
    
    if (index === null) {
      return 'col accordianSmallCard';
    } else {
      this.setState({ selectedBusiness: index });
      let allBoxes = document.getElementsByClassName('col accordianSmallCard');
      for(let i in allBoxes) {
        if(i < 3) {
          if(i == index) {
            allBoxes[i].style.border = 'solid 2px green';
          }
          else {
            allBoxes[i].style.border = '1px solid lightgrey';
          }
        }
      }
      // return 'col accordianSmallCard accordianSmallCardActive';
    }
  }
  selectAllForOneBusinessCheck = (business) => {
    let selectedBusinessInstructions = this.state.allInstructionForOneBusiness
      .filter(instruction => instruction.business === business)
    return selectedBusinessInstructions[0].selected
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

  renderScreen() {
    if (this.state.showHistory) {
      return <History type="intra"></History>
    }
    else {
      return (
        <div>
          {!this.state.showAccordians  && this.state.accSumary.business !== undefined ? (
            <div>
              {/* <div><img style={{ cursor: 'pointer' }} src='../../../../images/addInstruction/add_new_btn.png' onClick={this.getAccordian} /></div> */}
              <div className="accordion" id="accordionExample">
                <div className="card accordianCard">
                  <div className="cardHeader" id="headingOne" data-toggle="collapse" data-target="#collapseOne">
                    <div style={{ width: '100%', color: '#00864f' }}>
                      <span><b>CHOOSE BUSINESS</b></span>
                      <span style={{ float: 'right' }}><i className='fa fa-angle-down'></i></span>
                    </div>
                  </div>
                  <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                    <div style={{ padding: '0 2% 3% 2%' }}>
                      <div>
                        <div className="accordianCardBody row" style={{ display: 'flex', width: '100%', margin: '0' }}>
                          {this.state.accSumary.business.map((value, index) => {
                            return (
                              <div className={this.handleButtonChange(null)} onClick={() => this.handleButtonChange(index)} key={index} id={index}>
                                <div className="company-card-button " value={index} >
                                  <div className="icons" ><img src={images.Icons[index]} alt="icon" />  </div>
                                  <div>
                                    <div><b>{value.name}</b></div>
                                    <div>{value.address}</div>
                                    <div><b style={{ color: 'grey' }}>Contact</b>:{value.contactNumber}</div>
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
              </div>
              <button className="greenBtn addNewInstBtn" onClick={this.getAccordian}>
                <span>ADD NEW INSTRUCTIONS</span>
              </button>      </div>) :
            (<Accordian refresh={this.refresh} getAccordian={this.getAccordian} index={this.state.selectedBusiness}  />)}
            
            {this.state.accSumary.business !== undefined && this.state.predictionData !== null ? 
            (<div>
              <div><p className='My-financials'>Account Status</p></div>
              <br/>
              <div style={{display:'flex'}}>
              <div style={{width :'40%'}}>
              <h6><b>Current Balance</b></h6>
              
              <Cards accounts= {this.state.accSumary.business[this.state.selectedBusiness].accounts}/>
              </div>
              <div style={{width :'40%',    marginLeft: '7%'}}>
              <h6><b>Post Execution Balance</b></h6>
              <Cards accounts= {this.state.predictionData.accountDetails}/>
              </div>
              </div>
              </div>
            ):
            (null)}

          {this.state.accSumary.business !== undefined && this.state.selectedBusiness !== null ?
            (<React.Fragment>
              <div>
                <div style={{ margin: '1.5% 0' }}>
                  <p className='My-financials'>Current instructions</p>
                </div>
                <table className="ui striped table">
                  <thead>
                    <tr className="currentInstruction">
                      <th>
                        <input onChange={this.selectAllInstructionsHandler} type="checkbox" checked={this.selectAllForOneBusinessCheck(this.state.accSumary.business[this.state.selectedBusiness].name)} />
                      </th>
                      <th>Control A/C</th>
                      <th>Contra A/C </th>
                      <th>Instruction type</th>
                      <th>Value </th>
                      <th>Priority</th>
                      <th>Execution mode</th>
                      <th>Reversal</th>
                      <th>Actions</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.instructionData !== null && this.state.instructionSelected.length !== 0 && this.state.instructionSelected.length === this.state.instructionData.currentInstructions.length ? this.state.instructionData.currentInstructions.filter(instr => instr.controlBusinessName === this.state.accSumary.business[this.state.selectedBusiness].name).map((instruction, index) =>
                      <tr key={instruction.executionId} className="currentInstruction">
                        <td>
                          <input onChange={this.changeInstructionSelection.bind(this, instruction.instructionId)} type="checkbox" checked={this.selectedInstruction(instruction.instructionId)} />
                        </td>
                    <td>{this.manipulateAccountNumber(instruction.controlBankAccountNumber)}({instruction.controlAccountType}) </td>
                        <td>{this.manipulateAccountNumber(instruction.contraBankAccountNumber)}({instruction.contraAccountType})</td>
                        <td>{instruction.instructionType}</td>
                        <td>{instruction.target}</td>
                        <td>{instruction.priorityId}</td>
                        <td>{instruction.executionMode}</td>
                        <td>No</td>
                        <td>
                          <img src={'images/ic-edit-copy-7.png'} onClick={this.handleOk} style={{ marginRight: '20px', cursor: 'pointer' }} />
                          <img src={'images/ic-delete-copy-7.png'} onClick={this.handleOk} style={{ cursor: 'pointer' }} />
                        </td>
                        <td><img src={'images/ic-reorder.png'} onClick={this.handleOk} /></td>
                      </tr>
                    ) : ""}
                  </tbody>
                </table>
              </div>
            </React.Fragment>) : (null)}

          <div style={{ width: '100%' }}>
            <button className="greenBtn executeBtn" onClick={this.execute}>
              <span>EXECUTE</span>
              <span style={{ paddingLeft: '20px' }}>
                <i className='fa fa-arrow-right'></i>
              </span>
            </button>
          </div>

          <InstructionModal open={this.state.instExeModalOpen} status={this.state.exectionInstructionStatus}
            onOpen={this.handleInstExeModalOpen} onClose={this.handleInstExeModalClose} handleView={this.handleViewEventInstExeModal}
            handleExectuteMore={this.handleExecuteMoreEvent}
          ></InstructionModal>

          {/* {this.renderConfirmationModal()} */}
        </div>
      )
    }
  }

  renderConfirmationModal = () => {
    if (this.state.accSumary.business) {
      return <ConfirmationModal open={this.state.confirmationModalOpen} onClose={this.handleConfirmationModalClose}
        onConfirm={() => this.execute(this.state.accountListData)} businessData={this.state.accSumary.business[this.state.selectedBusiness]}
        predictionData={this.state.predictionData} businessType={'intra'}></ConfirmationModal>
    }
  }

  confirmationFunction = () => {
    let data = this.executeInstructions();
    let token = sessionStorage.getItem("token");

    if (data.accountList && data.accountList.length >= 0) {
      this.setState({ accountListData: data });

      let instructionData = {
        accountList: data.accountList,
        businessName: this.state.accSumary.business[this.state.selectedBusiness].name
      };

      let someData = {
        token: token,
        data: instructionData
      };

      Services.prediction(someData, (data) => {
        if (data.accountDetails) {
          this.setState({ predictionData: data, });
        }
        console.log("predicted change",data)
      });
    }
  }

  handleConfirmationModalClose = () => {
    this.setState({ confirmationModalOpen: false });
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
      <div className="twoWay_container">
        <Header username={this.state.accSumary.username} history={this.props.history} />

        <div className="twoWay_subContainer">
          <Sidebar activeComponent="wallet" />
          <div className="twoWay_tabContainer">
            <div className="ui pointing secondary menu">
              <a className={this.setActiveClass(this.state.setInstructionTabActive)} onClick={this.showInstruction}><b>SET INSTRUCTIONS</b></a>
              <a className={this.setActiveClass(this.state.historyTabActive)} onClick={this.showHistory}><b>HISTORY</b></a>
            </div>
            {this.renderScreen()}
          </div>
        </div>
      </div>
    );
  }
}