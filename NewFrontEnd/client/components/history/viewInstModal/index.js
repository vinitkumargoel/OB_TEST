import React, { Component } from 'react';
import { Modal, Icon } from 'semantic-ui-react';
import './style.css';

class ViewInstructionModal extends Component {
    // state = {
    //     modalOpen: false
    // }

    // handleOpen = () => this.setState({ modalOpen: true });
    // handleClose = () => this.setState({ modalOpen: false });

    renderFailureMessage = (instruction) => {
        if (instruction.status === 'fail') {
            return (
                <div className="message">
                    <Icon name='exclamation circle' className="exclamationIcon" style={{ fontSize: '12px', marginRight: '10px' }} />
                    <span style={{ color: '#d74e14', marginRight: '30px', fontSize: '11px', fontWeight: 'bold' }}>FAILURE</span>
                    <span style={{ color: 'grey' }}>{instruction.failureReason}</span>
                </div>
            )
        }
    }

    isForceDebitAccount = (forceDebitAccount) => {
        if (forceDebitAccount === 'true') {
            return <Icon name='check' className="eyeIcon" style={{ fontSize: '12px', color: '#00864f', marginRight: '8px' }} />
        }
        return <Icon name='ban' className="eyeIcon" style={{ fontSize: '12px', color: 'grey', marginRight: '8px' }} />
    }

    isReversal = (reversal) => {
        if (reversal === 'Yes') {
            return <Icon name='check' className="eyeIcon" style={{ fontSize: '12px', color: '#00864f', marginRight: '8px' }} />
        }
        return <Icon name='ban' className="eyeIcon" style={{ fontSize: '12px', color: 'grey', marginRight: '8px' }} />
    }

    manipulateAccountNumber = (accountNumber) => {
        return accountNumber.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    render() {
        return (<Modal trigger={<span onClick={() => this.props.onOpen(this.props.instructionData.instructionId)}>{this.props.tag}</span>} open={this.props.open} basic size='large' style={{ width: '100%' }}>
            <div className="viewInstMainContainer">
                <div className="viewInstContainer">
                    <div className="ui viewInstContainerCard">
                        <div className="mainColumn_1" style={{ backgroundImage: "url(images/group-20@3x.png)" }}>
                            <div className="mainColumn_1-Container1">
                                <div className="colum1_container_font">Instruction</div>
                                <div className="colum1_container_font">Execution</div>
                                <div className="colum1_container_font">Details</div>
                            </div>

                            <div className="mainColumn_1-Container2">
                                <div style={{ fontSize: '11px', marginBottom: '8px', color: '#5c9af1' }}>ID</div>
                                <div style={{ fontSize: '14px', marginBottom: '25px' }}>{this.props.instructionData.instructionId}</div>
                                <div style={{ fontSize: '11px', marginBottom: '8px', color: '#5c9af1' }}>EXECUTED ON</div>
                                <div style={{ fontSize: '14px' }}>{this.props.instructionData.executionDateTime}</div>
                            </div>
                        </div>
                        <div className="mainColumn_2">
                            <div className="column2Container">
                                <div className="upperSection">
                                    <div className="leftSection" style={{ borderRight: '1px solid lightgrey' }}>
                                        <div style={{ marginBottom: '8px', fontSize: '11px', color: 'blue', fontWeight: 'bold' }}>CONTROL ACCOUNT</div>
                                        <div style={{ marginBottom: '10px', fontSize: '22px', color: 'black' }}>{this.manipulateAccountNumber(this.props.instructionData.controlAccount.controlAccountNumber)}</div>
                                        <div style={{ marginBottom: '15px', color: 'black' }}>
                                            {this.isForceDebitAccount(this.props.instructionData.forceDebitControlAccount)}
                                            <span style={{ color: 'grey' }}>Force debit account</span>
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}>Balance before Execution :</span>
                                            <span style={{ color: 'grey' }}>&#163; {this.props.instructionData.controlAccount.balanceBeforeExecution}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}>Balance after Execution :</span>
                                            <span style={{ color: 'grey' }}>&#163; {this.props.instructionData.controlAccount.balanceAfterExecution}</span>
                                        </div>
                                    </div>
                                    <div className="rightSection">
                                        <div style={{ marginBottom: '8px', fontSize: '11px', color: 'blue', fontWeight: 'bold' }}>CONTRA ACCOUNT</div>
                                        <div style={{ marginBottom: '10px', fontSize: '22px', color: 'black' }}>{this.manipulateAccountNumber(this.props.instructionData.contraAccount.contraAccountNumber)}</div>
                                        <div style={{ marginBottom: '15px', color: 'black' }}>
                                            {this.isForceDebitAccount(this.props.instructionData.forceDebitContraAccount)}
                                            <span style={{ color: 'grey' }}>Force debit account</span>
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}>Balance before Execution :</span>
                                            <span style={{ color: 'grey' }}>&#163; {this.props.instructionData.contraAccount.balanceBeforeExecution}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}>Balance after Execution :</span>
                                            <span style={{ color: 'grey' }}>&#163; {this.props.instructionData.contraAccount.balanceAfterExecution}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="lowerSection">
                                    <div className="leftSection" style={{ paddingTop: '30px' }}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <span style={{ fontSize: '11px', color: 'blue', fontWeight: 'bold', marginRight: '20px' }}>VALUE</span>
                                            <span style={{ color: 'grey' }}>&#163; {this.props.instructionData.target}</span>
                                        </div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <span style={{ marginBottom: '10px', fontSize: '11px', color: 'blue', fontWeight: 'bold', marginRight: '20px' }}>POOLING AMMOUNT</span>
                                            <span style={{ color: 'grey' }}>&#163; {this.props.instructionData.poolingAmmount}</span>
                                        </div>
                                        <div>
                                            {this.isReversal(this.props.instructionData.reversal)}
                                            <span style={{ color: 'grey' }}>Reversal</span>
                                        </div>
                                    </div>
                                    <div className="rightSection rightSectionContainer" style={{ paddingTop: '30px' }}>
                                        <div>
                                            <div style={{ marginBottom: '20px' }}>
                                                <span style={{ fontSize: '11px', color: 'blue', fontWeight: 'bold', marginRight: '20px' }}>INSTRUCTION TYPE</span>
                                            </div>
                                            <div style={{ marginBottom: '20px' }}>
                                                <span style={{ marginBottom: '10px', fontSize: '11px', color: 'blue', fontWeight: 'bold', marginRight: '20px' }}>INSTRUCTION PRIORITY</span>
                                            </div>
                                            <div>
                                                <span style={{ marginBottom: '10px', fontSize: '11px', color: 'blue', fontWeight: 'bold', marginRight: '20px' }}>EXECUTION MODE</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ marginBottom: '20px' }}>
                                                <span style={{ color: 'grey' }}>{this.props.instructionData.instructionType}</span>
                                            </div>
                                            <div style={{ marginBottom: '20px' }}>
                                                <span style={{ color: 'grey' }}>{this.props.instructionData.priorityId}</span>
                                            </div>
                                            <div>
                                                <span style={{ color: 'grey' }}>{this.props.instructionData.executionMode}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.renderFailureMessage(this.props.instructionData)}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ width: '74%' }}>
                    <button className="ui button modalBtn closeBtn" onClick={() => this.props.onClose(this.props.instructionData.instructionId)}>CLOSE</button>
                </div>
            </div>
        </Modal>);
    }
}

export default ViewInstructionModal;