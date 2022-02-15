import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailClinic.scss'
import { FormattedMessage } from 'react-intl'
import HomeHeader from '../../HomeHeader';
import HomeFooter from '../../HomeFooter';
import { getDetailClinicById } from '../../../../services/userService'
import _ from 'lodash'
import ProfileDoctor from '../Doctor/ProfileDoctor'
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo';
import { toast } from 'react-toastify';

class DetailClinic extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataDetailClinic: [],
            arrDoctorId: []
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let clinicId = this.props.match.params.id

            let res = await getDetailClinicById(clinicId)

            if (res && res.errCode === 0) {
                let arrId = []
                let data = res.data
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrId.push(item.doctorId)
                            return item
                        })
                    }
                }
                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrId,
                })
            } else {
                toast.error(res.errMessage)
            }
        }
    }

    async componentDidUpdate(prevProps) {

    }


    render() {
        const { dataDetailClinic, arrDoctorId } = this.state
        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <span style={{ paddingTop: "50px" }} />
                <div className="detail-specialty-body">
                    {
                        arrDoctorId && arrDoctorId.length > 0 ? arrDoctorId.map((item, index) => {
                            return (
                                <div className="each-doctor" key={index}>

                                    <div className="dt-content-left">
                                        <ProfileDoctor
                                            doctorId={item}
                                            isShowDoctorDescription={true}
                                            isShowLink={true}
                                            isShowPrice={false}
                                        // dataTime={dataSchedule}
                                        />
                                    </div>

                                    <div className="dt-content-right">
                                        <div className="doctor-schedule">
                                            <DoctorSchedule doctorIdFromParent={item} />
                                        </div>

                                        <div className="doctor-extra-info">
                                            <DoctorExtraInfo doctorIdFromParent={item} />
                                        </div>
                                    </div>
                                </div>

                            )
                        }) : (
                            <div className="ds-none">
                                <FormattedMessage id="manage-doctor.none" />
                                test add new
                            </div>
                        )
                    }

                    <div className="detail-specialty-description">
                        {
                            dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: dataDetailClinic.descriptionHTML
                                    }}
                                />
                            )
                        }
                    </div>
                </div>
                <HomeFooter />
            </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
