import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/index'


const intitState = {
    email: '',
    password: '', 
    firstName: '',
    lastName: '',
    address: '',
} 
class ModalUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...intitState
        }
        this.listenToEmitter();
    }

    listenToEmitter = () => {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                ...intitState
            })
        })

    }

    handleUpdateInput = (e) => {
        const { name, value } = e.target
        let copyState = { ...this.state }
        copyState[name] = value
        this.setState({
            ...copyState
        })
    }

    checkValidate = () => {
        let isValid = true;
        let arrInput = ["email", 'password', "firstName", "lastName", "address"];
        for(let i = 0; i < arrInput.length; i++) {
            if(!this.state[arrInput[i]]) {
                isValid = false;
                alert("Missing parrameter: " + arrInput[i]);
                break;
            }
        } 

        return isValid;
    }

    handleAddNewUser = () => {
        //validate info before push req
        let isValid = this.checkValidate()
        if(isValid) {
            //calll API create
            this.props.createNewUser(this.state)
        }

    }

    componentDidMount() {
    }

    render() {
        const { isOpen, toggle } = this.props
        const { email, password, firstName, lastName, address } = this.state
        return (
            <Modal 
                isOpen={isOpen} 
                toggle={toggle} 
                className={"modal-user-container"}
                size="lg"
                centered
            >
                <ModalHeader toggle={toggle}>Create user</ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container">
                            <label>Email</label>
                            <input 
                                name="email"
                                type="text"
                                onChange={this.handleUpdateInput}
                                value={email}
                            />
                        </div>
                        <div className="input-container">
                            <label>Password</label>
                            <input 
                                type="password"
                                name="password"
                                onChange={this.handleUpdateInput}
                                value={password}
                            />
                        </div>
                        <div className="input-container">
                            <label>First name</label>
                            <input 
                                type="text"
                                name="firstName"
                                onChange={this.handleUpdateInput}
                                value={firstName}
                            />
                        </div>
                        <div className="input-container">
                            <label>Last name</label>
                            <input 
                                type="text"
                                name="lastName"
                                onChange={this.handleUpdateInput}
                                value={lastName}
                            />
                        </div>
                        <div className="input-container max-width-input">
                            <label>Address</label>
                            <input 
                                type="text"
                                name="address"
                                value={address}
                                onChange={this.handleUpdateInput}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                <Button color="primary" className="px-3" onClick={this.handleAddNewUser}>Add new</Button>{' '}
                <Button color="secondary" className="px-3" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default ModalUser