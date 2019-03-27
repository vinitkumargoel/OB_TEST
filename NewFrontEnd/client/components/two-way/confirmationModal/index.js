import React, { Component } from 'react';
import { Modal, Icon } from 'semantic-ui-react';
import './style.css';
import moment from 'moment';
import ConfirmantionInfo from '../confirmationInfo/index';
import Cards from '../../cards/index';

class ConfirmationModal extends Component {

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

    render() {
        console.log(232323233, this.props.businessData);

        return (
            <Modal open={this.props.open} basic size='large' style={{ width: '100%' }}>
                <div className="viewInstMainContainer">
                    <div className="viewInstContainer">
                        <div className="ui confirmationContainerCard">
                            <div className="mainColumn_1" style={{ backgroundImage: "url(images/group-20@3x.png)" }}>
                                <div className="mainColumn_1-Container1">
                                    <div className="colum1_container_font" style={{ color: 'white' }}>Execution</div>
                                    <div className="colum1_container_font" style={{ color: 'white' }}>Confirmation</div>
                                </div>

                                <div className="mainColumn_1-Container2">
                                    <div style={{ fontSize: '11px', marginBottom: '8px', color: '#529bff' }}>EXECUTED ON</div>
                                    {/* <div style={{ fontSize: '14px', color: 'white' }}>{moment(this.props.instructionData.executionDateTime).format('DD/MM/YYYY')}</div> */}
                                </div>
                            </div>
                            <div className="mainColumn_2">
                                <div className="mainColumn_2_container">
                                    <div className="column2Container_part1">
                                        <div style={{ width: '100%', height: '100%' }}>
                                            <div className='accounts-Card' style={{ width: '100%', height: '100%', padding: '0' }}>
                                                <Cards accounts={this.props.businessData.accounts} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column2Container_part2">
                                        <div className='accounts-Card' style={{ width: '100%', height: '100%', padding: '0' }}>
                                            <Cards accounts={this.props.businessData.accounts} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ width: '87%' }}>
                        <button className="ui button modalBtn closeBtn" onClick={() => this.props.onClose()}>CLOSE</button>
                        <button className="ui button modalBtn confirmBtn" onClick={() => this.props.onConfirm()}>CONFIRM</button>
                    </div>
                </div>
            </Modal>);
    }
}

export default ConfirmationModal;