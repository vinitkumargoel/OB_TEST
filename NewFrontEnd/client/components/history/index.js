import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import Services from '../../services/index';
import ViewInstructionModal from './viewInstModal/index';
import moment from 'moment';
import './style.css';

class History extends Component {
    state = {
        instructionArray: []
    }

    componentDidMount() {
        var token = sessionStorage.getItem("token");

        Services.history(token, function (data) {
            console.log(data);
            this.setState({ instructionArray: data });
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
        instructionArray[index].viewInstModalOpen = true;
        this.setState({ instructionArray });
    };

    handleViewInstModalClose = (exeID) => {
        const instructionArray = [...this.state.instructionArray];
        const index = instructionArray.findIndex(inst => inst.executionId === exeID);
        instructionArray[index].viewInstModalOpen = false;
        this.setState({ instructionArray });
    }

    checkStatus = (instruction) => {
        if (instruction.status === 'fail') {
            return < Icon name='exclamation circle' className="exclamationIcon" />
            // return <Img src="images/ic-error-outline-copy-2@3x.png" alt="" className="exclamationIcon"/>
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