import React, { Component } from 'react';
import { connect } from "react-redux";
import './VerifyingEmail.scss'
import { FormattedMessage } from 'react-intl'
import { postVerifyBooking } from '../../../services/userService'
import HomeHeader from '../HomeHeader';
import HomeFooter from '../HomeFooter';

class VerifyingEmail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            statusVerify: false,
            errCode: 2
        }
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            const urlParams = new URLSearchParams(this.props.location.search)
            const token = urlParams.get('token')
            const doctorId = urlParams.get("doctorId")
            let res = await postVerifyBooking({
                token: token,
                doctorId: doctorId
            })

            if (res) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })

            }
        }
    }

    async componentDidUpdate(prevProps) {

    }


    render() {
        const { statusVerify, errCode } = this.state
        return (
            <>
                <HomeHeader />
                <div className="verify-container">
                    {
                        !statusVerify ? (
                            <>
                                <div className="container-loader col-12">
                                    <div className="loader" />
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <h4>
                                        <FormattedMessage id="verify-email.wait" />
                                    </h4>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="container-loader col-12">
                                    <span>
                                        {
                                            +errCode === 0 ?
                                                <i className="fas fa-calendar-check fa-6x" /> :
                                                <i className="fas fa-frown fa-6x" />
                                        }
                                    </span>
                                </div>
                                {
                                    +errCode === 0 ?
                                        <h4 className="success">
                                            <FormattedMessage id="verify-email.succeed" />
                                        </h4> :
                                        <div className="fail">
                                            <h4>
                                                <FormattedMessage id="verify-email.failed" />
                                            </h4>
                                            <div>
                                                <FormattedMessage id="verify-email.wrong" />
                                            </div>
                                        </div>

                                }
                            </>
                        )
                    }

                    <div className="more-info">
                        <div><FormattedMessage id="verify-email.hotline" /></div>
                        <div><FormattedMessage id="verify-email.email" /></div>
                        <div><FormattedMessage id="verify-email.thanks" /></div>
                        <div><FormattedMessage id="verify-email.regard" /></div>
                    </div>
                </div>
                <HomeFooter />
            </>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyingEmail);