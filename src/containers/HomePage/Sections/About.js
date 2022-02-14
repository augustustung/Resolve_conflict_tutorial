import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils';


class About extends Component {
    render() {
        const { language } = this.props
        return (
            <div className="section-share section-about">
                <div className="section-about-header">
                    <FormattedMessage id="banner.prevention" />
                </div>
                <div className="section-about-content">
                    <div className="content-left">
                        <iframe
                            width="100%"
                            height="400px"
                            src="https://www.youtube.com/embed/12_QnjCPHZ8"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; 
                        autoplay; 
                        clipboard-write; 
                        encrypted-media; 
                        gyroscope; 
                        picture-in-picture"
                            allowFullScreen></iframe>
                    </div>

                    <div className="content-right">
                        <span>
                            {
                                language === LANGUAGES.VI ? (
                                    <>
                                        <h5>Quy tắc 5K phòng tránh COVID-19</h5>
                                        <div><b>KHẨU TRANG</b>: Đeo khẩu trang vải thường xuyên tại nơi công cộng, nơi tập trung đông người; đeo khẩu trang y tế tại các cơ sở y tế, khu cách ly.</div>
                                        <div><b>KHỬ KHUẨN</b>: Rửa tay thường xuyên bằng xà phòng hoặc dung dịch sát khuẩn tay. Vệ sinh các bề mặt/ vật dụng thường xuyên tiếp xúc (tay nắm cửa, điện thoại, máy tính bảng, mặt bàn, ghế…). Giữ vệ sinh, lau rửa và để nhà cửa thông thoáng.</div>
                                        <div><b>KHOẢNG CÁCH</b>: Giữ khoảng cách khi tiếp xúc với người khác.</div>
                                        <div><b>KHÔNG TỤ TẬP</b> đông người.</div>
                                        <div><b>KHAI BÁO Y TẾ:</b> thực hiện khai báo y tế trên App NCOVI; cài đặt ứng dụng BlueZone tại địa chỉ https://www.bluezone.gov.vnđể được cảnh báo nguy cơ lây nhiễm COVID-19.</div>

                                        <div>===================<br />Khi có dấu hiệu sốt, ho, khó thở hãy gọi điện cho đường dây nóng của Bộ Y tế 19009095 hoặc đường dây nóng của y tế địa phương để được tư vấn, hỗ trợ, hướng dẫn đi khám bệnh đảm bảo an toàn.</div>
                                    </>
                                ) : (
                                    <>
                                        <h5>Vietnam's 5K rule to prevent epidemics</h5>
                                        <div><b>MASK</b>: Wear cloth masks regularly in public places, places where people gather; Wear medical masks at medical facilities and isolation areas.</div>
                                        <div><b>Disinfection</b>:  Wash your hands often with soap or hand sanitizer. Clean frequently touched surfaces/items (doorknobs, phones, tablets, tables, chairs, etc.). Keep clean, wash and keep the house well ventilated.</div>
                                        <div><b>DISTANCE</b>: Keep your distance when in contact with others.</div>
                                        <div>DO NOT HAVE <b> HUGE PEOPLE.</b></div>
                                        <div><b>HEALTH DECLARATION</b>: make medical declaration on NCOVI App; Install the BlueZone application at https://www.bluezone.gov.vn to be warned about the risk of COVID-19 infection.</div>
                                        <div>===================<br />When there are signs of fever, cough, difficulty breathing, please call the hotline of the Ministry of Health 19009095 or the hotline of the local health center for advice, support and instructions for safe medical examination.</div>
                                    </>
                                )
                            }
                        </span>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
