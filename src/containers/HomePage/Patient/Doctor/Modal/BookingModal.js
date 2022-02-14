import React, { Component } from 'react';
import { connect } from "react-redux";
import './BookingModal.scss'
import { Modal } from 'reactstrap';
import { FormattedMessage } from 'react-intl'
import ProfileDoctor from '../ProfileDoctor';
import * as actions from '../../../../../store/actions'
import { LANGUAGES } from '../../../../../utils';
import Select from 'react-select'
import { editUser, postBookingAppointment } from '../../../../../services/userService'
import { toast } from 'react-toastify';
import _ from 'lodash';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay-ts';

class BookingModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            firstName: "",
            lastName: '',
            phoneNumber: '',
            email: "",
            address: "",
            reason: '',
            birthday: "",
            gender: "",
            selectedGender: "",
            timeType: '',
            listGender: [],
            isLoading: false
        }
    }

    async componentDidMount() {
        await this.props.fetchGender()
        const { user, genders } = this.props

        if (user && !_.isEmpty(user)) {
            this.setState({
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                address: user.address,
                birthday: user.birthday,
                selectedGender: this.buildFirstGenderSelect(genders)
            })
        }
    }

    async componentDidUpdate(prevProps) {
        const { genders, language, dataSchedule } = this.props
        if (prevProps.genders !== genders) {
            this.setState({
                listGender: this.buildDataGender(genders),
                timeType: dataSchedule.timeType,
                selectedGender: this.buildFirstGenderSelect(genders)
            })

        }

        if (language !== prevProps.language) {
            this.setState({
                listGender: this.buildDataGender(genders)
            })
        }
    }

    buildFirstGenderSelect = (genders) => {
        const { language, user } = this.props
        if (user && !_.isEmpty(user)) {
            let result = {}
            for (let i = 0; i < genders.length; i++) {
                if (genders[i].keyMap === user.gender) {
                    result.value = genders[i].keyMap;
                    result.label = language === LANGUAGES.VI ? genders[i].valueVi : genders[i].valueEn
                    break
                }
            }

            return result
        } else {
            return {
                label: genders[0].label,
                value: genders[0].keyMap
            }
        }
    }

    onChangeText = (e) => {
        const { value, name } = e.target
        let copyState = this.state
        copyState[name] = value
        this.setState({ ...copyState })
    }

    buildDataGender = (data) => {
        const { language } = this.props

        let result = []

        if (data && data.length > 0) {
            data.map(item => {
                let obj = {}
                obj.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn
                obj.value = item.keyMap
                result.push(obj)

                return item
            })
        }

        return result
    }

    handleChangeSelect = async (selectedGender) => {
        this.setState({ selectedGender })
    }

    validateInput = () => {
        const valid = [
            "firstName",
            "lastName",
            "phoneNumber",
            "email",
            "address",
            "reason",
            "birthday",
            "selectedGender",
            "timeType",
        ]

        for (let i = 0; i < valid.length; i++) {
            if (!this.state[valid[i]]) {
                toast.warn("You must fill in input " + valid[i])
                return false
            }
        }

        return true
    }

    handleSubmit = async () => {
        const {
            firstName,
            lastName,
            phoneNumber,
            email,
            address,
            reason,
            birthday,
            selectedGender,
            timeType
        } = this.state

        const { dataSchedule, language } = this.props

        if (!this.validateInput()) return
        this.setState({
            isLoading: true
        })

        let formattedDate = new Date(birthday).getTime()
        let timeString = this.buildTimeBooking(dataSchedule)
        let doctorName = this.buildDoctorName(dataSchedule)
        const dataUser = {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            address: address,
            reason: reason,
            date: dataSchedule.date,
            birthday: formattedDate,
            doctorId: this.props.doctorId,
            gender: selectedGender.value,
            timeType: timeType,
            language: language,
            timeString: timeString,
            doctorName: doctorName
        }

        let res = await postBookingAppointment(dataUser)
        if (this.props.isLoggedIn) {
            editUser({
                ...dataUser,
                birthday: birthday,
                id: this.props.user.id
            })
            this.props.updateUserInfo({
                ...dataUser,
                birthday: birthday
            })
        }

        if (res && res.errCode === 0) {
            toast.success(res.message)
            this.props.toggle()
            this.setState({
                isLoading: false
            })
        }
        else {
            toast.error(res.errMessage)
            this.setState({
                isLoading: false
            })
        }
    }

    buildTimeBooking = (dataTime) => {
        const { language } = this.props

        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY") :
                moment.unix(+dataTime.date / 1000).locale('en').format("ddd - YYYY/MM/DD")
            return `${time} - ${date}`
        }

        return ""
    }


    buildDoctorName = (dataName) => {
        const { language } = this.props
        if (dataName && !_.isEmpty(dataName)) {
            let name = language === LANGUAGES.VI ?
                `${dataName.doctorData.lastName} ${dataName.doctorData.firstName}` :
                `${dataName.doctorData.firstName} ${dataName.doctorData.lastName}`
            return name
        }
        return ''
    }

    render() {
        const { isOpen, toggle, dataSchedule, doctorId, language } = this.props
        const {
            firstName,
            lastName,
            phoneNumber,
            email,
            address,
            reason,
            birthday,
            listGender,
            selectedGender,
            isLoading
        } = this.state

        return (
            <LoadingOverlay
                active={isLoading}
                spinner
                text={language === LANGUAGES.VI ? 'Đang gửi...' : 'Sending content...'}
            >
                <Modal
                    isOpen={isOpen}
                    toggle={toggle}
                    className="booking-modal-container"
                    size="lg"
                    centered
                >
                    <div className="booking-modal-content">
                        <div className="booking-modal-header">
                            <span className="left">
                                <FormattedMessage id="modal-booking.booking" />
                            </span>

                            <span className="right" onClick={toggle}>
                                <i className="fas fa-times" />
                            </span>
                        </div>

                        <div className="booking-modal-body container">
                            <div className="doctor-info">
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    isShowDoctorDescription={false}
                                    dataTime={dataSchedule}
                                    isShowLink={false}
                                    isShowPrice={true}
                                />
                            </div>

                            <div className='row'>
                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="manage-user.last-name" />
                                    </label>
                                    <input
                                        className="form-control"
                                        name="lastName"
                                        value={lastName}
                                        onChange={this.onChangeText}
                                    />
                                </div>

                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="manage-user.first-name" />
                                    </label>
                                    <input
                                        className="form-control"
                                        name="firstName"
                                        value={firstName}
                                        onChange={this.onChangeText}
                                    />
                                </div>

                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="manage-user.phone-number" />
                                    </label>
                                    <input
                                        className="form-control"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        onChange={this.onChangeText}
                                    />
                                </div>

                                <div className="col-6 form-group">
                                    <label>Email</label>
                                    <input
                                        className="form-control"
                                        name="email"
                                        value={email}
                                        onChange={this.onChangeText}
                                    />
                                </div>

                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="manage-user.address" />
                                    </label>
                                    <input
                                        className="form-control"
                                        name="address"
                                        value={address}
                                        onChange={this.onChangeText}
                                    />
                                </div>

                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="manage-user.gender" />
                                    </label>
                                    <Select
                                        value={selectedGender}
                                        onChange={this.handleChangeSelect}
                                        options={listGender}
                                    />
                                </div>

                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="manage-user.birthday" />
                                    </label>
                                    <input
                                        className="form-control"
                                        name="birthday"
                                        value={birthday}
                                        onChange={this.onChangeText}
                                    />
                                </div>

                                <div className="col-6 form-group">
                                    <label>
                                        <FormattedMessage id="manage-user.reason" />
                                    </label>
                                    <input
                                        className="form-control"
                                        name="reason"
                                        value={reason}
                                        onChange={this.onChangeText}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="booking-modal-footer">
                            <button className="btn-confirm" onClick={this.handleSubmit}>
                                <FormattedMessage id="modal-booking.submit" />
                            </button>

                            <button className="btn-cancel" onClick={toggle}>
                                <FormattedMessage id="modal-booking.cancel" />
                            </button>
                        </div>
                    </div>
                </Modal>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        user: state.user.userInfo,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGender: () => dispatch(actions.fetchGenderStart()),
        updateUserInfo: (data) => dispatch(actions.updateUserInfo(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
