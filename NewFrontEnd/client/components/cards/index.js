import React from 'react';
import './style.css';

export default class Cards extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props.accounts,"Cards");
    }

    render(){
        return(
            <div className="card">
                {this.props.accounts.map((value,index) =>{
                    if(value.accountType==="Savings"){
                        return(
                            <div key={index} className="card_savings">
                               <div >
                                    <span className="saving_label_account_name">{value.accountName}</span>
                                    <br/>
                                    <span className="saving_label_account_number">{value.accountNumber}</span>
                                </div>
                                <div className="saving_sub_label_conatiner">
                                    <div className="saving_sub_label_individual_conatiner">
                                        <span className="saving_sub_lable_heading">Available Balance</span>
                                        <br/>
                                        <span className="saving_sub_lable_value">£ {value.availableBalance}</span>
                                    </div>
                                    <div >
                                        <span className="saving_sub_lable_heading">Interest Rate</span>
                                        <br/>
                                        <span className="saving_sub_lable_value">{value.interestRate}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    else if(value.accountType==="Current"){
                        return(
                            <div key={index} className="card_current">
                                    <div className="current_sub_label_individual_conatiner">
                                        <span className="current_sub_lable_heading">{value.accountName}</span>
                                        <br/>
                                        <span className="current_sub_lable_value">{value.accountNumber}</span>
                                    </div>
                                    <div>
                                        <span className="current_sub_lable_value_2">£ {value.availableBalance}</span>
                                    </div>
                            </div>
                        )
                    }
                })}
            </div>
        )
    }
}