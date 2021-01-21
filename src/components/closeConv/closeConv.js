import React from 'react';

//Styling
import './closeConv.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//Bootstrap elements
import Button from 'react-bootstrap/Button';

class CloseConv extends React.Component {

    constructor(props) {
        super(props);
        this.closeConv = this.closeConv.bind(this);
    }

    closeConv() {

        const { selectedConvId, notifyError, onConvClosed } = this.props;

        if (selectedConvId === "") {
            notifyError(`Aucune conversation n'est sélectionnée`);
            return false;
        }

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ convid: selectedConvId, status: false })
        }
        fetch(`http://0.0.0.0:8568/conversations/${selectedConvId}`, requestOptions)
            .then(res => res.json())
            .then(res => onConvClosed(), err => notifyError(err));

    }

    render() {
        return (
            <Button variant='danger' key='closeConvBtn' id='closeConvBtn' className="closeBtn" onClick={this.closeConv}>CLOSE</Button>
        )
    }
}

export default CloseConv;