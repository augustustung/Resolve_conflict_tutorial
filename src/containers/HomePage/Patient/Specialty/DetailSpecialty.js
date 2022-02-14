import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../../utils/constant';
import './DetailSpecialty.scss'
import { FormattedMessage } from 'react-intl'
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo';
import HomeHeader from '../../HomeHeader';
import HomeFooter from '../../HomeFooter'
import ProfileDoctor from '../Doctor/ProfileDoctor'
import { getDetailSpecialtyById, getAllCodeService } from '../../../../services/userService'
import _ from 'lodash';
import Select from 'react-select'

class DetailSpecialty extends Component {
    constructor(props) {
        super(props)

        this.state = {
            arrDoctorId: [],
            listProvince: [],
            selectedProvince: null,
            dataDetailSpecialty: {},
            isShowDetail: false
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let specialtyId = this.props.match.params.id

            let res = await getDetailSpecialtyById({
                id: specialtyId,
                location: "ALL"
            })

            let resProvince = await getAllCodeService("PROVINCE")

            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let arrId = []
                let data = res.data
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrId.push(item.doctorId)
                            return item
                        })
                    }
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrId,
                    listProvince: this.buildInputDataSelectDoctor(resProvince.data)
                })
            }
        }
    }

    async componentDidUpdate(prevProps) {

    }

    buildInputDataSelectDoctor = (data) => {
        const { language } = this.props
        let result = [];

        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let obj = {}

                obj.label = language === LANGUAGES.VI ?
                    `${data[`${i}`].valueVi}` :
                    `${data[`${i}`].valueEn}`
                obj.value = data[`${i}`].keyMap

                result.push(obj)
            }
            result.push({
                label: language === LANGUAGES.VI ? "Toàn quốc" : "All",
                value: "ALL"
            })
        }
        return result;
    }

    handleChangeSelect = async (selectedProvince) => {
        this.setState({ selectedProvince })
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let specialtyId = this.props.match.params.id
            let location = selectedProvince.value

            let res = await getDetailSpecialtyById({
                id: specialtyId,
                location: location
            })

            if (res && res.errCode === 0) {
                let arrId = []
                let data = res.data
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrId.push(item.doctorId)
                            return item
                        })
                    }
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrId,
                })
            }
        }
    }

    render() {
        const { 
            arrDoctorId,
            dataDetailSpecialty,
            listProvince,
            selectedProvince,
            isShowDetail
        } = this.state

        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <div style={{ paddingTop: "50px" }} />
                <div className="detail-specialty-body">
                    <div 
                        className="detail-specialty-description"
                        style={{backgroundImage: `url(${dataDetailSpecialty.image})` }}
                    >
                        <div className="front-content">
                            {
                                dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: dataDetailSpecialty.descriptionHTML
                                        }}
                                        style={{ height: isShowDetail ? "auto" : "200px" }}
                                    />
                                )
                            }
                            <button
                                onClick={() => this.setState({ isShowDetail: !isShowDetail })}
                            >
                                <FormattedMessage id={isShowDetail ? "extra-doctor-info.hide-detail" : "extra-doctor-info.view-detail"} />
                            </button>
                        </div>
                        
                        
                    </div>

                    <Select
                        value={selectedProvince}
                        className="col-3 select-ds"
                        onChange={this.handleChangeSelect}
                        options={listProvince}
                        name="selectedProvince"
                        placeholder={<FormattedMessage id="manage-doctor.choose-a-province" />}
                    />

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
                            </div>
                        )
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
