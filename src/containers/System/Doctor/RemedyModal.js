import React, { Component } from 'react';
import { connect } from "react-redux";
import './RemedyModal.scss'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl'
import { CommonUtils, LANGUAGES } from '../../../utils';

class RemedyModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            imageB64: ''
        }
    }

    async componentDidMount() {
        const { dataModal } = this.props
        if (dataModal) {
            this.setState({
                email: dataModal.email
            })
        }
    }

    async componentDidUpdate(prevProps) {
        const { dataModal } = this.props
        if (prevProps.dataModal !== dataModal) {
            this.setState({
                email: dataModal.email
            })
        }

    }

    handleChangeImg = async (e) => {
        if (e) {
            let file = e.target.files[0]

            //encode user image
            let b64 = await CommonUtils.getBase64(file)
            this.setState({
                imageB64: b64,
            })
        }
    }


    handleChangeText = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    handleSendRemedy = () => {
        this.props.handleSendBill(this.state)
    }
    render() {
        const { isOpen, toggle, language } = this.props
        const { email } = this.state

        return (
            <Modal
                isOpen={isOpen}
                toggle={toggle}
                className="booking-modal-container"
                size="md"
                centered
            >
                <ModalHeader toggle={toggle}>
                    {
                        language === LANGUAGES.VI ? "ĐƠN THUỐC" : "REMEDY"
                    }
                </ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-6 form-group">
                            <label>
                                <FormattedMessage id="manage-user.email" />
                            </label>
                            <input type="email" className="form-control" value={email} onChange={this.handleChangeText} />
                        </div>

                        <div className="col-6 form-group">
                            <label>
                                {
                                    language === LANGUAGES.VI ? "Chọn tệp" : "Choose a file"
                                }
                            </label>
                            <input
                                type="file"
                                className="form-control-file"
                                onChange={this.handleChangeImg} />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.handleSendRemedy}>
                        <FormattedMessage id="manage-patient.bill" />
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>
                        <FormattedMessage id="modal-booking.cancel" />
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);