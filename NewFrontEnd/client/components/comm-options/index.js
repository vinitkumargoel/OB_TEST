import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';

import { Button, Icon, Modal, Radio } from 'semantic-ui-react'
import Header from '../headernew'
import Sidebar from '../sidebar'
import Services from '../../services'

export default class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: true,
      debitData: [],
      creditData: [],
      accSumary: {},
      value: ''
    }
  }
  componentWillMount() {
    var token = sessionStorage.getItem("token");

    Services.getSISuggestions(token, function (data) {
      this.setState({ siSuggest: data });
      console.log(data, "getSI")
    }.bind(this), function (err) {
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
  onNextClick = (info) => {
    if (info == 'intraCompany') {
      this.props.history.push('/setInstructions');
    }
    else if(info === "interCompany")
    {
      this.props.history.push('/setInstructionsInter')
    }
    else {
      console.log('Next');
    }
  }
  render() {
    return (
      <div style={{ marginTop: '70px', height: '100%' }}>
        <Header username={this.state.accSumary.username} history={this.props.history} />
        <div style={{ display: "flex",  height: '100%' }}>
          <Sidebar activeComponent="wallet" type="commercial" />
          <div style={{ backgroundColor: "#f5f6fa", width: "100%", padding: '0 4%',  height: '100%' }}>
            <div style={{ margin: '1.5% 0' }}>
              <p className='My-financials'>Commercial services</p>
            </div>
            <div>
              <div className="commService_container">
                <div className="card commService_card" onClick={() => this.onNextClick('intraCompany')}>
                  <h4>Intra Company Cash Pooling</h4>
                </div>
                <div className="card commService_card" onClick={()=>this.onNextClick('interCompany')}>
                  <h4>Inter Company Cash Pooling</h4>
                </div>
                <div className="card commService_card">
                  <h4>Business Forecasting</h4>
                </div>
              </div>

              <div className="commService_container">
                <div className="card commService_card">
                  <h4>Investment Management</h4>
                </div>
                <div className="card commService_card">
                  <h4>Fixed Payment Instruction</h4>
                </div>
              </div>
            </div>
            {/* <div className='optionsModal' style={{ padding: '20px' }}>
              <div className='commServiceOption' style={{ backgroundColor: (this.state.value === 'two-way') ? 'rgba(0, 106, 77, 0.14)' : 'rgba(196, 198, 205, 0.08)' }}>
                <div className='optionHeader'>
                  Intra Company Cash Pooling
                      </div>
                <Radio value='two-way' className='radioStyle' checked={this.state.value === 'two-way'}
                  onChange={this.handleChange} />
                <div className='optionMeta'>
                  Manage Cash Pooling transactions for different accounts of your business.
                      </div>
              </div>
              <div className='commServiceOption' style={{ backgroundColor: 'rgba(196, 198, 205, 0.08)' }}>
                <div className='optionHeader'>
                  Inter Company Cash Pooling
                      </div>
                <Radio value='two-way' className='radioStyle' checked={false}
                />
                <div className='optionMeta'>
                  Manage Cash Pooling transactions between your businesses.
                      </div>
              </div>
              <div className='commServiceOption' style={{ backgroundColor: 'rgba(196, 198, 205, 0.08)' }}>
                <div className='optionHeader'>
                  Business Forecasting
                      </div>
                <Radio value='two-way' className='radioStyle' checked={false}
                />
                <div className='optionMeta'>
                  Predict the growth of your businesses.
                      </div>
              </div>
              <div className='commServiceOption' style={{ backgroundColor: 'rgba(196, 198, 205, 0.08)' }}>
                <div className='optionHeader'>
                  Investment Management
                      </div>
                <Radio value='two-way' className='radioStyle' checked={false}
                />
                <div className='optionMeta'>

                </div>
              </div>
              <div className='commServiceOption' style={{ backgroundColor: 'rgba(196, 198, 205, 0.08)' }}>
                <div className='optionHeader'>
                  Fixed Payment Instruction
                      </div>
                <Radio value='two-way' className='radioStyle' checked={false}
                />
                <div className='optionMeta'>

                </div>
              </div>
              <div className="commService_flex-container">
                <Link to='/homeCommercial'><button className="flex-item" onClick={this.onCancelClick}>BACK</button></Link>
                <button className="flex-item1" style={{ marginLeft: '310px', display: (this.state.value != '') ? '' : 'none' }}
                  onClick={this.onNextClick}>NEXT</button>
              </div>
            </div>
            <div>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}
