import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import Services from '../../services/index';
import ViewInstructionModal from './viewInstModal/index';
import moment from 'moment';
import './style.css';

class History extends Component {
    state = {
        instructionArray: [],
        pagginationArray: []
    }

    componentDidMount() {
        var token = sessionStorage.getItem("token");

        Services.history(token, function (data) {
            data.shift();
            this.setState({ instructionArray: data });
            this.pagginator();
        }.bind(this), function (err) {
            // console.log(err);
        })
    }

    pagginator = () => {
        this.setState({ pagginationArray: this.state.instructionArray });
    }

    // handleInstExeModalOpen = (instId) => {
    //     const instructionArray = [...this.state.instructionArray];
    //     const index = instructionArray.findIndex(inst => inst.instructionId === instId);
    //     instructionArray[index].instExeModalOpen = true;
    //     this.setState({ instructionArray });
    // };

    // handleInstExeModalClose = (instId) => {
    //     const instructionArray = [...this.state.instructionArray];
    //     const index = instructionArray.findIndex(inst => inst.instructionId === instId);
    //     instructionArray[index].instExeModalOpen = false;
    //     this.setState({ instructionArray });
    // }

    handleViewInstModalOpen = (exeID) => {
        const pagginationArray = [...this.state.pagginationArray];
        const index = pagginationArray.findIndex(inst => inst.executionId === exeID);
        pagginationArray[index].viewInstModalOpen = true;
        this.setState({ pagginationArray });
    };

    handleViewInstModalClose = (exeID) => {
        const pagginationArray = [...this.state.pagginationArray];
        const index = pagginationArray.findIndex(inst => inst.executionId === exeID);
        pagginationArray[index].viewInstModalOpen = false;
        this.setState({ pagginationArray });
    }

    // handleViewEventInstExeModal = (instruction) => {
    //     this.handleInstExeModalClose(instruction.instructionId);
    //     this.handleViewInstModalOpen(instruction.instructionId);
    // }

    checkStatus = (instruction) => {
        if (instruction.status === 'fail') {
            return < Icon name='exclamation circle' className="exclamationIcon" />
            // return <InstructionModal instructionData={instruction} open={instruction.instExeModalOpen}
            //     onOpen={this.handleInstExeModalOpen} onClose={this.handleInstExeModalClose} handleView={this.handleViewEventInstExeModal}
            //     onViewOpen={this.handleViewInstModalOpen} onViewClose={this.handleViewInstModalClose}></InstructionModal>
        }
        return < Icon name='check' className="checkIcon" />
    }

    render() {
        return (
            <React.Fragment>
                <div className="tableContainer">
                    <table className="ui striped table">
                        <thead>
                            <tr className="history">
                                <th>Instruction ID</th>
                                <th>Execution ID</th>
                                <th>Control Account</th>
                                <th>Balance <div>(Before Execution)</div></th>
                                <th>Balance <div>(After Execution)</div></th>
                                <th>Contra Account</th>
                                <th>Balance <div>(Before Execution)</div></th>
                                <th>Balance <div>(After Execution)</div></th>
                                <th>Executed Date</th>
                                <th>Executed Time</th>
                                <th>Status</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.pagginationArray.map(instruction =>
                                <tr key={instruction.executionId} className="history">
                                    <td>{instruction.instructionId}</td>
                                    <td>{instruction.executionId}</td>
                                    <td>{instruction.controlAccount.controlAccountNumber}</td>
                                    <td>&#163; {instruction.controlAccount.balanceBeforeExecution}</td>
                                    <td>&#163; {instruction.controlAccount.balanceAfterExecution}</td>
                                    <td>{instruction.contraAccount.contraAccountNumber}</td>
                                    <td>&#163; {instruction.contraAccount.balanceBeforeExecution}</td>
                                    <td>&#163; {instruction.contraAccount.balanceAfterExecution}</td>
                                    <td>{moment(instruction.executionDateTime).format("DD/MM/YYYY")}</td>
                                    <td>{moment(instruction.executionDateTime).format('LT')}</td>
                                    <td>{this.checkStatus(instruction)}</td>
                                    <td><ViewInstructionModal instructionData={instruction} tag={<Icon name='eye' className="eyeIcon" />}
                                        open={instruction.viewInstModalOpen} onOpen={this.handleViewInstModalOpen} onClose={this.handleViewInstModalClose}></ViewInstructionModal></td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* <div className="pagginator">
                        {this.pagginator()}
                    </div> */}
                </div>
            </React.Fragment>
        );
    }
}

export default History;