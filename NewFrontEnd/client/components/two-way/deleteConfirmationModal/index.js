import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import './style.css';

class DeleteConfirmationModal extends Component {


    render() {
        return (<Modal
            open={this.props.open} basic size='large' style={{ width: '100%' }}>
            <div className="InstModalContainer">
                <div className="modalInstructionExecution" style={{ backgroundImage: "url(images/img-banner-funds-copy@3x.png)" }}>
                    <h1 style={{ color: 'white' }}>Do you want to proceed with deleting this instruction?</h1>


                    <div className="modalButtonContainer">
                        <button className="ui button stylizeBtn" onClick={() => this.props.onConfirm()}>CONFIRM</button>
                        <button className="ui button stylizeBtn" onClick={() => this.props.onClose()}>CANCEL</button>
                    </div>
                </div>
            </div>
        </Modal >
        );
    }
}

export default DeleteConfirmationModal;