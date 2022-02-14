import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../../utils/constant';
import * as actions from '../../../../store/actions'
import { withRouter } from 'react-router'
import HomeHeader from '../../HomeHeader'
import HomeFooter from '../../HomeFooter'
import Select from 'react-select'
import { FormattedMessage } from 'react-intl'
import './AllClinic.scss'

class AllClinic extends Component {
    constructor(props) {
        super(props)

        this.state = {
            listClinic: []
        }
    }

    async componentDidMount() {
        const { allClinic } = this.props
        if (allClinic.length === 0) {
            this.props.fetchAllClinic()
        }

        if (allClinic.length > 0) {
            this.setState({
                listClinic: this.buidDataSelect(allClinic)
            })
        }

    }

    buidDataSelect = (allClinic) => {
        const { language } = this.props
        let result = []

        allClinic.map((item, i) => {
            let obj = {}
            let name = language === LANGUAGES.VI ? item.nameVi : item.nameEn
            obj.label = name
            obj.value = item.id
            result.push(obj)
            return item
        })

        return result
    }

    async componentDidUpdate(prevProps) {
        const { language, allClinic } = this.props
        if (prevProps.allClinic !== allClinic) {
            this.setState({
                listClinic: this.buidDataSelect(allClinic)
            })
        }

        if (prevProps.language !== language) {
            this.setState({
                listClinic: this.buidDataSelect(allClinic)
            })
        }

    }

    handleViewDetailClinic = (item) => {
        this.props.history.push(`/detail-clinic/${item.id}`)
    }

    handleChangeSelectClinic = (item) => {
        this.props.history.push(`/detail-clinic/${item.value}`)
    }

    render() {
        const { allClinic, language } = this.props
        const { listClinic } = this.state

        return (
            <>
                <HomeHeader />
                <div style={{ marginTop: "80px" }} />
                <Select
                    onChange={this.handleChangeSelectClinic}
                    options={listClinic}
                    className="select"
                    placeholder={<FormattedMessage id="manage-doctor.choose-a-clinic" />}
                />
                <div className="all-specialty-container">
                    {
                        allClinic && allClinic.map((item, index) => {
                            let name = language === LANGUAGES.VI ? item.nameVi : item.nameEn
                            return (
                                <div
                                    className="all-specialty-content"
                                    key={index}
                                    onClick={() => this.handleViewDetailClinic(item)}
                                >
                                    <div
                                        className="a-s-image"
                                        style={{ backgroundImage: `url(${item.image})`, marginRight: '10px' }}
                                    />
                                    <div className="content-right">
                                        <span className="a-s-title">
                                            {name}
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
        allClinic: state.admin.allClinic
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllClinic: () => dispatch(actions.fetchAllClinic())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllClinic));