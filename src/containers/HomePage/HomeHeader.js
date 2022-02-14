import React, { Component } from 'react'
import './HomeHeader.scss'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import logo from "../../assets/images/logo.png"
import { LANGUAGES } from '../../utils/constant'
import * as actions from '../../store/actions'
import { toast } from 'react-toastify'

class HomeHeader extends Component {

    changeLanguage = (l) => {
        this.props.changeLanguageAppRedux(l)
    }

    returnToHomePage = () => {
        if (this.props.history)
            this.props.history.push(`/home`)
    }

    handleClickSpecialtyPage = () => {
        this.props.history.push('/all-specialty')

    }

    handleClickClinicPage = () => {
        this.props.history.push('/all-clinic')
    }

    handleClickViewAllDoctor = () => {
        this.props.history.push('/all-doctor')
    }

    handleClickDoctorPage = () => {
        const { user, language } = this.props
        if (user && user.roleId === "R3") {
            let message = language === LANGUAGES.VI ? "Bạn không có quyền truy cập vào trang này." : "You don't have permission to access this site."
            toast.error(message)
        } else
            this.props.history.push('/login')
    }

    nagvigateLogin = () => {
        this.props.history.push('/login')
    }

    render() {
        const { language, isShowBanner, user } = this.props
        return (
            <React.Fragment>
                <div className="home-header-container">

                    <div className="home-header-content">
                        <div className="left-content">
                            <i className="fas fa-bars btnIcon" />
                            <img
                                className="header-logo"
                                src={logo}
                                alt="logo"
                                onClick={this.returnToHomePage}
                            />
                        </div>

                        <div className="center-content">
                            <div className="child-content" onClick={this.handleClickSpecialtyPage}>
                                <div><b><FormattedMessage id="homeheader.specialty" /></b></div>
                                <div className="subTitle"><FormattedMessage id="homeheader.search-doctor" /></div>
                            </div>

                            <div className="child-content" onClick={this.handleClickClinicPage}>
                                <div><b><FormattedMessage id="homeheader.health-facility" /></b></div>
                                <div className="subTitle"><FormattedMessage id="homeheader.select-room" /></div>
                            </div>

                            <div className="child-content" onClick={this.handleClickViewAllDoctor}>
                                <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div className="subTitle"><FormattedMessage id="homeheader.select-doctor" /></div>
                            </div>

                            <div className="child-content" onClick={this.handleClickDoctorPage}>
                                <div><b><FormattedMessage id="homeheader.fee" /></b></div>
                                <div className="subTitle"><FormattedMessage id="homeheader.check-health" /></div>
                            </div>
                        </div>

                        <div className="right-content">
                            <div style={{ marginRight: '5rem' }}>
                                <a href={process.env.REACT_APP_SUPPORT_URL || "https://romantic-joliot-cfeb4b.netlify.app"} target='_blank'><FormattedMessage id="homeheader.support" /></a>
                            </div>
                            <div className="support">
                                <div className={language === LANGUAGES.VI ? 'language-vi active' : "language-vi"}><span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VI</span></div>
                                <div className={language === LANGUAGES.EN ? 'language-en active' : "language-en"}><span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                                {
                                    !user ? (
                                        <div className="action-button" onClick={this.nagvigateLogin}>
                                            Đăng nhập
                                        </div>
                                    ) : (
                                        <div className="action-button" onClick={this.props.handleLogout}>
                                            Đăng xuất
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: "60px" }} />
                {isShowBanner &&
                    <div className="home-header-banner">
                        <div className="bar">
                            <div className="title1">
                                <FormattedMessage id="banner.title1" />
                            </div>
                            <div className="title2">
                                <FormattedMessage id="banner.title2" />
                            </div>
                        </div>
                        <div className="search">
                            <i className="fas fa-search" />
                            <input type="text" placeholder={language === LANGUAGES.VI ? "Tìm chuyên khoa khám bệnh" : "Find a medical specialty"} />
                        </div>
                        <div className="others-media">
                            <div className="ios-app"></div>
                            <div className="android-app"></div>
                        </div>

                        <div className="options">
                            <div className="options-child">
                                <div className="icon-child">
                                    <i className="fas fa-hospital hospital fa-2x" />
                                </div>
                                <div className="text-child text-center"><FormattedMessage id="banner.child1" /></div>
                            </div>

                            <div className="options-child">
                                <div className="icon-child">
                                    <i className="fas fa-mobile-alt ktx fa-2x"></i>
                                </div>
                                <div className="text-child text-center"><FormattedMessage id="banner.child2" /></div>
                            </div>

                            <div className="options-child">
                                <div className="icon-child">
                                    <i className="fas fa-notes-medical fa-2x ktq"></i>
                                </div>
                                <div className="text-child text-center"><FormattedMessage id="banner.child3" /></div>
                            </div>

                            <div className="options-child">
                                <div className="icon-child">
                                    <i className="fas fa-stethoscope fa-2x xnyh" />
                                </div>
                                <div className="text-child text-center"><FormattedMessage id="banner.child4" /></div>
                            </div>

                            <div className="options-child">
                                <div className="icon-child">
                                    <i className="fas fa-hand-holding-heart sktt fa-2x"></i>
                                </div>
                                <div className="text-child text-center"><FormattedMessage id="banner.child5" /></div>
                            </div>

                            <div className="options-child">
                                <div className="icon-child">
                                    <i className="fas fa-briefcase-medical fa-2x knk"></i>
                                </div>
                                <div className="text-child text-center"><FormattedMessage id="banner.child6" /></div>
                            </div>
                        </div>
                    </div>

                }
            </React.Fragment>

        )
    }
}



const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
        handleLogout: () => dispatch(actions.processLogout())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
