import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../../utils/constant';
import './DetailCOVID.scss'
import { FormattedMessage } from 'react-intl'
import Select from 'react-select'
import moment from 'moment'
import LineChart from '../../../../components/Chart/LineChart'
import HighMaps from '../../../../components/Chart/HighMaps'
import { fetchCountries, fetchDataCOVID } from '../../../../components/Chart/chartService'
import HomeHeader from '../../HomeHeader'
import HomeFooter from '../../HomeFooter'

class DetailCOVID extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedCountry: { label: "Viet Nam", value: "vietnam", id: "vn" },
            listCountries: [],
            infoCOVID: null,
            report: [],
            mapData: {}
        }
    }

    async componentDidMount() {
        let countries = await fetchCountries()
        if (countries && countries.length > 0) {
            this.setState({
                listCountries: this.buildDataSelecter(countries)
            })
        }

        await this.handOnChangeSelect(this.state.selectedCountry)
        this.getMapDataByCountryId()

    }

    async componentDidUpdate(prevProps) {
        const { language } = this.props

        if (prevProps.language !== language) {
            this.getName()
        }
    }

    getMapDataByCountryId = () => {
        let countryId = this.state.selectedCountry.id.toLowerCase()
        if (countryId) {
            import(
                `@highcharts/map-collection/countries/${countryId}/${countryId}-all.geo.json`
            )
                .then((res) => {
                    this.setState({ mapData: res });
                })
                .catch((err) => console.log({ err }));
        }
    }

    buildDataSelecter = (data) => {
        let result = []
        for (let i = 0; i < data.length; i++) {
            let obj = {}
            obj.label = data[i].Country
            obj.value = data[i].Slug
            obj.id = data[i].ISO2

            result.push(obj)
        }
        return result;
    }

    handOnChangeSelect = async (selectedCountry) => {
        let id = selectedCountry.value
        this.setState({ selectedCountry })
        await fetchDataCOVID(id)
            .then((res) => {
                if (res && res.length > 0) {
                    let data = res[res.length - 2]
                    res.pop()
                    this.setState({ infoCOVID: data, report: res })
                }
            })
        this.getMapDataByCountryId()
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
        const { selectedCountry, listCountries, infoCOVID, report, mapData } = this.state
        return (
            <>
                <HomeHeader />
                <div className="covid-section-container">
                    <div className="c-s-titile">
                        <span>
                            <FormattedMessage id="banner.covid" />
                        </span>
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
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '60%' }}>
                            <LineChart data={report} />

                        </div>
                        <div style={{ width: '40%' }}>
                            <HighMaps mapData={mapData} language={this.props.language} />
                        </div>
                    </div>
                </div >
                <HomeFooter />
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailCOVID);
