import React, { Component } from 'react';
import { connect } from "react-redux";
import "./ManageSchedule.scss"
import { FormattedMessage } from 'react-intl'
import Select from 'react-select'
import { LANGUAGES } from '../../../utils'
import * as actions from '../../../store/actions'
import DatePicker from '../../../components/Input/DatePicker'
import { toast } from 'react-toastify'
import { saveBulkSchedule } from '../../../services/userService'
import { withRouter } from 'react-router';

class ManageSchedule extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedDoctor: null,
            listDoctos: [],
            currentDate: '',
            allSchedule: []
        }
    }

    async componentDidMount() {
        const { patientMenuPath, user } = this.props
        if (user && user.roleId === "R3")
            this.props.history.replace(patientMenuPath)
        else {
            await this.props.fetchALLDoctor()
            await this.props.fetchAllcodeSchedule()
        }
    }

    componentDidUpdate(prevProps) {
        const { allDoctors, language, allScheduleTime } = this.props
        if (prevProps.allDoctors !== allDoctors) {
            let dataSelect = this.buildInputDataSelect(allDoctors)
            this.setState({
                listDoctos: dataSelect
            })
        }

        if (prevProps.language !== language) {
            let dataSelect = this.buildInputDataSelect(allDoctors)
            this.setState({
                listDoctos: dataSelect
            })
        }

        if (prevProps.allScheduleTime !== allScheduleTime) {
            let data = allScheduleTime
            if (data && data.length > 0) {
                data = data.map((item) => ({
                    ...item,
                    isSelected: false
                }))
            }
            this.setState({
                allSchedule: data
            })
        }
    }

    handleChangeSelect = (selectedDoctor) => {
        this.setState({ selectedDoctor })
    }

    buildInputDataSelect = (data) => {
        const { language } = this.props
        let result = [];

        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let obj = {}

                let labelVi = `${data[`${i}`].lastName} ${data[`${i}`].firstName}`
                let labelEn = `${data[`${i}`].firstName} ${data[`${i}`].lastName}`

                obj.label = language === LANGUAGES.VI ? labelVi : labelEn
                obj.value = data[`${i}`].id

                result.push(obj)
            }
        }
        return result;
    }

    handleChangeDayPicker = (date) => {
        this.setState({ currentDate: date[0] })
    }

    onHandleChoose = (item) => {
        const { allSchedule } = this.state
        if (allSchedule && allSchedule.length > 0) {
            let copySchedule = allSchedule
            copySchedule = allSchedule.map(i => {
                if (i.id === item.id) {
                    i.isSelected = !item.isSelected
                }

                return i
            })

            this.setState({
                allSchedule: copySchedule
            })
        }
    }

    handleSubmit = async () => {
        const { allSchedule, selectedDoctor, currentDate } = this.state
        let result = []

        if (!currentDate) {
            toast.warn("Please choose date you want!")
            return
        }

        if (selectedDoctor && selectedDoctor.length > 0) {
            toast.warn("Please choose a doctor you want!")
            return
        }

        let formatedDate = new Date(currentDate).getTime()
        if (allSchedule && allSchedule.length > 0) {
            let selectedTime = allSchedule.filter(item => item.isSelected === true)
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(time => {
                    let obj = {}
                    obj.doctorId = selectedDoctor.value
                    obj.date = formatedDate
                    obj.timeType = time.keyMap

                    result.push(obj)
                    return obj
                })
            } else {
                toast.warn("Invalid selected time!")
                return
            }
        }

        let res = await saveBulkSchedule({
            doctorId: selectedDoctor.value,
            formatedDate: formatedDate,
            arrSchedule: result
        })
        if (res && res.errCode === 0) {
            toast.success(res.message)
        } else {
            toast.error(res.errMessage)
        }
    }

    render() {
        const { selectedDoctor, listDoctos, currentDate, allSchedule } = this.state
        const { language } = this.props
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))

        return (
            <div className="manage-schedule-container">
                <div className="m-s-title">
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-6 form-group">
                            <label>
                                <FormattedMessage id="manage-schedule.select-doctor" />
                            </label>
                            <Select
                                value={selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={listDoctos}
                            />
                        </div>

                        <div className="col-6 form-group">
                            <label>
                                <FormattedMessage id="manage-schedule.select-day" />
                            </label>
                            <DatePicker
                                onChange={this.handleChangeDayPicker}
                                className="form-control"
                                value={currentDate}
                                minDate={yesterday}
                            />
                        </div>

                        <div className="col-12 pick-hour-container">
                            {
                                allSchedule && allSchedule.length > 0 && allSchedule.map((value, index) => {
                                    let valueVi = value.valueVi
                                    let valueEn = value.valueEn
                                    return (
                                        <button
                                            key={index}
                                            className={value.isSelected ? "btn btn-schedule active" : "btn btn-schedule"}
                                            onClick={() => this.onHandleChoose(value)}
                                        >
                                            {language === LANGUAGES.VI ? valueVi : valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>

                        <button
                            className="btn btn-primary btn-save-schedule"
                            onClick={this.handleSubmit}
                        >
                            <FormattedMessage id="manage-schedule.button" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allScheduleTime: state.admin.allScheduleTime,
        patientMenuPath: state.app.patientMenuPath,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchALLDoctor: () => dispatch(actions.fetchALLDoctor()),
        fetchAllcodeSchedule: () => dispatch(actions.fetchAllcodeSchedule())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageSchedule));
