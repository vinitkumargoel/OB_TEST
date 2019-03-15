import React, { Component } from 'react';
import { Modal, Icon, Divider } from 'semantic-ui-react';
// import image1 from './img-banner-funds-copy@3x.png';
import './style.css';
import InstructionModal from './instExeModal/index';
import ViewInstructionModal from './viewInstModal/index'

class History extends Component {
    // state = { instExeModalOpen: false, viewInstModalOpen: false }
    state = {
        instructionArray: [
            {
                "instructionId": 100005,
                "controlAccount": {
                    "controlAccountNumber": "60161331926820",
                    "balanceBeforeExecution": "5000",
                    "balanceAfterExecution": "2000"
                },
                "contraAccount": {
                    "contraAccountNumber": "60161331926819",
                    "balanceBeforeExecution": "7000",
                    "balanceAfterExecution": "4000"
                },
                "executionDateTime": "20/03/2019",
                "status": 'success', // or fail
                "failureReason": "As insufficient contra account balance",
                "target": "0",
                "poolingAmmount": '3000',
                "instructionType": "Target Balance",
                "priorityId": "6",
                "executionMode": "Manual",
                "reversal": "No",
                "forceDebitControlAccount": "false",
                "forceDebitContraAccount": "false",
            },
            {
                "instructionId": 34343434,
                "controlAccount": {
                    "controlAccountNumber": "60161331926820",
                    "balanceBeforeExecution": "5000",
                    "balanceAfterExecution": "2000"
                },
                "contraAccount": {
                    "contraAccountNumber": "60161331926819",
                    "balanceBeforeExecution": "7000",
                    "balanceAfterExecution": "4000"
                },
                "executionDateTime": "22/03/2019",
                "status": 'fail', // or fail
                "failureReason": "As insufficient contra account balance",
                "target": "0",
                "poolingAmmount": '3000',
                "instructionType": "Target Balance",
                "priorityId": "6",
                "executionMode": "Manual",
                "reversal": "No",
                "forceDebitControlAccount": "false",
                "forceDebitContraAccount": "false",
            }
        ]
    }

    dateConvertor = (date) => {
        console.log(date);
        var d = new Date("2017-03-16T17:46:53.677");
        console.log(d.toLocaleString());
    }

    checkStatus = (status) => {
        if (status === 'fail') {
            return <InstructionModal></InstructionModal>
        }
        return < Icon name='check' className="checkIcon" />
    }

    render() {
        return (
            <React.Fragment>
                2324444
                <div className="tableContainer">
                    <table className="ui striped table">
                        <thead>
                            <tr>
                                <th>Instruction ID</th>
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
                                <tr key={instruction.instructionId}>
                                    <td>{instruction.instructionId}</td>
                                    <td>{instruction.controlAccount.controlAccountNumber}</td>
                                    <td>&#163; {instruction.controlAccount.balanceBeforeExecution}</td>
                                    <td>&#163; {instruction.controlAccount.balanceAfterExecution}</td>
                                    <td>{instruction.contraAccount.contraAccountNumber}</td>
                                    <td>&#163; {instruction.contraAccount.balanceBeforeExecution}</td>
                                    <td>&#163; {instruction.contraAccount.balanceAfterExecution}</td>
                                    {/* <td>{this.dateConvertor(instruction.executionDateTime)}</td> */}
                                    <td>{instruction.executionDateTime}</td>
                                    <td>{this.checkStatus(instruction.status)}</td>
                                    <td><ViewInstructionModal></ViewInstructionModal></td>
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