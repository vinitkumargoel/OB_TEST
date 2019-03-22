import React from 'react';
import './style.css';
import Services from '../../services';
import images from '../accountDetails/config';
import buttonImages from './config';

export default class Accordians extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            accSumary:null,
            selectedBusiness: 0,
            selectedControlAccount: null,
            selectedContraAccount: null,
            target: 0
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

      handleChange= (index) => {
        this.setState({selectedBusiness: index});
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
          }.bind(this))
      
        
        
      }

      handleTarget = (e) => {
        this.setState({target: e.target.value});
      }

      handleControlAccount = (index) => {
        this.setState({selectedControlAccount: index});
        let controlAccount = document.getElementsByClassName('accountCard1')[index];
        controlAccount.style.background = '#00864f';
        let pTags = controlAccount.getElementsByTagName('p');
        for(let i in pTags) {
          if(pTags[i].tagName === 'P') {
            pTags[i].style.color = 'white';
          }
        }
        let contraAccount = document.getElementsByClassName('accountCard2');
        for(let i in contraAccount) {
          if(contraAccount[i].tagName === "DIV") {
            contraAccount[i].style.display = 'block';
          }
        }
        if(contraAccount[index]) {
          contraAccount[index].style.opacity = 0.5;
        }
      }

      handleContraAccount = (index) => {
        this.setState({selectedContraAccount: index});
        let contraAccount = document.getElementsByClassName('accountCard2')[index];
        contraAccount.style.background = 'rgb(102, 152, 12)';
        let pTags = contraAccount.getElementsByTagName('p');
        for(let i in pTags) {
          if(pTags[i].tagName === 'P') {
            pTags[i].style.color = 'white';
          }
        }
      }

    render(){
        if(this.state.accSumary){
        return(
            <div style={{width:'94%'}}>
                <div style={{paddingBottom:'3%',paddingLeft:'1%'}}>
                    <h2>Add new instruction</h2>
                </div>
                <div className="accordion" id="accordionExample">
  <div className="card">
    <div className="card-header" id="headingOne">
      <h5 className="mb-0">
        <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          <span style={{color:'#66980c'}} ><b>CHOOSE BUSINESS</b> </span>
        </button>
      </h5>
    </div>
    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
      <div className="card-body">
      <div>
            <div style={{display:'flex',justifyContent:'space-evenly',width:'1200px',paddingRight:'4%'}}>
                {this.state.accSumary.business.map((value,index) =>{
                    return(
                        <button className="button" onClick={()=>this.handleChange(index)} key={index} id={index}>
                        <div className="company-card-button " value={index} >
                        <div className="icons" ><img src={images.Icons[index]} alt="icon"/>  </div>
                        <div>
                            <div><b>{value.name}</b></div>
                            <div>{value.address}</div>
                            <div><b style={{color:'grey'}}>Contact</b>:{value.contactNumber}</div>
                        </div> 
                        </div></button>
                    )
                })}
            </div>
        </div>
      </div>
    </div>
  </div>
  <div className="card">
    <div className="card-header" id="headingTwo">
      <h5 className="mb-0">
        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        <span style={{color:'#66980c'}} ><b>ASSIGN ACCOUNTS </b></span>
        </button>
      </h5>
    </div>
    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
      <div className="card-body">
        <div className="secondAccordionMain">
          <div style={{width : '50%', display: 'flex', flexWrap: 'wrap'}}>
            <h6 style={{width: '50%', margin: '15px', fontWeight: 'bold'}}>Select Control Account</h6>
            <input type="checkbox" style={{marginBottom: '20px', display: 'none'}} checked disabled id="controlCheckbox"/>
            <label htmlFor="controlCheckbox" style={{margin: '10px', fontWeight: 'lighter'}}>
              <img src={buttonImages.buttons[2]} />&nbsp; Force Debit
            </label>
            {this.state.accSumary.business[this.state.selectedBusiness].accounts.map((value, index) => {
              return (
                
                <div className="card accountCard1" key={index} onClick={() => this.handleControlAccount(index)}>
                  <div className="card-body secondAccordionMain">
                    <div style={{width: '50%'}}>
                      <p style={{color: '#62b34f', marginBottom: '5px'}}>{value.accountName}</p>
                      <p>{value.accountNumber}</p>
                    </div>
                    <div style={{width: '50%'}}>
                      <p className="availableBalance">₤ {value.availableBalance}</p>
                    </div>
                  </div>
                </div>            
              )
            })}
          </div>
          <div style={{width : '50%', display: 'flex', flexWrap: 'wrap'}}>
            <h6 style={{width: '50%', margin: '15px', fontWeight: 'bold'}}>Select Contra Account</h6>
            <input type="checkbox" style={{marginBottom: '20px', display: 'none'}} checked disabled id="contraCheckbox"/>
            <label htmlFor="controlCheckbox" style={{margin: '10px', fontWeight: 'lighter'}}>
              <img src={buttonImages.buttons[2]} />&nbsp; Force Debit
            </label>
            {this.state.accSumary.business[this.state.selectedBusiness].accounts.map((value, index) => {
              return (
                <div className="card accountCard2" key={index} onClick={() => this.handleContraAccount(index)}>
                  <div className="card-body secondAccordionMain">
                    <div style={{width: '50%'}}>
                      <p style={{color: '#62b34f', marginBottom: '5px'}}>{value.accountName}</p>
                      <p>{value.accountNumber}</p>
                    </div>
                    <div style={{width: '50%'}}>
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
  <div className="card">
    <div className="card-header" id="headingThree">
      <h5 className="mb-0">
        <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        <span style={{color:'#66980c'}} ><b>SET VALUES AND INSTRUCTION</b></span>
        </button>
      </h5>
    </div>
    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
      <div className="card-body">
        <div style={{display:'flex', flexWrap:'wrap'}}>
            <div style={{width: '25%'}}>
              <label htmlFor="numberIP" style={{width: '100%'}}>Value</label>
              <input type="number" min='0' id="numberIP" onChange={(e) =>this.handleTarget(e)}/>
            </div>
            <div style={{width: '25%'}}>
              <label htmlFor="instType" style={{width: '100%'}}>Instruction Type</label>
              <select style={{borderRadius: '5px', width: '75%'}} id="instType"name="Instruction Type">
                <option>Target Balance</option>
              </select>
            </div>
            <div style={{width: '25%'}}>
              <label htmlFor="execMode" style={{width: '100%'}}>Execution Mode</label>
              <select style={{borderRadius: '5px', width: '75%'}} id="execMode"name="Execution Mode">
                <option>Manual</option>
              </select>
            </div>
            <div style={{width: '25%'}}>
              <input type="checkbox" id="instReversal" checked disabled style={{display: 'none'}}/>
              <label htmlFor="instReversal" style={{margin: '30px 0 0 30px'}}>
                <img src={buttonImages.buttons[2]}/>&nbsp; Reversal
              </label>
            </div>
        </div>
        <hr />
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <img src={buttonImages.buttons[0]} style={{margin: '10px 0 28px 69%'}}/>
          <img src={buttonImages.buttons[1]} onClick={this.handleAddInstr}/>
        </div>
      </div>
    </div>
  </div>
</div>
            </div>
        )
    }else {
        return null;
    }
    }
}