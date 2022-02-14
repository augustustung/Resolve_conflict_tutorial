import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomeHeader';
import "./DetailDoctor.scss"
import { getDetailInfoDoctor } from '../../../../services/userService'
import { LANGUAGES } from '../../../../utils/constant';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfo from './DoctorExtraInfo';
import LikeButton from '../Social/LikeButton';
import Comment from '../Social/Comment';

class DetailDoctor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            detailDoctor: {},
        }
    }


    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let doctorId = this.props.match.params.id
            let res = await getDetailInfoDoctor(doctorId)
            if (res && res.errCode === 0) {
                this.setState({
                    detailDoctor: res.data,
                })
            }
        }
    }

    componentDidUpdate(prevProps) {

    }

    getProvinceName = () => {
        const { detailDoctor } = this.state
        const { language } = this.props
        let name = ''
        if (detailDoctor && detailDoctor.Doctor_Info && detailDoctor.Doctor_Info.provinceData) {
            let data = detailDoctor.Doctor_Info.provinceData
            name = language === LANGUAGES.VI ? data.valueVi : data.valueEn
        }

        return name
    }

    render() {
        const { detailDoctor } = this.state
        const { language } = this.props
        let nameVi = "", nameEn = ""

        if (detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi} ${detailDoctor.lastName} ${detailDoctor.firstName}`
            nameEn = `${detailDoctor.positionData.valueEn === "None" ? "" : detailDoctor.positionData.valueEn} ${detailDoctor.firstName} ${detailDoctor.lastName}`
        }

        let currentURL = +process.env.REACT_APP_IS_LOCALHOST === 1 ?
            "https://augustus-flynn-chatbot.herokuapp.com/" :
            window.location.href

        return (

            <>
                <HomeHeader isShowBanner={false} />
                <div className="doctor-detail-container">
                    <div className="intro-doctor">
                        <div
                            className="content-left"
                            style={{ backgroundImage: `url(${detailDoctor.image ? detailDoctor.image : ""})` }}
                        >

                        </div>

                        <div className="content-right">
                            <div className="up">
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>

                            <div className="down">
                                {
                                    (detailDoctor.Markdown && detailDoctor.Markdown.description) &&
                                    <span>
                                        {detailDoctor.Markdown.description}
                                    </span>
                                }
                                <br />
                                <LikeButton
                                    dataHref={currentURL}
                                />
                            </div>

                        </div>
                    </div>
                    <div className="detail-doctor-location">
                        <i className="fas fa-map-marker-alt" />
                        <span>
                            {this.getProvinceName()}
                        </span>
                    </div>


                    <div className="schedule-doctor">
                        <div className="content-left">
                            <DoctorSchedule doctorIdFromParent={this.props.match.params.id} />
                        </div>

                        <div className="content-right">
                            <DoctorExtraInfo doctorIdFromParent={this.props.match.params.id} />
                        </div>
                    </div>

                    <div className="detail-doctor">
                        {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML && (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: detailDoctor.Markdown.contentHTML
                                }}
                            />
                        )}
                    </div>

                    <div className="comment-doctor">
                        <Comment
                            dataHref={currentURL}
                            width="100%"
                        />
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
