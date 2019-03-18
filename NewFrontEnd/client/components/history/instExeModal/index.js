import React, { Component } from 'react';
import { Modal, Icon } from 'semantic-ui-react';
import ViewInstructionModal from '../viewInstModal/index';
import './style.css';

class InstructionModal extends Component {
    // state = {
    //     modalOpen: false
    // }

    // handleOpen = () => this.setState({ modalOpen: true });
    // handleClose = () => this.setState({ modalOpen: false });

    render() {
        return (<Modal trigger={< Icon name='exclamation circle' className="exclamationIcon" onClick={() => this.props.onOpen(this.props.instructionData.instructionId)} />}
            open={this.props.open} basic size='large' style={{ width: '100%' }}>
            <div className="InstModalContainer">
                <div className="modalInstructionExecution" style={{ backgroundImage: "url(images/img-banner-funds-copy@3x.png)" }}>
                    <h1>Instructions executed!</h1>

                    <div>
                        <span>
                            <Icon name='exclamation circle' className="exclamationIcon modalIcon" />
                            <span style={{ color: 'lightblue' }}>Some Instructions have failed </span>
                        </span>
                    </div>

                    <div className="modalButtonContainer">
                        <button className="ui button modalBtn viewButton" onClick={() => this.props.handleView(this.props.instructionData)}> View</button>
                        <button className="ui button modalBtn okButton" onClick={() => this.props.onClose(this.props.instructionData.instructionId)}>OK</button>
                    </div>
                </div>
            </div>
        </Modal >);
    }
}

export default InstructionModal;