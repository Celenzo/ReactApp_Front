import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



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
                convListItems: [...prevState.convListItems, res]
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
                messageList: [...prevState.messageList, res]
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
        if (error) return <div>Error: { error.message } </div>
        if (loading) return <div>Chargement...</div>
        return (
            <div>
                <div>
                    <input type='text' id='convNameInput' value={this.newConvInputValue} onChange={this.handleConvNameInputChange}></input>
                    <button key='newConvBtn' id='newConvBtn' onClick={this.newConv}>NEW</button>
                </div>
                <button key='closeConvBtn' id='closeConvBtn' onClick={this.closeConv}>CLOSE</button>
                <ul>
                    { convListItems.map(conv => <li key={conv.id} id={conv.id} onClick={this.loadMessages}>{conv.name}</li>) }
                </ul>
                <ul>
                    { messageList.map(msgElem => <li key={msgElem.id} id={msgElem.id}>{msgElem.msg}</li>) }
                </ul>
                <div>
                    <input type='text' id='messageInput' value={this.msgInputValue} onChange={this.handleMessageInputChange}></input>
                    <button key='newMsgBtn' id='newMsgBtn' onClick={this.sendMsg}>SEND</button>
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
  