import React from 'react';
import './style.css';

export default class InterInfoCard extends React.Component {
    constructor(props) {
        InterInfoCard
        super(props);
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
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 15px' }} className="cardCurrentContainer">
                            <div key={index} className="card_current">
                                <div className="current_sub_label_individual_conatiner">
                                    <div className="current_sub_lable_heading" style={{ marginBottom: '10px' }}>{value.name}</div>
                                    <div className="current_sub_lable_value">{this.manipulateAccountNumber(value.account.accountNumber)}</div>
                                </div>
                                <div>
                                    <div className="current_sub_lable_value_2">£ {this.numberWithCommas(value.account.availableBalance)}</div>
                                </div>
                            </div>
                            <div className="cardCurrent_bottomBorder"></div>
                        </div>
                    )
                })}
            </div>
        )
    }
}