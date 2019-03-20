import React, { Component } from 'react';
import { Modal, Icon } from 'semantic-ui-react';
import ViewInstructionModal from '../viewInstModal/index';
import './style.css';

class InstructionModal extends Component {
    checkStatus = (status) => {
        if (status === 'fail') {
            return (
                <div>
                    <span>
                        <Icon name='exclamation circle' className="exclamationIcon modalIcon" />
                        <span style={{ color: 'lightblue' }}>Some Instructions have failed </span>
                    </span>
                </div>
            )
        }
    }

    render() {
        return (<Modal
            open={this.props.open} basic size='large' style={{ width: '100%' }}>
            <div className="InstModalContainer">
                <div className="modalInstructionExecution" style={{ backgroundImage: "url(images/img-banner-funds-copy@3x.png)" }}>
                    <h1 style={{ color: 'white' }}>Instructions executed!</h1>

                    {this.checkStatus(this.props.status)}

                    <div className="modalButtonContainer">
                        <button className="ui button modalBtn viewButton" onClick={() => this.props.handleView()}> View</button>
                        <button className="ui button modalBtn okButton" onClick={() => this.props.onClose()}>OK</button>
                    </div>
                </div>
            </div>
        </Modal >
        );
    }
}

export default InstructionModal;