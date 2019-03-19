import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import InstructionModal from './instExeModal/index';
import ViewInstructionModal from './viewInstModal/index';
import './style.css';

class History extends Component {
    state = {
        instructionArray: [
            {
                "executionId": 1234,
                "instructionId": 100005,
                "controlAccount": {
                    "controlAccountNumber": "60161331926820",
                    "balanceBeforeExecution": "5000",
                    "balanceAfterExecution": "2000",
                },
                "contraAccount": {
                    "contraAccountNumber": "60161331926819",
                    "balanceBeforeExecution": "7000",
                    "balanceAfterExecution": "4000",
                },
                "executionDateTime": "20/03/2019",
                "status": 'success',
                "failureReason": null,
                "target": "0",
                "poolingAmmount": '3000',
                "instructionType": "Target Balance",
                "priorityId": "6",
                "executionMode": "Manual",
                "reversal": "No",
                "forceDebitControlAccount": "false",
                "forceDebitContraAccount": "false"
            },
            {
                "executionId": 5667,
                "instructionId": 100006,
                "controlAccount": {
                    "controlAccountNumber": "60161331926820",
                    "balanceBeforeExecution": "5000",
                    "balanceAfterExecution": "2000",
                },
                "contraAccount": {
                    "contraAccountNumber": "60161331926819",
                    "balanceBeforeExecution": "7000",
                    "balanceAfterExecution": "4000",
                },
                "executionDateTime": "22/03/2019",
                "status": 'fail',
                "failureReason": "As insufficient contra account balance",
                "target": "0",
                "poolingAmmount": '3000',
                "instructionType": "Target Balance",
                "priorityId": "6",
                "executionMode": "Manual",
                "reversal": "Yes",
                "forceDebitControlAccount": "false",
                "forceDebitContraAccount": "false"
            },
            {
                "executionId": 454,
                "instructionId": 100008,
                "controlAccount": {
                    "controlAccountNumber": "60161331926820",
                    "balanceBeforeExecution": "5000",
                    "balanceAfterExecution": "2000",
                },
                "contraAccount": {
                    "contraAccountNumber": "60161331926819",
                    "balanceBeforeExecution": "7000",
                    "balanceAfterExecution": "4000",
                },
                "executionDateTime": "22/03/2019",
                "status": 'fail',
                "failureReason": "As insufficient contra account balance",
                "target": "0",
                "poolingAmmount": '3000',
                "instructionType": "Target Balance",
                "priorityId": "6",
                "executionMode": "Manual",
                "reversal": "Yes",
                "forceDebitControlAccount": "true",
                "forceDebitContraAccount": "false"
            }
        ]
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

    handleViewInstModalOpen = (instId) => {
        const instructionArray = [...this.state.instructionArray];
        const index = instructionArray.findIndex(inst => inst.instructionId === instId);
        instructionArray[index].viewInstModalOpen = true;
        this.setState({ instructionArray });
    };

    handleViewInstModalClose = (instId) => {
        const instructionArray = [...this.state.instructionArray];
        const index = instructionArray.findIndex(inst => inst.instructionId === instId);
        instructionArray[index].viewInstModalOpen = false;
        this.setState({ instructionArray });
    }

    handleViewEventInstExeModal = (instruction) => {
        this.handleInstExeModalClose(instruction.instructionId);
        this.handleViewInstModalOpen(instruction.instructionId);
    }

    dateConvertor = (date) => {
        console.log(date);
        var d = new Date("2017-03-16T17:46:53.677");
        console.log(d.toLocaleString());
    }

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
                                <th>Date Executed</th>
                                <th>Status</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.instructionArray.map(instruction =>
                                <tr key={instruction.executionId} className="history">
                                    <td>{instruction.instructionId}</td>
                                    <td>{instruction.executionId}</td>
                                    <td>{instruction.controlAccount.controlAccountNumber}</td>
                                    <td>&#163; {instruction.controlAccount.balanceBeforeExecution}</td>
                                    <td>&#163; {instruction.controlAccount.balanceAfterExecution}</td>
                                    <td>{instruction.contraAccount.contraAccountNumber}</td>
                                    <td>&#163; {instruction.contraAccount.balanceBeforeExecution}</td>
                                    <td>&#163; {instruction.contraAccount.balanceAfterExecution}</td>
                                    {/* <td>{this.dateConvertor(instruction.executionDateTime)}</td> */}
                                    <td>{instruction.executionDateTime}</td>
                                    <td>{this.checkStatus(instruction)}</td>
                                    <td><ViewInstructionModal instructionData={instruction} tag={<Icon name='eye' className="eyeIcon" />}
                                        open={instruction.viewInstModalOpen} onOpen={this.handleViewInstModalOpen} onClose={this.handleViewInstModalClose}></ViewInstructionModal></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}

export default History;