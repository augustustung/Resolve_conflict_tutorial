import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils/constant';
import './CovidSection.scss'
import { FormattedMessage } from 'react-intl'
import Select from 'react-select'
import { withRouter } from 'react-router'
import axios from '../../../axios'
import moment from 'moment'

class CovidSection extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedCountry: { label: "Viet Nam", value: "vietnam" },
            listCountries: [],
            infoCOVID: null
        }
    }

    async componentDidMount() {
        await this.fetchCountries()
        await this.handOnChangeSelect(this.state.selectedCountry)
    }

    async componentDidUpdate(prevProps) {
        const { language } = this.props

        if (prevProps.language !== language) {
            this.getName()
        }
    }

    handleViewDetail = () => {
        this.props.history.push('/detail-covid')
    }

    fetchCountries = async () => {
        let countries = await axios.get("https://api.covid19api.com/countries")
        if (countries && countries.length > 0) {
            this.setState({
                listCountries: this.buildDataSelecter(countries)
            })
        }
    }

    buildDataSelecter = (data) => {
        let result = []
        for (let i = 0; i < data.length; i++) {
            let obj = {}
            obj.label = data[i].Country
            obj.value = data[i].Slug

            result.push(obj)
        }
        return result;
    }

    handOnChangeSelect = async (selectedCountry) => {
        let id = selectedCountry.value
        this.setState({ selectedCountry })
        await axios.get(`https://api.covid19api.com/dayone/country/${id}`)
            .then((res) => {
                if (res && res.length > 0) {
                    let data = res[res.length - 2]
                    this.setState({ infoCOVID: data })
                }
            })
    }

    getName = () => {
        const { infoCOVID } = this.state
        const { language } = this.props
        return infoCOVID ?
            language === LANGUAGES.VI ?
                moment(new Date(infoCOVID.Date)).locale('vi').format("LLL") :
                moment(new Date(infoCOVID.Date)).locale('en').format("LLL")
            :
            '0'
    }

    render() {
        const { selectedCountry, listCountries, infoCOVID } = this.state

        return (
            <div className="covid-section-container">
                <div className="c-s-titile-home">
                    <span>
                        <FormattedMessage id="banner.covid" />
                        <button
                            className="btn-sec"
                            onClick={this.handleViewDetail}
                        ><FormattedMessage id="banner.watch-more" /></button>                    </span>
                    <div style={{ paddingBottom: "10px" }}>
                        {
                            this.getName()
                        }
                    </div>

                </div>

                <div className="selector">
                    <Select
                        value={selectedCountry}
                        onChange={this.handOnChangeSelect}
                        options={listCountries}
                        className="col-4"
                        name="selectedClinic"
                        placeholder={<FormattedMessage id="manage-doctor.select-country" />}
                    />

                </div>
                <div className="c-s-info">
                    <div className="c-s-content-have">
                        <div className="content-title">
                            <FormattedMessage id="homeheader.total-infections" />
                        </div>
                        <div className="content-subtitle">
                            {infoCOVID ? infoCOVID.Confirmed : '0'}
                        </div>
                    </div>
                    <div className="c-s-content-pass">
                        <div className="content-title">
                            <FormattedMessage id="homeheader.recovered" />
                        </div>
                        <div className="content-subtitle">
                            {infoCOVID ? infoCOVID.Active : '0'}
                        </div>
                    </div>
                    <div className="c-s-content-die">
                        <div className="content-title">
                            <FormattedMessage id="homeheader.deaths" />
                        </div>
                        <div className="content-subtitle">
                            {infoCOVID ? infoCOVID.Deaths : '0'}
                        </div>
                    </div>
                </div>
            </div >
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CovidSection));
