import React, { Component } from 'react';
import { Modal, Icon, Divider } from 'semantic-ui-react';
import './style.css';

class ViewInstructionModal extends Component {
    state = {
        modalOpen: false
    }

    handleOpen = () => this.setState({ modalOpen: true });
    handleClose = () => this.setState({ modalOpen: false });

    render() {
        return (<Modal trigger={<Icon name='eye' className="eyeIcon" onClick={this.handleOpen} />} open={this.state.modalOpen} onClose={this.handleClose} basic size='large' style={{ width: '100%' }}>
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
                                <div style={{ fontSize: '14px', marginBottom: '25px' }}>23232323</div>
                                <div style={{ fontSize: '11px', marginBottom: '8px', color: '#5c9af1' }}>EXECUTED ON</div>
                                <div style={{ fontSize: '14px' }}>05/01/2019</div>
                            </div>
                        </div>
                        <div className="mainColumn_2">
                            <div className="column2Container">
                                <div className="upperSection">
                                    <div className="leftSection" style={{ borderRight: '1px solid lightgrey' }}>
                                        <div style={{ marginBottom: '8px', fontSize: '11px', color: 'blue', fontWeight: 'bold' }}>CONTROL ACCOUNT</div>
                                        <div style={{ marginBottom: '10px', fontSize: '22px', color: 'black' }}>1234 1234 1234 56</div>
                                        <div style={{ marginBottom: '15px', color: 'black' }}>
                                            <Icon name='check' className="eyeIcon" style={{ fontSize: '12px', color: '#00864f', marginRight: '8px' }} />
                                            <span style={{ color: 'grey' }}>Force debit account</span>
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}>Balance before Execution :</span>
                                            <span style={{ color: 'grey' }}>&#163; 20,000</span>
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}>Balance after Execution :</span>
                                            <span style={{ color: 'grey' }}>&#163; 50,000</span>
                                        </div>
                                    </div>
                                    <div className="rightSection">
                                        <div style={{ marginBottom: '8px', fontSize: '11px', color: 'blue', fontWeight: 'bold' }}>CONTRA ACCOUNT</div>
                                        <div style={{ marginBottom: '10px', fontSize: '22px', color: 'black' }}>1234 1234 1234 56</div>
                                        <div style={{ marginBottom: '15px', color: 'black' }}>
                                            <Icon name='check' className="eyeIcon" style={{ fontSize: '12px', color: '#00864f', marginRight: '8px' }} />
                                            <span style={{ color: 'grey' }}>Force debit account</span>
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}>Balance before Execution :</span>
                                            <span style={{ color: 'grey' }}>&#163; 20,000</span>
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 'bold', marginRight: '5px', color: 'black' }}>Balance after Execution :</span>
                                            <span style={{ color: 'grey' }}>&#163; 50,000</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="lowerSection">
                                    <div className="leftSection" style={{ paddingTop: '30px' }}>
                                        <div style={{ marginBottom: '20px' }}>
                                            <span style={{ fontSize: '11px', color: 'blue', fontWeight: 'bold', marginRight: '20px' }}>VALUE</span>
                                            <span style={{ color: 'grey' }}>&#163; 50,000</span>
                                        </div>
                                        <div style={{ marginBottom: '20px' }}>
                                            <span style={{ marginBottom: '10px', fontSize: '11px', color: 'blue', fontWeight: 'bold', marginRight: '20px' }}>POOLING AMMOUNT</span>
                                            <span style={{ color: 'grey' }}>--------</span>
                                        </div>
                                        <div>
                                            <Icon name='check' className="eyeIcon" style={{ fontSize: '12px', color: '#00864f', marginRight: '8px' }} />
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
                                                <span style={{ color: 'grey' }}>Target Balance</span>
                                            </div>
                                            <div style={{ marginBottom: '20px' }}>
                                                <span style={{ color: 'grey' }}>1</span>
                                            </div>
                                            <div>
                                                <span style={{ color: 'grey' }}>Manual</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="message">
                                    <Icon name='check' className="eyeIcon" style={{ fontSize: '12px', color: '#00864f', marginRight: '10px' }} />
                                    <span style={{ color: '#d74e14', marginRight: '30px', fontSize: '11px', fontWeight: 'bold' }}>FAILURE</span>
                                    <span style={{ color: 'grey' }}>Insufficient balance in Contra account</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{width: '74%'}}>
                    <button className="ui button modalBtn closeBtn" onClick={this.handleClose}>CLOSE</button>
                </div>
            </div>
        </Modal>);
    }
}

export default ViewInstructionModal;