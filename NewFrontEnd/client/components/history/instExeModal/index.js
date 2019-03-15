import React, { Component } from 'react';
import { Modal, Icon, Divider } from 'semantic-ui-react';
import './style.css';

class InstructionModal extends Component {
    state = {
        modalOpen: false
    }

    handleOpen = () => this.setState({ modalOpen: true });
    handleClose = () => this.setState({ modalOpen: false });

    render() {
        return (<Modal trigger={< Icon name='exclamation circle' className="exclamationIcon" onClick={this.handleOpen} />}
            open={this.state.modalOpen} basic size='large' style={{ width: '100%' }}>
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
                        <button className="ui button modalBtn viewButton">View</button>
                        <button className="ui button modalBtn okButton" onClick={this.handleClose}>OK</button>
                    </div>
                </div>
            </div>
        </Modal >);
    }
}

export default InstructionModal;