import React from 'react';
import './style.css';

export default class Cards extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.accounts, "Cards");
    }

    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
            <div className="card" style={{ borderRadius: '10px', height: '100%' }}>
                {this.props.accounts.map((value, index) => {
                    if (value.accountType === "Savings") {
                        return (
                            // <div key={index} className="card_savings" style={{ backgroundImage: `url(images/accountsCard/accounts-card@3x.png)` }}>
                            <div key={value.accountNumber} className="card_savings" style={{ background: '#2d8259' }}>
                                <div >
                                    <div className="saving_label_account_name" style={{ marginBottom: '5px' }}>{value.accountName}</div>
                                    <div className="saving_label_account_number">{this.manipulateAccountNumber(value.accountNumber)}</div>
                                </div>
                                <div className="saving_sub_label_conatiner">
                                    <div className="saving_sub_label_individual_conatiner">
                                        <div className="saving_sub_lable_heading" style={{ marginBottom: '5px' }}>Available Balance</div>
                                        <div className="saving_sub_lable_value">£ {this.numberWithCommas(value.availableBalance)}</div>
                                    </div>
                                    <div >
                                        <div className="saving_sub_lable_heading" style={{ marginBottom: '5px' }}>Interest Rate</div>
                                        <div className="saving_sub_lable_value">{value.interestRate}%</div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    else if (value.accountType === "Current") {
                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 15px' }} className="cardCurrentContainer">
                                <div key={index} className="card_current">
                                    <div className="current_sub_label_individual_conatiner">
                                        <div className="current_sub_lable_heading" style={{ marginBottom: '10px' }}>{value.accountName}</div>
                                        <div className="current_sub_lable_value">{this.manipulateAccountNumber(value.accountNumber)}</div>
                                    </div>
                                    <div>
                                        <div className="current_sub_lable_value_2">£ {this.numberWithCommas(value.availableBalance)}</div>
                                    </div>
                                </div>
                                <div className="cardCurrent_bottomBorder"></div>
                            </div>
                        )
                    }
                })}
            </div>
        )
    }
}