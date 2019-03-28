import React, { Component } from 'react';
import { Modal, Icon } from 'semantic-ui-react';
import './style.css';
import moment from 'moment';
import Cards from '../../cards/index';
import InterInfoCard from '../InterInfoCard/index';

class ConfirmationModal extends Component {

    renderFailureMessage = (errors) => {
        if (errors && errors.length > 0) {
            return (
                <div style={{ padding: '0 20px 20px 20px' }}>
                    <div className="confirmationFailureMessage" style={{ marginTop: '0' }}>
                        <Icon name='exclamation circle' className="exclamationIcon" style={{ fontSize: '12px', marginRight: '10px' }} />
                        <span style={{ color: '#d74e14', marginRight: '30px', fontSize: '11px', fontWeight: 'bold' }}>FAILURE</span>
                        <span style={{ color: 'grey' }}>{errors[0].errorMessage}</span>
                    </div>
                </div>
            )
        }
    }

    renderBasedOnBusinessType = (dataToSend) => {
        if (this.props.businessType === 'intra') {
            return <Cards accounts={dataToSend} />
        } else if (this.props.businessType === 'inter') {
            return <InterInfoCard accounts={dataToSend} />
        }
    }

    dataForInterAccount = (data) => {
        const interAccountArray = [];

        data.forEach(interData => {
            interAccountArray.push({
                name: interData.name,
                account: interData.accounts.find(account => account.accountType === "Savings")
            })
        });

        return interAccountArray;
    }

    render() {
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
                                    <div style={{ fontSize: '14px', color: 'white' }}>{moment(new Date()).format('DD/MM/YYYY')}</div>
                                </div>
                            </div>
                            <div className="mainColumn_2">
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className="mainColumn_2_container">
                                        <div className="column2Container_part1">
                                            <div style={{ width: '100%', height: '100%' }}>
                                                <div className='accounts-Card' style={{ width: '100%', height: '100%', padding: '0' }}>
                                                    {
                                                        this.props.businessType === 'intra' ?
                                                            this.renderBasedOnBusinessType(this.props.businessData.accounts) :
                                                            this.renderBasedOnBusinessType(this.dataForInterAccount(this.props.businessData))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column2Container_part2">
                                            <div className='accounts-Card' style={{ width: '100%', height: '100%', padding: '0' }}>
                                                {
                                                    this.props.businessType === 'intra' ?
                                                        this.renderBasedOnBusinessType(this.props.predictionData.accountDetails) :
                                                        this.renderBasedOnBusinessType(this.dataForInterAccount(this.props.businessData))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {this.renderFailureMessage(this.props.predictionData.errors)}
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