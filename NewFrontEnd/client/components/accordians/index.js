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
      selectedBusiness: 0,
      selectedControlAccount: null,
      selectedContraAccount: null,
      target: 0
    }
  }
  componentWillMount() {
    var token = sessionStorage.getItem("token");
    console.log(token);
    Services.commercialDebitCall(token, function (data) {
      console.log(token);
      console.log(data);
      this.setState({ accSumary: data });
    }.bind(this));
  }

  handleChange = (index) => {
    if (index === null) {
      return 'col accordianSmallCard';
    } else {
      this.setState({ selectedBusiness: index });
      return 'col accordianSmallCard accordianSmallCardActive';
    }
  }

  handleAddInstr = () => {
    var token = sessionStorage.getItem("token");
    let data = {}
    data.controlBusinessName = this.state.accSumary.business[this.state.selectedBusiness].name;
    data.contraBusinessName = this.state.accSumary.business[this.state.selectedBusiness].name;
    data.contraBankAccountNumber = this.state.accSumary.business[this.state.selectedBusiness].accounts[this.state.selectedContraAccount].accountNumber;
    data.controlBankAccountNumber = this.state.accSumary.business[this.state.selectedBusiness].accounts[this.state.selectedControlAccount].accountNumber;
    data.target = this.state.target;
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

  handleControlAccount = (index) => {
    this.setState({ selectedControlAccount: index });
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
    if (contraAccount[index]) {
      contraAccount[index].style.opacity = 0.5;
    }
  }

  handleContraAccount = (index) => {
    this.setState({ selectedContraAccount: index });
    let contraAccount = document.getElementsByClassName('accountCard2')[index];
    contraAccount.style.background = 'rgb(102, 152, 12)';
    let pTags = contraAccount.getElementsByTagName('p');
    for (let i in pTags) {
      if (pTags[i].tagName === 'P') {
        pTags[i].style.color = 'white';
      }
    }
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    if (this.state.accSumary) {
      return (
        <div style={{ width: '100%' }}>
          <div style={{ margin: '1.5% 0' }}>
            <p className='My-financials'>Add new instruction</p>
          </div>
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
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card accordianCard">
              <div className="cardHeader" id="headingTwo" data-toggle="collapse" data-target="#collapseTwo">
                <div style={{ width: '100%', color: '#00864f' }}>
                  <span><b>ASSIGN ACCOUNTS</b></span>
                  <span style={{ float: 'right' }}><i className='fa fa-angle-down'></i></span>
                </div>
              </div>
              <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                <div className="card-body" style={{ padding: '0 2% 3% 2%' }}>
                  <div className="secondAccordionMain">
                    <div style={{ width: '50%', display: 'flex', flexWrap: 'wrap' }}>
                      <h6 style={{ width: '50%', margin: '15px', fontWeight: 'bold' }}>Select Control Account</h6>
                      <input type="checkbox" style={{ marginBottom: '20px', display: 'none' }} checked disabled id="controlCheckbox" />
                      <label htmlFor="controlCheckbox" style={{ margin: '10px', fontWeight: 'lighter' }}>
                        <img src={buttonImages.buttons[2]} />&nbsp; Force Debit
                      </label>
                      {this.state.accSumary.business[this.state.selectedBusiness].accounts.map((value, index) => {
                        return (
                          <div className="card accountCard1" key={index} onClick={() => this.handleControlAccount(index)}>
                            <div className="card-body secondAccordionMain">
                              <div style={{ width: '50%' }}>
                                <p style={{ color: '#62b34f', marginBottom: '5px' }}>{value.accountName}</p>
                                <p>{value.accountNumber}</p>
                              </div>
                              <div style={{ width: '50%' }}>
                                <p className="availableBalance">₤ {value.availableBalance}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div style={{ width: '50%', display: 'flex', flexWrap: 'wrap' }}>
                      <h6 style={{ width: '50%', margin: '15px', fontWeight: 'bold' }}>Select Contra Account</h6>
                      <input type="checkbox" style={{ marginBottom: '20px', display: 'none' }} checked disabled id="contraCheckbox" />
                      <label htmlFor="controlCheckbox" style={{ margin: '10px', fontWeight: 'lighter' }}>
                        <img src={buttonImages.buttons[2]} />&nbsp; Force Debit
                      </label>
                      {this.state.accSumary.business[this.state.selectedBusiness].accounts.map((value, index) => {
                        return (
                          <div className="card accountCard2" key={index} onClick={() => this.handleContraAccount(index)}>
                            <div className="card-body secondAccordionMain">
                              <div style={{ width: '50%' }}>
                                <p style={{ color: '#62b34f', marginBottom: '5px' }}>{value.accountName}</p>
                                <p>{value.accountNumber}</p>
                              </div>
                              <div style={{ width: '50%' }}>
                                <p className="availableBalance">₤ {value.availableBalance}</p>
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
            <div className="card accordianCard">
              <div className="cardHeader" id="headingThree" data-toggle="collapse" data-target="#collapseThree">
                <div style={{ width: '100%', color: '#00864f' }}>
                  <span><b>SET VALUES AND INSTRUCTION</b></span>
                  <span style={{ float: 'right' }}><i className='fa fa-angle-down'></i></span>
                </div>
              </div>
              <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                <div className="card-body">
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div style={{ width: '25%' }}>
                      <label htmlFor="numberIP" style={{ width: '100%' }}>Value</label>
                      <input type="number" min='0' id="numberIP" onChange={(e) => this.handleTarget(e)} />
                    </div>
                    <div style={{ width: '25%' }}>
                      <label htmlFor="instType" style={{ width: '100%' }}>Instruction Type</label>
                      <select style={{ borderRadius: '5px', width: '75%' }} id="instType" name="Instruction Type">
                        <option>Target Balance</option>
                      </select>
                    </div>
                    <div style={{ width: '25%' }}>
                      <label htmlFor="execMode" style={{ width: '100%' }}>Execution Mode</label>
                      <select style={{ borderRadius: '5px', width: '75%' }} id="execMode" name="Execution Mode">
                        <option>Manual</option>
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
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <img src={buttonImages.buttons[0]} style={{ margin: '10px 0 28px 69%' }} />
                    <img src={buttonImages.buttons[1]} onClick={this.handleAddInstr} />
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