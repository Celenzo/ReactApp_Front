import React from 'react';

//Styling
import './newMsg.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//Bootstrap elements
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class NewMsg extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            msgInputValue: ''
        }
        this.sendMsg = this.sendMsg.bind(this);
        this.handleMessageInputChange = this.handleMessageInputChange.bind(this);
    }

    handleMessageInputChange(event) {
        this.setState({ msgInputValue: event.target.value })
    }

    sendMsg(event) {

        event.preventDefault();

        const { notifyError, selectedConvId, onNewMsgPost } = this.props;
        const { msgInputValue } = this.state;

        //Erreur si pas de conversation sélectionnée
        if (selectedConvId === '') {
            notifyError(`Aucune conversation n'est sélectionnée`);
            return false;
        }

        //Erreur si aucun message
        if (msgInputValue === '') {
            notifyError(`Aucun message valide à envoyer`);
            return false;
        }

        //Erreur si message trop long (basé sur la colonne de la base de données)
        if (msgInputValue.length > 1024) {
            notifyError(`La longueur maximale est de 1024 caractères`);
            return false;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ msg: msgInputValue })
        };

        this.setState({ msgInputValue: '' });

        fetch(`http://0.0.0.0:8568/conversations/${selectedConvId}`, requestOptions)
            .then(res => res.json())
            .then(res => onNewMsgPost(res), err => notifyError(err));
    }

    render() {
        return (
            <div className='newMsgFormWrapper'>
                <Form>
                    <Form.Control as='textarea' rows={4} type='text' id='messageInput' className='msgInput' value={this.state.msgInputValue} onChange={this.handleMessageInputChange}></Form.Control>
                    <Button type='submit' key='newMsgBtn' id='newMsgBtn' className='sendBtn' onClick={this.sendMsg}>SEND</Button>
                </Form>
            </div>
        )
    }
}

export default NewMsg;