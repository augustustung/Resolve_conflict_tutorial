import React, { Component } from 'react'
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'
import { getTopClinics } from '../../../services/userService'
import Slider from "react-slick";
import { LANGUAGES } from '../../../utils'
import { withRouter } from 'react-router'

class MeicalFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataClinics: []
        }
    }


    async componentDidMount() {
        let res = await getTopClinics(8)
        if (res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data
            })
        }
    }

    handleViewDetailSpecialty = (item) => {
        this.props.history.push(`/detail-clinic/${item.id}`)
    }

    handleViewAllSpecialty = () => {
        this.props.history.push(`/all-clinic`)
    }

    render() {
        const { dataClinics } = this.state
        const { language, settings } = this.props
        return (
            <div className="section-share section-medical-facility">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-sec"><FormattedMessage id="banner.outstanding-medical-facility" /></span>
                        <button
                            className="btn-sec"
                            onClick={this.handleViewAllSpecialty}
                        ><FormattedMessage id="banner.watch-more" /></button>
                    </div>
                    <div className="section-body">
                        <Slider {...settings}>
                            {
                                dataClinics && dataClinics.length > 0 && dataClinics.map((item, i) => {
                                    return (
                                        <div
                                            className="section-customize"
                                            key={i}
                                            onClick={() => this.handleViewDetailSpecialty(item)}
                                        >
                                            <div
                                                className="bg-img section-medical-facility"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            />
                                            <div
                                                style={{
                                                    paddingTop: "30px",
                                                    fontWeight: "500",
                                                    fontSize: "15px",
                                                    paddingLeft: "15px"
                                                }}
                                            >{language === LANGUAGES.VI ? item.nameVi : item.nameEn}</div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>

                    </div>
                </div>
            </div>
        )
    }
}



const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MeicalFacility));
