import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../../utils/constant';
import './DoctorSchedule.scss'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import localization from 'moment/locale/vi'
import { getScheduleDoctorByDate } from '../../../../services/userService'
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {
    constructor(props) {
        super(props)

        this.state = {
            allDays: [],
            allAvailableTimes: [],
            isShowModal: false,
            dataScheduleTimeModal: {}
        }
    }

    getArrayDays = () => {
        const { language } = this.props

        let arrDate = []
        for (let i = 0; i < 3; i++) {
            let obj = {}
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let labelVi = moment(new Date()).format('DD/MM')
                    let today = `Hôm nay - ${labelVi}`
                    obj.labelVi = today;
                } else {
                    obj.labelVi = this.capitalizeFirstLetter(moment(new Date()).add(i, 'days').format('dddd - DD/MM'))
                }
            } else {
                if (i === 0) {
                    let labelEn = moment(new Date()).locale('en').format('DD/MM')
                    let today = `Today - ${labelEn}`
                    obj.labelEn = today;
                } else {
                    obj.labelEn = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM')
                }
            }
            obj.value = moment(new Date()).add(i, 'days').startOf('day').valueOf()

            arrDate.push(obj)
        }

        return arrDate
    }

    async componentDidMount() {
        const allDays = await this.getArrayDays()
        if (allDays && allDays.length > 0) {
            this.setState({
                allDays,
            })
        }

        let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, this.state.allDays[0].value)
        if (res && res.errCode === 0) {
            this.setState({
                allAvailableTimes: res.data
            })
        }
    }

    async componentDidUpdate(prevProps) {
        const { language, doctorIdFromParent } = this.props
        const { allDays } = this.state

        if (prevProps.language !== language) {
            const allDays = this.getArrayDays()
            this.setState({ allDays })
        }

        if (prevProps.doctorIdFromParent !== doctorIdFromParent) {
            let res = await getScheduleDoctorByDate(doctorIdFromParent, allDays[0].value)
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTimes: res.data
                })
            }
        }
    }


    handleChangeSelect = async (e) => {
        if (this.props.doctorIdFromParent) {
            let doctorId = this.props.doctorIdFromParent
            let date = e.target.value

            let res = await getScheduleDoctorByDate(doctorId, date)

            let allTime = []

            if (res && res.errCode === 0) {
                allTime = res.data
                this.setState({
                    allAvailableTimes: allTime
                })
            }
        }
    }

    onHandleChoose = (item) => {
        const { isShowModal } = this.state
        this.setState({
            isShowModal: !isShowModal,
            dataScheduleTimeModal: item
        })
    }

    toggle = () => {
        const { isShowModal } = this.state
        this.setState({ isShowModal: !isShowModal })
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        const { allDays, allAvailableTimes, isShowModal, dataScheduleTimeModal } = this.state
        const { language, doctorIdFromParent } = this.props

        return (
            <>
                {
                    isShowModal &&
                    <BookingModal
                        dataSchedule={dataScheduleTimeModal}
                        isOpen={isShowModal}
                        toggle={this.toggle}
                        doctorId={doctorIdFromParent}
                    />
                }
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select onChange={this.handleChangeSelect}>
                            {allDays && allDays.length > 0 && allDays.map((item, index) => {
                                return (
                                    <option
                                        value={item.value}
                                        key={index}
                                    >
                                        {language === LANGUAGES.VI ? item.labelVi : item.labelEn}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    <div className="all-available-time">
                        <div className="text-calendar">
                            <span className="">
                                <i className="fas fa-calendar-alt" />
                                <FormattedMessage id="patient.detail-doctor.schedule" />
                            </span>
                        </div>

                        <div className="time-content">
                            <>
                                {
                                    allAvailableTimes && allAvailableTimes.length > 0 ? allAvailableTimes.map((value, index) => {
                                        let valueVi = value && value.timeTypeData ? value.timeTypeData.valueVi : ''
                                        let valueEn = value && value.timeTypeData ? value.timeTypeData.valueEn : ''

                                        return (
                                            <button
                                                key={index}
                                                className={"btn btn-schedule"}
                                                onClick={() => this.onHandleChoose(value)}
                                            >
                                                {language === LANGUAGES.VI ? valueVi : valueEn}
                                            </button>
                                        )
                                    }) : (
                                        <div style={{ marginBottom: "5px" }}>
                                            <FormattedMessage id="patient.detail-doctor.none-schedule" />
                                        </div>
                                    )
                                }
                                <div className="book-fee">
                                    <span>
                                        <i className="fas fa-hand-point-up fa-2r" />
                                        <FormattedMessage id="patient.fee" />
                                    </span>
                                </div>
                            </>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
