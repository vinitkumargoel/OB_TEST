import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import Services from '../../services/index';
import ViewInstructionModal from './viewInstModal/index';
import moment from 'moment';
import './style.css';

class History extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modelOpen: false,
            instructionArray: [],
            selectedInstruction: {}
        }
    }

    componentDidMount() {
        var token = sessionStorage.getItem("token");

        Services.history(token, function (data) {
            let instructionArray = []
            if (this.props.type === "intra") {
                instructionArray = data.filter(instruction => instruction.controlBusinessName === instruction.contraBusinessName)
            }
            else {
                instructionArray = data.filter(instruction => instruction.controlBusinessName !== instruction.contraBusinessName)
            }
            this.setState({ instructionArray: instructionArray });
            console.log(data)
            // this.pagginator();
        }.bind(this), function (err) {
            // console.log(err);
        })
    }

    pagginator = () => {
        this.setState({ instructionArray: this.state.instructionArray });
    }

    handleViewInstModalOpen = (exeID) => {
        const instructionArray = [...this.state.instructionArray];
        const index = instructionArray.findIndex(inst => inst.executionId === exeID);
        // instructionArray[index].viewInstModalOpen = true;
        this.setState({ selectedInstruction: instructionArray[index], modelOpen: true });
    };

    handleViewInstModalClose = (exeID) => {
        const instructionArray = [...this.state.instructionArray];
        const index = instructionArray.findIndex(inst => inst.executionId === exeID);
        // instructionArray[index].viewInstModalOpen = false;
        this.setState({ selectedInstruction: instructionArray[index], modelOpen: false });
    }

    checkStatus = (instruction) => {
        if (instruction.status === 'fail') {
            return < Icon name='exclamation circle' className="exclamationIcon" />
            // return <Img src="images/ic-error-outline-copy-2@3x.png" alt="" className="exclamationIcon"/>
        }
        return < Icon name='check' className="checkIcon" />
    }

    manipulateAccountNumber = (accountNumber) => {
        accountNumber.toString();
        let number = '';
        for (let index = 0; index < accountNumber.length; index++) {
            if (index === 1 || index === 3) {
                number = number + accountNumber[index] + '-';
            } else if (index === 5) {
                number = number + accountNumber[index] + ' ';
            } else {
                number = number + accountNumber[index];
            }
        }

        return number;
    }

    render() {
        return (
            <React.Fragment>
                <div className="tableContainer">
                    <table className="ui stripped table">
                        <thead>
                            <tr className="history">
                                <th>Control Account</th>
                                <th>Balance <div>(Before Execution)</div></th>
                                <th>Balance <div>(After Execution)</div></th>
                                <th>Contra Account</th>
                                <th>Balance <div>(Before Execution)</div></th>
                                <th>Balance <div>(After Execution)</div></th>
                                <th>Executed Date</th>
                                <th>Executed Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.instructionArray.map(instruction =>
                                <tr key={instruction.executionId} className="history" onClick={() => this.handleViewInstModalOpen(instruction.executionId)}>
                                    <td>{this.manipulateAccountNumber(instruction.controlAccount.controlAccountNumber)}</td>
                                    <td>&#163; {instruction.controlAccount.balanceBeforeExecution}</td>
                                    <td>&#163; {instruction.controlAccount.balanceAfterExecution}</td>
                                    <td>{this.manipulateAccountNumber(instruction.contraAccount.contraAccountNumber)}</td>
                                    <td>&#163; {instruction.contraAccount.balanceBeforeExecution}</td>
                                    <td>&#163; {instruction.contraAccount.balanceAfterExecution}</td>
                                    <td>{moment(instruction.executionDateTime).format("DD/MM/YYYY")}</td>
                                    <td>{moment(instruction.executionDateTime).format('LT')}</td>
                                    <td>{this.checkStatus(instruction)}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {this.state.modelOpen ? <ViewInstructionModal instructionData={this.state.selectedInstruction}
                        open={this.state.modelOpen} onOpen={this.handleViewInstModalOpen}
                        onClose={this.handleViewInstModalClose}></ViewInstructionModal> : null}
                </div>
            </React.Fragment >
        );
    }
}

export default History;