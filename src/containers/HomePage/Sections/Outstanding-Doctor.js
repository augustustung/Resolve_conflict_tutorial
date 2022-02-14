import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import * as actions from '../../../store/actions'
import Slider from "react-slick";
import { LANGUAGES } from '../../../utils'
import CustomArrow from '../../../components/customArrow';

class OutStandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctos: []
        }
    }

    componentDidUpdate(prevProps) {
        const { topDoctors } = this.props
        if (prevProps.topDoctors !== topDoctors) {
            this.setState({
                arrDoctos: [...topDoctors]
            })
        }
    }

    async componentDidMount() {
        await this.props.loadTopDoctor(8)
    }

    handleViewDetailDoctor = (item) => {
        this.props.history.push(`/detail-doctor/${item.id}`)
    }

    getNameSpecialty = (specialtyId) => {
        const { allSpecialty, language } = this.props
        let name = ''
        if (!allSpecialty || !allSpecialty.length > 0)
            return name

        for (let i = 0; i < allSpecialty.length; i++) {
            if (specialtyId === allSpecialty[i].id) {
                name = language === LANGUAGES.VI ? allSpecialty[i].nameVi : allSpecialty[i].nameEn
                break;
            }
        }

        return name
    }

    handleViewAllDoctor = () => {
        this.props.history.push(`/all-doctor`)
    }

    render() {
        const { arrDoctos } = this.state
        const { language } = this.props
        return (
            <div className="section-share section-outstanding-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-sec" ><FormattedMessage id="banner.outstanding-doctors" /></span>
                        <button
                            className="btn-sec"
                            onClick={this.handleViewAllDoctor}
                        >{language === LANGUAGES.VI ? "TÌM KIẾM" : "FIND A DOCTOR"}</button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>

                            {arrDoctos && arrDoctos.length > 0 && arrDoctos.map((item, i) => {
                                let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName} `
                                let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`
                                let imgBase64 = "";
                                if (item.image) {
                                    imgBase64 = Buffer.from(item.image, 'base64').toString('binary')
                                }

                                return (
                                    <div
                                        className="section-customize"
                                        key={i}
                                        onClick={() => this.handleViewDetailDoctor(item)}
                                    >
                                        <div className="customize-border">
                                            <div className="outer-bg">
                                                <div
                                                    className="bg-img section-outstanding-doctor"
                                                    style={{ backgroundImage: `url(${imgBase64})` }}
                                                />
                                            </div>
                                            <div className="position text-center text-hover">
                                                <div>{language === LANGUAGES.EN ? nameEn : nameVi}</div>
                                                <div>{item.Doctor_Info && item.Doctor_Info.specialtyId ? this.getNameSpecialty(item.Doctor_Info.specialtyId) : ""}</div>
                                            </div>
                                        </div>
                                    </div>)
                            })}
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
        topDoctors: state.admin.topDoctors,
        allSpecialty: state.admin.allSpecialty
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctor: (limit) => dispatch(actions.fetchTopDoctor(limit))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
