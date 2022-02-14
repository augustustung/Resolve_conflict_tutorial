import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils/constant';
import './ManagePatient.scss'
import { FormattedMessage } from 'react-intl'
import DatePicker from '../../../components/Input/DatePicker'
import { getAllPatient, sendEmailRemedyService } from '../../../services/userService'
import moment from 'moment'
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay-ts';
import { withRouter } from 'react-router'

class ManagePatient extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpen: false,
            dataModal: {},
            isLoading: true
        }
    }

    ArrayButton = [
        {
            name: <FormattedMessage id="feature.statistical" />,
            onClick: () => { }
        },
        {
            name: <FormattedMessage id="feature.export" />,
            onClick: () => { }
        },
        {
            name: <FormattedMessage id="feature.import" />,
            onClick: () => { }

        }
   ]

    async componentDidMount() {
        const { user } = this.props
        if (user.roleId === "R3") {
            this.props.history.replace('/home')
        } else {
            await this.getDataPatient()
        }
    }

    getDataPatient = async () => {
        const { user } = this.props
        const { currentDate, isLoading } = this.state
        const formattedDate = new Date(currentDate).getTime()
        let res = await getAllPatient(user.id, formattedDate)
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data,
                isLoading: isLoading ? false : isLoading
            })
        }
    }

    handleChangeDayPicker = (date) => {
        this.setState({ currentDate: date[0], isLoading: true })

        this.getDataPatient()

    }

    getValueByLanguage = (data, type) => {
        const { language } = this.props
        if (type === "PATIENT") {
            return language === LANGUAGES.VI ? `${data.lastName}  ${data.firstName}` : `${data.firstName} ${data.lastName}`
        }
        if (type === "VALUE") {
            return language === LANGUAGES.VI ? data.valueVi : data.valueEn
        }
    }

    handleConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            firstName: item.patientData.firstName,
            lastName: item.patientData.lastName
        }

        this.setState({
            dataModal: data,
            isOpen: true
        })
    }

    closeModal = () => {
        this.setState({ isOpen: false, dataModal: {} })
    }

    handleSendBill = async (dataFromChild) => {
        const { dataModal } = this.state
        this.setState({
            isLoading: true
        })
        let res = await sendEmailRemedyService({
            email: dataFromChild.email,
            file: dataFromChild.imageB64,
            patientId: dataModal.patientId,
            doctorId: dataModal.doctorId,
            timeType: dataModal.timeType,
            language: this.props.language,
            firstName: dataModal.firstName,
            lastName: dataModal.lastName,
        })

        if (res && res.errCode === 0) {
            toast.success(res.message)
            this.closeModal()
            this.setState({ isLoading: false })
            await this.getDataPatient()
        } else {
            toast.error(res.errMessage)
            this.setState({ isLoading: false })
        }
    }

    render() {
        const { currentDate, dataPatient, isOpen, dataModal, isLoading } = this.state
        const { language } = this.props
        return (
            <LoadingOverlay
                active={isLoading}
                spinner
                text={language === LANGUAGES.VI ? 'Đang gửi...' : 'Sending content...'}
            >
                <RemedyModal
                    isOpen={isOpen}
                    toggle={this.closeModal}
                    dataModal={dataModal}
                    handleSendBill={this.handleSendBill}
                />
                <div className="manage-patient-container">
                    <div className="m-p-title">
                        <FormattedMessage id="manage-patient.manage" />
                    </div>

                    <div className='m-p-body row'>
                        <div className="col-4 form-group">
                            <label>
                                <FormattedMessage id="manage-patient.select-date" />
                            </label>
                            <DatePicker
                                onChange={this.handleChangeDayPicker}
                                className="form-control"
                                value={currentDate}
                            />
                        </div>
                        <div className='col-8'>
                            <div className="row mt-4">
                                {
                                    this.ArrayButton.map(item => {
                                        return (
                                            <div className="col-12 col-md-2 mb-3">
                                                <button onClick={item.onClick} className="custom-button">
                                                    {item.name}
                                                </button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="col-12 table-manage-patient">
                            <table style={{ width: "100%" }}>
                                <tbody>
                                    <tr>
                                        <th>STT</th>
                                        <th><FormattedMessage id="manage-patient.fullname" /></th>
                                        <th><FormattedMessage id="manage-user.address" /></th>
                                        <th><FormattedMessage id="manage-patient.time" /></th>
                                        <th><FormattedMessage id="manage-patient.gender" /></th>
                                        <th><FormattedMessage id="manage-patient.date" /></th>
                                        <th><FormattedMessage id="manage-user.reason" /></th>
                                        <th><FormattedMessage id="manage-patient.actions" /></th>
                                    </tr>
                                    {
                                        dataPatient && dataPatient.length > 0 ? dataPatient.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{this.getValueByLanguage(item.patientData, "PATIENT")}</td>
                                                    <td>{item.patientData.address}</td>
                                                    <td>{this.getValueByLanguage(item.timeData, "VALUE")}</td>
                                                    <td>{this.getValueByLanguage(item.patientData.genderData, "VALUE")}</td>
                                                    <td>{item.patientData.birthday}</td>
                                                    <td>{item.reason}</td>
                                                    <td>
                                                        <button
                                                            className="mp-btn-confirm"
                                                            onClick={() => this.handleConfirm(item)}
                                                        >
                                                            <FormattedMessage id="manage-patient.confirm" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        }) :
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: "center" }}>
                                                    <FormattedMessage id="patient.detail-doctor.none-schedule" />
                                                </td>
                                            </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManagePatient));
