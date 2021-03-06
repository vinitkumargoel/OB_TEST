import React from 'react';
import './style.css';
import { Icon } from 'semantic-ui-react'
import Header from '../../headernew'
import Sidebar from '../../sidebar'
import Services from '../../../services'
import 'bootstrap/dist/css/bootstrap.min.css';
import InstructionModal from '../../history/instExeModal/index';
import DeleteConfirmationModal from '../deleteConfirmationModal/index';
import InstructionDeletedModal from'../instructionDeletedModal/index';
import History from '../../history/index';
import Accordian from '../../accordiansInter/index';
import EditAccordian from '../editAccordian/index';
import images from '../../accountDetails/config';
import ConfirmationModal from '../confirmationModal/index';
import InterInfoCard from '../InterInfoCard/index'
export default class TwoWay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBusiness: 0,
      displayInstructions: null,
      exectionInstructionStatus: '',
      setInstructionTabActive: true,
      historyTabActive: false,
      confirmationModalOpen: false,
      showHistory: false,
      instExeModalOpen: false,
      instDelModalOpen:false,
      instDeletedModal:false,
      modalOpen: true,
      accSumary: {},
      value: '',
      input: '',
      instructionData: null,
      instructionSelected: [],
      popupFlag: false,
      dropDownAccountData: [],
      businessSavingsAccounts: [],
      newInstruction: {
        controlBankAccountNumber: "none", controlBusinessName: "", forceDebitControlAccount: false, contraBankAccountNumber: "none"
        , contraBusinessName: "", forceDebitContraAccount: false, target: "", instructionType: "Target Balance", executionMode: "Manual",
        reversal: false
      },
      accountInfos: [],
      availableBalance: { controlBankAccountBalance: "", contraBankAccountBalance: "" },
      showAccordians: false,
      showEditAccordian:false,
      allInstructionForOneBusiness: [],
      accountListData: {},
      predictionData: null,
      instructionToDelete:null,
      editInstruction:null
    }
  }
  componentDidMount() {
    var token = sessionStorage.getItem("token");

    Services.commercialDebitCall(token, function (data) {
      let businessSavingsAccounts = this.populateBusiness(data["business"]);
      this.setState({ accSumary: data });
      this.setState({ businessSavingsAccounts: businessSavingsAccounts })
      console.log(data)
      console.log("BSA", businessSavingsAccounts)
    }.bind(this), function (err) {
      // console.log(err);
    })

   

    Services.instructionCall(token, function (data) {
      // data=JSON.parse(data);
      let instList = []
      let interBusinessDataInstructions = data.currentInstructions.filter(instruction => instruction.controlBusinessName !== instruction.contraBusinessName)
      let interBusinessData = {}
      interBusinessData.currentInstructions = interBusinessDataInstructions
      this.setState({ instructionData: interBusinessData })
      interBusinessData.currentInstructions.map(instruction => {
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
  populateInstructionData= (data) =>
  {
    let instList = []
      let interBusinessDataInstructions = data.currentInstructions.filter(instruction => instruction.controlBusinessName !== instruction.contraBusinessName)
      let interBusinessData = {}
      interBusinessData.currentInstructions = interBusinessDataInstructions
      this.setState({ instructionData: interBusinessData })
      interBusinessData.currentInstructions.map(instruction => {
        const instructionSelected = {};
        let id = instruction.instructionId;
        instructionSelected.instructionId = id
        instructionSelected.selected = false
        instructionSelected.business = instruction.controlBusinessName
        instList.push(instructionSelected)
      })
      this.setState({ instructionSelected: instList })
  }

  handleChange = (e, { value }) => this.setState({ value })
  onCancelClick = () => {
    this.setState({
      value: ''
    })
  }

  populateBusiness = (businesses) => {
    let businessSavingsAccounts = []
    businesses.map((business, index) => {
      let flag = false;
      let businessSavingsAccount = {}
      businessSavingsAccount.business = business["name"]
      business["accounts"].map((account, i) => {
        if (account["accountName"] === "Business Saving Account") {
          businessSavingsAccount.availableBalance = account["availableBalance"]
          businessSavingsAccount.accountNumber = account["accountNumber"]
          flag = true
        }
      })
      if (flag === true)
        businessSavingsAccounts.push(businessSavingsAccount)
    })
    // console.log(data, typeof (data));
    return businessSavingsAccounts;
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
      this.refresh("add");
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

  refresh = (task) => {
    var token = sessionStorage.getItem("token");
    Services.instructionCall(token, function (data) {
      // data=JSON.parse(data);
      let interBusinessDataInstructions = data.currentInstructions.filter(instruction => instruction.controlBusinessName !== instruction.contraBusinessName)
      let interBusinessData = {}
      interBusinessData.currentInstructions = interBusinessDataInstructions
      this.setState({ instructionData: interBusinessData })
      let addedInstruction = interBusinessData.currentInstructions[interBusinessData.currentInstructions.length - 1]
      let id = addedInstruction.instructionId
      let business = addedInstruction.controlBusinessName
      if(task==="add")
      {
      this.setState(prevState => ({
        instructionSelected: [...prevState.instructionSelected, { instructionId: id, selected: false, business: business }]
      }))
      }
      console.log("inter",interBusinessData,"selectedInter",this.state.instructionSelected)
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
  handleInstDelModal=(instructionId,event)=>
  {
    this.setState({instructionToDelete:instructionId})
    
    this.setState({instDelModalOpen:!this.state.instDelModalOpen})
  }
  handleEditInstruction = (instruction,event)=>
  {
    this.setState({showEditAccordian:true})
    this.setState({editInstruction:instruction})
    this.setState({predictionData:null})
  }
  handleInstDeletedModal=()=>
  {
    this.setState({instDeletedModal:!this.state.instDeletedModal})
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
  handleDeleteModalEvent=()=>
  {
    //console.log("Instruction to delete",this.state.instructionToDelete);
    this.setState({instDelModalOpen:false})
    let token = sessionStorage.getItem("token")
    let query = {}
    query.instructionId = this.state.instructionToDelete
    query.token = token
    Services.deleteInstruction(query,function(data)
    {
      console.log("datafromdelete",data)
      this.populateInstructionData(data)
      
    }.bind(this))
    this.setState({instDeletedModal:true});
    this.setState({predictionData:null})
    // let instructionSelected = this.state.instructionSelected.filter(instruction=>instruction.instructionId!==this.state.instructionToDelete)
    // this.setState({instructionSelected:instructionSelected})
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
  getEditAccordian=()=>
  {
    this.setState(prevState=>({
      showEditAccordian:!prevState.showEditAccordian
    }))
    this.setState({showAccordians:false})
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

      return 'col accordianSmallCard accordianSmallCardActive';
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
    console.log(this.state.accSumary.business)
    if (this.state.showHistory) {
      return <History type="inter"></History>
    }
    else {
      return (
        <div>
          {!this.state.showEditAccordian?
          !this.state.showAccordians? (
            <div>
              <button className="greenBtn addNewInstBtn" onClick={this.getAccordian}>
                <span>ADD NEW INSTRUCTIONS</span>
              </button>      </div>) : (
              <Accordian refresh={this.refresh} getAccordian={this.getAccordian} index={this.state.selectedBusiness} />)
              :(<EditAccordian type = "inter" refresh={this.refresh} getEditAccordian={this.getEditAccordian} instruction={this.state.editInstruction} />)}
               {this.state.predictionData!==null? 
            (<div>
              <div><p className='My-financials'>Account Status</p></div>
              <br/>
              <div style={{display:'flex'}}>
              <div style={{width :'40%'}}>
              <h6><b>Current Balance</b></h6>
              
              <InterInfoCard accounts= {this.state.predictionData.preTransaction}/>
              </div>
              <div style={{width :'40%',    marginLeft: '7%'}}>
              <h6><b>Post Execution Balance</b></h6>
              <InterInfoCard accounts= {this.state.predictionData.postTransaction}/>
              </div>
              </div>
              </div>
            ):
            (null)}
          <React.Fragment>
            <div>
              <div style={{ margin: '1.5% 0' }}>
                <p className='My-financials'>Current Instructions</p>
              </div>
              <table className="ui striped table">
                <thead>
                  <tr className="currentInstruction">
                    <th>
                      <input onChange={this.selectAllInstructionsHandler} type="checkbox" />
                    </th>
                    <th>Instruction ID</th>
                    <th>Control A/C</th>
                    <th>Contra A/C </th>
                    <th>Type</th>
                    <th>Value </th>
                    <th>Priority</th>
                    <th>Execution Mode</th>
                    <th>Reversal</th>
                    <th>Actions</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.instructionData !== null && this.state.instructionSelected.length !== 0 && this.state.instructionSelected.length === this.state.instructionData.currentInstructions.length ? this.state.instructionData.currentInstructions.map((instruction, index) =>
                    <tr key={instruction.executionId} className="currentInstruction">
                      <td>
                        <input onChange={this.changeInstructionSelection.bind(this, instruction.instructionId)} type="checkbox" checked={this.selectedInstruction(instruction.instructionId)} />
                      </td>
                      <td>{instruction.instructionId}</td>
                      <td>{this.manipulateAccountNumber(instruction.controlBankAccountNumber)}</td>
                      <td>{this.manipulateAccountNumber(instruction.contraBankAccountNumber)}</td>
                      <td>{instruction.instructionType}</td>
                      <td>{instruction.target}</td>
                      <td>{instruction.priorityId}</td>
                      <td>{instruction.executionMode}</td>
                      <td>No</td>
                      <td>
                        <img src={'images/ic-edit-copy-7.png'} onClick={this.handleEditInstruction.bind(this,instruction)} style={{ marginRight: '20px', cursor: 'pointer' }} />
                        <img src={'images/ic-delete-copy-7.png'} onClick={this.handleInstDelModal.bind(this,instruction.instructionId)} style={{ cursor: 'pointer' }} />
                      </td>
                      <td><img src={'images/ic-reorder.png'} onClick={this.handleOk} /></td>
                    </tr>
                  ) : ""}
                </tbody>
              </table>
            </div>
          </React.Fragment>

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
          <DeleteConfirmationModal open={this.state.instDelModalOpen} 
            onClose={this.handleInstDelModal}
            onConfirm={this.handleDeleteModalEvent}
          ></DeleteConfirmationModal>
          <InstructionDeletedModal showModal={this.state.instDeletedModal}
          closeModal={this.handleInstDeletedModal}></InstructionDeletedModal>

          {/*this.renderConfirmationModal()*/}
        </div>
      )
    }
  }

  renderConfirmationModal = () => {
    if (this.state.accSumary.business) {
      return <ConfirmationModal open={this.state.confirmationModalOpen} onClose={this.handleConfirmationModalClose}
        onConfirm={() => this.execute(this.state.accountListData)} predictionData={this.state.predictionData} businessType={'inter'}></ConfirmationModal>
    }
  }

  confirmationFunction = () => {
    let data = this.executeInstructions();
    let token = sessionStorage.getItem("token");

    if (data.accountList && data.accountList.length > 0) {
      this.setState({ accountListData: data });

      let instructionData = {
        accountList: data.accountList
      };

      let someData = {
        token: token,
        data: instructionData
      };
      Services.preTransaction(someData, (data) => {
        if (data) {
          console.log("prediction",data)
          this.setState({ predictionData: data});
        }
      });
      
        //this.setState({predictionData:null})

    } 
    else{
      this.setState({predictionData:null})
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