import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class ConductTransaction extends Component {
    state = {
        recipient: '',
        amount: 0
    }

    updateRecipient = (e) => {
        const { value } = e.target;
        this.setState({
            recipient: value
        });
    }

    updateAmount = (e) => {
        const { value } = e.target;

        this.setState({
            amount: Number(value)
        });
    }

    conductTransaction = () => {
        const { recipient, amount } = this.state;

        fetch(`${document.location.origin}/api/transact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recipient, amount })
        }).then((res) => res.json())
            .then((json) => {
                alert(json.message || json.type);
                history.push('/transaction-pool');
            });
    }

    render() {
        return (
            <div className="ConductTransaction">
                <Link to='/'>Home</Link>
                <h3>Conduct a Transaction</h3>
                <FormGroup>
                    <FormControl
                        input='text'
                        placeholder='recipient'
                        value={this.state.recipient}
                        name='recipient'
                        onChange={(e) => this.updateRecipient(e)}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControl
                        input='number'
                        placeholder='amount'
                        name='amount'
                        value={this.state.amount}
                        onChange={(e) => this.updateAmount(e)}
                    />
                </FormGroup>
                <div>
                    <Button
                        bsStyle="danger"
                        onClick={this.conductTransaction}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        )
    }
}

export default ConductTransaction;