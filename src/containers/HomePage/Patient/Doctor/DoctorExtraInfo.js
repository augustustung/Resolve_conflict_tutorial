import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../../utils/constant';
import './DoctorExtraInfo.scss'
import { FormattedMessage } from 'react-intl'
import { getExtraInfoDoctorById } from '../../../../services/userService'
import NumberFormat from 'react-number-format';

class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            viewDetail: false,
            extraInfo: {}
        }
    }

    async componentDidMount() {
        const { doctorIdFromParent } = this.props
        if (doctorIdFromParent) {
            let res = await getExtraInfoDoctorById(doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({ extraInfo: res.data })
            }
        }

    }

    async componentDidUpdate(prevProps) {
        const { doctorIdFromParent } = this.props
        if (prevProps.doctorIdFromParent !== doctorIdFromParent) {
            let res = await getExtraInfoDoctorById(doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({ extraInfo: res.data })
            }
        }
    }

    showInfo = () => {
        const { viewDetail } = this.state

        this.setState({ viewDetail: !viewDetail })
    }

    render() {
        const { viewDetail, extraInfo } = this.state
        const { language } = this.props

        let priceEn = '', priceVi = '',
            provinceVi = '', provinceEn = '',
            paymentVi = '', paymentEn = ''
        if (extraInfo && extraInfo.priceData) {
            priceEn = extraInfo.priceData.valueEn
            priceVi = extraInfo.priceData.valueVi
        }

        if (extraInfo && extraInfo.provinceData) {
            provinceEn = extraInfo.provinceData.valueEn
            provinceVi = extraInfo.provinceData.valueVi
        }

        if (extraInfo && extraInfo.paymentData) {
            paymentEn = extraInfo.paymentData.valueEn
            paymentVi = extraInfo.paymentData.valueVi
        }

        return (
            <div className="doctor-extra-info-container">
                <div className="content-up">
                    <div className="text-title">
                        <FormattedMessage id="extra-doctor-info.clinic-address" />
                    </div>
                    <div className="name-clinic">{extraInfo.nameClinic}</div>
                    <div className="detail-address">{extraInfo.addressClinicId} - {language === LANGUAGES.VI ? provinceVi : provinceEn}</div>
                </div>

                <div className="content-down">
                    {!viewDetail ?
                        (
                            <div className="btn-show">
                                <FormattedMessage id="extra-doctor-info.price" />: {" "}
                                <NumberFormat
                                    value={language === LANGUAGES.VI ? priceVi : priceEn}
                                    displayType='text'
                                    thousandSeparator={true}
                                    suffix={language === LANGUAGES.VI ? 'đ' : '$'}
                                    style={{ color: "#333" }}
                                />
                                {"     "}
                                <span onClick={this.showInfo}>
                                    <FormattedMessage id="extra-doctor-info.view-detail" />
                                </span>
                            </div>
                        ) : (
                            <>
                                <div className="text-title">
                                    <FormattedMessage id="extra-doctor-info.price" />
                                </div>

                                <div className="price-detail">
                                    <span className="left">
                                        <FormattedMessage id="extra-doctor-info.price" />
                                    </span>
                                    <span className="right">
                                        <NumberFormat
                                            value={language === LANGUAGES.VI ? priceVi : priceEn}
                                            displayType='text'
                                            thousandSeparator={true}
                                            suffix={language === LANGUAGES.VI ? 'đ' : '$'}
                                        />
                                    </span>
                                    <div className="note">
                                        {extraInfo.note}
                                    </div>
                                </div>


                                <div className="payment">
                                    <FormattedMessage id="extra-doctor-info.payment" />: {" "}
                                    {
                                        language === LANGUAGES.VI ? paymentVi : paymentEn
                                    }
                                </div>

                                <div className="btn-show">
                                    <span onClick={this.showInfo}>
                                        <FormattedMessage id="extra-doctor-info.hide-detail" />
                                    </span>
                                </div>
                            </>
                        )
                    }


                </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
