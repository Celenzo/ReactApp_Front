import React from 'react';

import NewConv from '../newConv/newConv';
import NewMsg from '../newMsg/newMsg';
import ConvList from '../convList/convList';
import CloseConv from '../closeConv/closeConv';

//Styling
import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//Bootstrap elements
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

//Toast messages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messageList: [],
            convListItems: [],
            selectedConvId: '',
            listView: false
        }

        this.loadMessages = this.loadMessages.bind(this);

        //Event receivers
        this.onConvListAdd = this.onConvListAdd.bind(this);
        this.onNewMsgPost = this.onNewMsgPost.bind(this);
        this.onConvListUpdate = this.onConvListUpdate.bind(this);
        this.onConvClosed = this.onConvClosed.bind(this);
        this.onListViewSwitch = this.onListViewSwitch.bind(this);

        //Error toast generator
        this.notifyError = this.notifyError.bind(this);
    }

    notifyError(err) {
        toast.error(`Erreur: ${err}`, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true
        });
    }

    onListViewSwitch() {
        this.setState({ listView: !this.state.listView });

        console.log(this.state.listView)
    }

    onConvListUpdate(elems) {
        this.setState({ convListItems: elems });
    }

    onNewMsgPost(newMsg) {
        this.setState(prevState => ({
            messageList: [...prevState.messageList, newMsg]
        }));
    }

    onConvListAdd(newConv) {
        this.setState(prevState => ({
            convListItems: [...prevState.convListItems, newConv]
        }));
    }

    onConvClosed() {
        const newConvList = this.state.convListItems.filter(conv => conv.id !== this.state.selectedConvId);
        this.setState(prevState => ({
            convListItems: newConvList
        }));
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
                this.notifyError(err);
            });
    }


    render() {
        const { messageList, selectedConvId, convListItems, listView } = this.state;
        
        if (listView) {
            return (
                <div className='appWrapper'>
                    <ToastContainer></ToastContainer>
                    <ConvList loadMessages={this.loadMessages} selectedConvId={selectedConvId} notifyError={this.notifyError}
                        convListItems={convListItems} onConvListUpdate={this.onConvListUpdate} listView={listView}></ConvList>
                    <Button variant='outline-secondary' key='listViewBtn' className='listViewBtn' id='listViewBtn' onClick={this.onListViewSwitch}>Vue Liste</Button>
                    <div className='messageListWrapper'>
                        <ListGroup  className='msgList' variant='flush'>
                            { messageList.map(msgElem => <ListGroup.Item key={msgElem.id} id={msgElem.id}>{msgElem.msg}</ListGroup.Item>) }
                        </ListGroup>
                    </div>
                </div>
            )
        }

        return (
            <div className='appWrapper'>

                <ToastContainer></ToastContainer>
                <NewConv onConvListAdd={this.onConvListAdd} notifyError={this.notifyError}></NewConv>
                <ConvList loadMessages={this.loadMessages} selectedConvId={selectedConvId} notifyError={this.notifyError}
                    convListItems={convListItems} onConvListUpdate={this.onConvListUpdate}></ConvList>
                <CloseConv notifyError={this.notifyError} selectedConvId={selectedConvId} onConvClosed={this.onConvClosed}></CloseConv>
                <Button variant='outline-secondary' key='listViewBtn' className='listViewBtn' id='listViewBtn' onClick={this.onListViewSwitch}>Vue Liste</Button>
                
                <div className='messageListWrapper'>
                    <ListGroup  className='msgList' variant='flush'>
                        { messageList.map(msgElem => <ListGroup.Item key={msgElem.id} id={msgElem.id}>{msgElem.msg}</ListGroup.Item>) }
                    </ListGroup>
                    <NewMsg onNewMsgPost={this.onNewMsgPost} notifyError={this.notifyError} selectedConvId={ selectedConvId }></NewMsg>
                </div>
                
            </div>
        )
    }
}

export default App;