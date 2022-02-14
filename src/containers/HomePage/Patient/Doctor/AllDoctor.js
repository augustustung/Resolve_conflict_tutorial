import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../../utils/constant';
import './AllDoctor.scss'
import * as actions from '../../../../store/actions'
import { withRouter } from 'react-router'
import HomeHeader from '../../HomeHeader'
import HomeFooter from '../../HomeFooter'
import Select from 'react-select'
import { FormattedMessage } from 'react-intl'


class AllDoctor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            listDoctor: []
        }
    }

    async componentDidMount() {
        const { allDoctorsDetail } = this.props
        if (allDoctorsDetail.length === 0) {
            this.props.fetchAllDetailDoctor()
        }

        if (allDoctorsDetail.length > 0) {
            this.setState({
                listDoctor: this.buidDataSelect(allDoctorsDetail)
            })
        }

    }

    async componentDidUpdate(prevProps) {
        const { language, allDoctorsDetail } = this.props
        if (prevProps.allDoctorsDetail !== allDoctorsDetail) {
            this.setState({
                listDoctor: this.buidDataSelect(allDoctorsDetail)
            })
        }

        if (prevProps.language !== language) {
            this.setState({
                listDoctor: this.buidDataSelect(allDoctorsDetail)
            })
        }
    }

    handleViewDetailClinic = (item) => {
        this.props.history.push(`/detail-doctor/${item.id}`)
    }

    buidDataSelect = (allDoctorsDetail) => {
        const { language } = this.props
        let result = []

        allDoctorsDetail.map((item, i) => {
            let obj = {}
            let name = language === LANGUAGES.VI ?
                `${item.lastName} ${item.firstName}` :
                `${item.firstName} ${item.lastName}`
            obj.label = name
            obj.value = item.id
            result.push(obj)
            return item
        })

        return result
    }


    handleChangeSelect = (item) => {
        this.props.history.push(`/detail-doctor/${item.value}`)
    }


    render() {
        const { allDoctorsDetail, language } = this.props
        const { listDoctor } = this.state

        return (
            <>
                <HomeHeader />
                <div style={{ marginTop: "80px" }} />
                <Select
                    onChange={this.handleChangeSelect}
                    options={listDoctor}
                    className="select"
                    placeholder={<FormattedMessage id="manage-doctor.choose-a-doctor" />}
                />
                <div className="all-doctor-container">
                    {
                        allDoctorsDetail && allDoctorsDetail.map((item, index) => {
                            let name = language === LANGUAGES.VI ?
                                `${item.lastName} ${item.firstName}` :
                                `${item.firstName} ${item.lastName}`
                            let imgBase64 = Buffer.from(item.image, 'base64').toString('binary')
                            let position = language === LANGUAGES.VI ?
                                `${item.positionData.valueVi}` :
                                `${item.positionData.valueEn}`
                            return (
                                <div
                                    className="all-doctor-content"
                                    key={index}
                                    onClick={() => this.handleViewDetailClinic(item)}
                                >
                                    <div
                                        className="content-left"
                                        style={{ backgroundImage: `url(${imgBase64})` }}
                                    />

                                    <div className='content-right'>
                                        <span className="a-d-title">
                                            {position} | {name}
                                        </span>
                                        <span className="a-d-subTitle">
                                            <i className="fas fa-map-marker-alt" />
                                            <span>
                                                {item.address}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <HomeFooter />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctorsDetail: state.admin.allDoctorsDetail
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDetailDoctor: () => dispatch(actions.fetchAllDetailDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllDoctor));