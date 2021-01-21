import React from 'react';

//Styling
import './convList.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//Bootstrap elements
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';

class ConvList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    loadConv() {
        fetch("http://0.0.0.0:8568/conversations")
            .then(res => res.json())
            .then(res => {
                this.setState({ loading: false });
                this.props.onConvListUpdate(res);
            }, err => {
                this.props.notifyError(err);
            });
    }

    componentDidMount() {
        this.loadConv();
    }

    render() {
        
        const { convListItems, loadMessages, selectedConvId } = this.props;

        if (this.state.loading) return (
            <Spinner animation="border" role="status" className='sideBarWrapper loadingSpinner'>
                <span className="sr-only">Loading...</span>
            </Spinner>
        )

        return (
            <div className='sideBarWrapper'>
                <ListGroup> { convListItems.map(conv =>
                    <ListGroup.Item key={conv.id} id={conv.id} onClick={loadMessages} active={selectedConvId === conv.id ? true : false} >
                        {conv.name}
                    </ListGroup.Item>
                )} </ListGroup>
            </div>        
        )
    }
}

export default ConvList;