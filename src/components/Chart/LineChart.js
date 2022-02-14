import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { connect } from "react-redux";
import { LANGUAGES } from '../../utils/constant'


class LineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {},
            reportType: 'all'
        }
    }

    componentDidMount() {
        this.renderOptions()
    }

    componentDidUpdate(prevProps) {
        const { language, data } = this.props

        if (language !== prevProps.language) {
            this.generateOptions()
            this.renderOptions()
        }

        if (prevProps.data !== data) {
            this.generateOptions()
            this.renderOptions()
        }
    }

    generateOptions = (data) => {
        const { language } = this.props
        if (!data)
            return
        const categories = data.map((item) => moment(item.Date).format('DD/MM/YYYY'));

        return {
            chart: {
                height: 500,
            },
            title: {
                text: language === LANGUAGES.VI ? 'Tổng ca nhiễm' : "Total infections",
            },
            xAxis: {
                categories: categories,
                crosshair: true,
            },
            colors: ['#F3585B'],
            yAxis: {
                min: 0,
                title: {
                    text: null,
                },
                labels: {
                    align: 'right',
                },
            },
            tooltip: {
                headerFormat: '<span style={{fontSize:"10px"}}>{point.key}</span><table>',
                pointFormat:
                    '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y} ca</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true,
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                },
            },
            series: [
                {
                    name: language === LANGUAGES.VI ? 'Tổng ca nhiễm' : "Total infections",
                    data: data.map((item) => item.Confirmed),
                },
            ],
        };
    };

    setReportType = (e) => {
        this.setState({ reportType: e.target.name })
        this.renderOptions()
    }

    renderOptions = () => {
        const { reportType } = this.state
        const { data } = this.props
        let customData = [];
        switch (reportType) {
            case 'all':
                customData = data;
                break;
            case '30':
                customData = data.slice(Math.max(data.length - 30, 1));
                break;
            case '7':
                customData = data.slice(Math.max(data.length - 7, 1));
                break;

            default:
                customData = data;
                break;
        }

        this.setState({ options: this.generateOptions(customData) });
    }

    render() {
        const { options } = this.state
        const { language } = this.props
        return (
            <>
                <div
                    className="form-group"
                    style={{ display: 'flex' }}
                >
                    <button
                        name="all"
                        className="form-control"
                        onClick={this.setReportType}
                    >
                        {language === LANGUAGES.VI ? "Tất cả" : "All"}
                    </button>
                    <button
                        name="30"
                        className="form-control"
                        onClick={this.setReportType}
                    >
                        {language === LANGUAGES.VI ? "30 ngày" : "30 days"}
                    </button>
                    <button
                        className="form-control"
                        name="7"
                        onClick={this.setReportType}
                    >
                        {language === LANGUAGES.VI ? "7 ngày" : "7 days"}
                    </button>
                </div>
                <HighchartsReact highcharts={Highcharts} options={options} />
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

export default connect(mapStateToProps, mapDispatchToProps)(LineChart);