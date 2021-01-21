import React from 'react';

//Styling
import './newConv.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//Bootstrap elements
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class NewConv extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            newConvInputValue: ''
        }
        this.handleConvNameInputChange = this.handleConvNameInputChange.bind(this);
        this.newConv = this.newConv.bind(this);
    }

    handleConvNameInputChange(event) {
        this.setState({ newConvInputValue: event.target.value });
    }
    
    newConv(event) {

        event.preventDefault();

        const { newConvInputValue } = this.state;
        const { notifyError, onConvListAdd } = this.props;
 
        if (newConvInputValue === '') {
            notifyError('Merci de saisir un nom');
            return false;
        }

        if (newConvInputValue.length > 64) {
            notifyError(`Le nom d'une conversation ne peut pas dépasser 64 caractères`);
            return false;
        }

        this.setState({
            newConvInputValue: ''
        });

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newConvInputValue })
        };
        fetch('http://0.0.0.0:8568/conversations', requestOptions)
            .then(res => res.json())
            .then(res => onConvListAdd(res), err => notifyError(err));
    }

    render() {
        return (
            <div className='newConvWrapper'>
                <Form>
                    <Form.Control type='text' id='convNameInput' className='newConvInput' value={this.state.newConvInputValue} onChange={this.handleConvNameInputChange}></Form.Control>
                    <Button type='submit' variant='outline-primary' key='newConvBtn' id='newConvBtn' className='newConvBtn' onClick={this.newConv}>NEW</Button>
                </Form>
            </div>
        )
    }

    

}

export default NewConv;