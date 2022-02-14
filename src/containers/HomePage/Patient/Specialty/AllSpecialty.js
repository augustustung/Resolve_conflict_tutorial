import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../../utils/constant';
import './AllSpecialty.scss'
import * as actions from '../../../../store/actions'
import { withRouter } from 'react-router'
import HomeHeader from '../../HomeHeader'
import HomeFooter from '../../HomeFooter'

class AllSpecialty extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    async componentDidMount() {
        const { allSpecialty } = this.props
        if (allSpecialty.length === 0) {
            this.props.getAllSpecialty()
        }
    }

    async componentDidUpdate(prevProps) {

    }

    handleViewDetailSpecialty = (item) => {
        this.props.history.push(`/detail-specialty/${item.id}`)
    }

    render() {
        const { allSpecialty, language } = this.props

        return (
            <>
                <HomeHeader />
                <div style={{ marginTop: "100px" }} />
                <div className="all-specialty-container">
                    {
                        allSpecialty && allSpecialty.map((item, index) => {
                            let name = language === LANGUAGES.VI ? item.nameVi : item.nameEn
                            return (
                                <div
                                    className="all-specialty-content"
                                    key={index}
                                    onClick={() => this.handleViewDetailSpecialty(item)}
                                >
                                    <div
                                        className="a-s-image"
                                        style={{ backgroundImage: `url(${item.image})` }}
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
        allSpecialty: state.admin.allSpecialty
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllSpecialty: () => dispatch(actions.fetchAllSpecialty())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllSpecialty));
