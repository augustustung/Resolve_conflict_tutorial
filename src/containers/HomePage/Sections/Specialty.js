import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux';
import Slider from "react-slick";
import { LANGUAGES } from '../../../utils/constant'
import { withRouter } from 'react-router'
import * as actions from '../../../store/actions'

class Specialty extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataSpecialty: []
        }
    }

    async componentDidMount() {
        await this.props.fetchAllSpecialty()
    }

    componentDidUpdate(prevProps) {
        const { allSpecialty } = this.props
        if (prevProps.allSpecialty !== allSpecialty) {
            this.setState({
                dataSpecialty: [...allSpecialty]
            })
        }
    }

    handleViewDetailSpecialty = (item) => {
        this.props.history.push(`/detail-specialty/${item.id}`)
    }

    handleViewAllSpecialty = () => {
        this.props.history.push(`/all-specialty`)
    }

    render() {
        const { dataSpecialty } = this.state
        const { language } = this.props

        return (
            <div className="section-share section-specialty">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-sec" ><FormattedMessage id="banner.specialized-examination" /> </span>
                        <button
                            className="btn-sec"
                            onClick={this.handleViewAllSpecialty}
                        ><FormattedMessage id="banner.watch-more" /></button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {
                                dataSpecialty && dataSpecialty.length > 0 && dataSpecialty.map((item, i) => {
                                    return (
                                        <div
                                            className="section-customize"
                                            key={i}
                                            onClick={() => this.handleViewDetailSpecialty(item)}
                                        >
                                            <div
                                                className="bg-img section-specialty"
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
        allSpecialty: state.admin.allSpecialty
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllSpecialty: () => dispatch(actions.fetchAllSpecialty())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
