import React from 'react';
import ReactDOM from 'react-dom';

//Styling
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//Bootstrap elements
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
 
class ConvList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: true,
            convListItems: [],
            messageList: [],
            selectedConvId: "",
            newConvInputValue: "",
            msgInputValue: ""
        }
        this.loadMessages = this.loadMessages.bind(this);
        this.newConv = this.newConv.bind(this);
        this.handleConvNameInputChange = this.handleConvNameInputChange.bind(this);
        this.closeConv = this.closeConv.bind(this);
        this.sendMsg = this.sendMsg.bind(this);
        this.handleMessageInputChange = this.handleMessageInputChange.bind(this);
    }

    loadMessages(event) {
        const id = event.target.id;
        fetch(`http://0.0.0.0:8568/conversations/${id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    selectedConvId: id,
                    messageList: res
                });
            }, err => {
                this.setState({
                    error: err
                })
            });
    }

    loadConv() {
        fetch("http://0.0.0.0:8568/conversations")
            .then(res => res.json())
            .then(res => {
                this.setState({
                    convListItems: res,
                    loading: false
                })
            }, err => {
                this.setStatet({
                    error: err,
                    loading: false
                })
            });
    }

    closeConv() {
        if (this.state.selectedConvId === "") {
            //Add error message
            return false;
        }

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ convid: this.state.selectedConvId, status: false })
        }
        fetch(`http://0.0.0.0:8568/conversations/${this.state.selectedConvId}`, requestOptions)
            .then(response => response.json())
            .then(res => {
                this.loadConv();
            }, err => {
                this.error = err;
            });

    }

    newConv() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: this.state.newConvInputValue })
        };
        fetch('http://0.0.0.0:8568/conversations', requestOptions)
            .then(response => response.json())
            .then(res => this.setState(prevState => ({
                convListItems: [...prevState.convListItems, res],
                newConvInputValue: ''
            })), err => {
                this.error = err;
            });
    }

    sendMsg() {

        if (this.state.msgInputValue === '' || this.state.selectedConvId === '') {
            //Add error message
            return false;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ msg: this.state.msgInputValue })
        };

        fetch(`http://0.0.0.0:8568/conversations/${this.state.selectedConvId}`, requestOptions)
            .then(res => res.json())
            .then(res => this.setState(prevState => ({
                messageList: [...prevState.messageList, res],
                msgInputValue: ''
            })));
    }

    handleConvNameInputChange(event) {
        this.setState({ newConvInputValue: event.target.value });
    }

    handleMessageInputChange(event) {
        this.setState({ msgInputValue: event.target.value })
    }

    componentDidMount() {
        this.loadConv();
    }

    render() {
        const { error, loading, convListItems, messageList } = this.state;
        
        if (error) return (
            <Toast>
                <Toast.Header><strong className="mr-auto">Error</strong></Toast.Header>
                <Toast.Body>An error has occured: {this.state.error}</Toast.Body>
            </Toast>
        )

        if (loading) return (
            <Spinner animation="border" role="status" className='loadingSpinner'>
                <span className="sr-only">Loading...</span>
            </Spinner>
        )
        
        return (
            <div className='appWrapper'>

                <div className='newConvWrapper'>
                    <Form.Control type='text' id='convNameInput' className='newConvInput' value={this.newConvInputValue} onChange={this.handleConvNameInputChange}></Form.Control>
                    <Button variant='outline-primary' key='newConvBtn' id='newConvBtn' className='newConvBtn' onClick={this.newConv}>NEW</Button>
                </div>

                <div className='sideBarWrapper'>
                    <ListGroup> { convListItems.map(conv =>
                        <ListGroup.Item key={conv.id} id={conv.id} onClick={this.loadMessages} active={this.state.selectedConvId === conv.id ? true : false} >
                            {conv.name}
                        </ListGroup.Item>
                    )} </ListGroup>
                </div>

                <div className='messageListWrapper'>
                    <Button variant='danger' key='closeConvBtn' id='closeConvBtn' className="closeBtn" onClick={this.closeConv}>CLOSE</Button>
                    <ListGroup  className='msgList' variant='flush'>
                        { messageList.map(msgElem => <ListGroup.Item key={msgElem.id} id={msgElem.id}>{msgElem.msg}</ListGroup.Item>) }
                    </ListGroup>
                    <div className='newMsgFormWrapper'>
                        <Form.Control as='textarea' rows={4} type='text' id='messageInput' className='msgInput' value={this.msgInputValue} onChange={this.handleMessageInputChange}></Form.Control>
                        <Button key='newMsgBtn' id='newMsgBtn' className='sendBtn' onClick={this.sendMsg}>SEND</Button>
                    </div>
                </div>

            </div>
        )
    }
}



  // ========================================
  
ReactDOM.render(
    <ConvList />,
    document.getElementById('root')
);
  