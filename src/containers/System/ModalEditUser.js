import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash'

class ModalEditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            address: ''
        }
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
        let arrInput = ["email", "firstName", "lastName", "address"];
        for(let i = 0; i < arrInput.length; i++) {
            if(!this.state[arrInput[i]]) {
                isValid = false;
                alert("Missing parrameter: " + arrInput[i]);
                break;
            }
        } 

        return isValid;
    }

    handleSaveNewUser = () => {
        //validate info before push req
        let isValid = this.checkValidate()
        if(isValid) {
            //calll API create
            this.props.editUser(this.state)
        }

    }

    componentDidMount() {
        const { user } = this.props
        console.log(user)
        if(user && !_.isEmpty(user)) {
            this.setState({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address
            })
        }
    }

    render() {
        const { isOpen, toggle } = this.props
        const { email, firstName, lastName, address } = this.state
        return (
            <Modal 
                isOpen={isOpen} 
                toggle={toggle} 
                className={"modal-user-container"}
                size="lg"
                centered
            >
                <ModalHeader toggle={toggle}>Edit a user</ModalHeader>
                <ModalBody>
                    <div className="modal-user-body">
                        <div className="input-container">
                            <label>Email</label>
                            <input 
                                name="email"
                                type="text"
                                onChange={this.handleUpdateInput}
                                value={email}
                                disabled
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
                <Button color="primary" className="px-3" onClick={this.handleSaveNewUser}>Submit</Button>{' '}
                <Button color="secondary" className="px-3" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default ModalEditUser