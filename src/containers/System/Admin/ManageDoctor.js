import React, { Component } from 'react';
import "./ManageDoctor.scss"
import { connect } from 'react-redux';
import * as actions from '../../../store/actions'
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { FormattedMessage } from 'react-intl'

import Select from 'react-select'
import { getDetailInfoDoctor } from '../../../services/userService'

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //save to Markdown
            contentMarkdown: '',
            contentHTML: '',
            description: '',
            hasOldData: false,
            action: CRUD_ACTIONS.CREATE,
            listDoctos: [],
            selectedDoctor: null,


            //save to Doctor_info
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinic: [],
            listSpecialty: [],
            selectedClinic: null,
            selectedPayment: null,
            selectedPrice: null,
            selectedProvince: null,
            nameClinic: '',
            clinicAddress: '',
            note: '',
            selectedSpecialty: null
        }
    }

    componentDidMount() {
        this.props.fetchALLDoctor()
        this.props.getRequiredDoctorInfo()
    }

    componentDidUpdate(prevProps) {
        const { allDoctors, language, requiredDoctorInfo } = this.props
        if (prevProps.allDoctors !== allDoctors) {
            let dataSelect = this.buildInputDataSelectDoctor(allDoctors)
            this.setState({
                listDoctos: dataSelect
            })
        }

        if (language !== prevProps.language) {
            let dataSelect = this.buildInputDataSelectDoctor(allDoctors)
            this.setState({
                listDoctos: dataSelect
            })
        }

        if (prevProps.requiredDoctorInfo !== requiredDoctorInfo) {
            let dataPrice = this.buildInputDoctorRequiredInfo(requiredDoctorInfo.resPrice, "PRICE")
            let dataPayment = this.buildInputDoctorRequiredInfo(requiredDoctorInfo.resPayment)
            let dataProvince = this.buildInputDoctorRequiredInfo(requiredDoctorInfo.resProvince)
            let dataSpecialty = this.buildInputDoctorRequiredInfo(requiredDoctorInfo.resSpecialty, "SPECIALTY")
            let dataClinic = this.buildInputDoctorRequiredInfo(requiredDoctorInfo.resClinic, "SPECIALTY")
            this.setState({
                listPrice: dataPrice,
                listPayment: dataPayment,
                listProvince: dataProvince,
                listSpecialty: dataSpecialty,
                listClinic: dataClinic
            })
        }

        if (language !== prevProps.language) {
            let dataPrice = this.buildInputDoctorRequiredInfo(requiredDoctorInfo.resPrice, "PRICE")
            let dataPayment = this.buildInputDoctorRequiredInfo(requiredDoctorInfo.resPayment)
            let dataProvince = this.buildInputDoctorRequiredInfo(requiredDoctorInfo.resProvince)
            let dataSpecialty = this.buildInputDoctorRequiredInfo(requiredDoctorInfo.resSpecialty, "SPECIALTY")
            let dataClinic = this.buildInputDoctorRequiredInfo(requiredDoctorInfo.resClinic, "SPECIALTY")

            this.setState({
                listPrice: dataPrice,
                listPayment: dataPayment,
                listProvince: dataProvince,
                listSpecialty: dataSpecialty,
                listClinic: dataClinic
            })
        }
    }

    buildInputDataSelectDoctor = (data) => {
        const { language } = this.props
        let result = [];

        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let obj = {}

                obj.label = language === LANGUAGES.VI ?
                    `${data[`${i}`].lastName} ${data[`${i}`].firstName}` :
                    `${data[`${i}`].firstName} ${data[`${i}`].lastName}`
                obj.value = data[`${i}`].id

                result.push(obj)
            }
        }
        return result;
    }

    buildInputDoctorRequiredInfo = (data, type = "NONE") => {
        const { language } = this.props
        let result = [];

        if (type === "PRICE") {
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let obj = {}

                    obj.label = language === LANGUAGES.VI ?
                        `${data[`${i}`].valueVi} VND` :
                        `${data[`${i}`].valueEn} USD`
                    obj.value = data[`${i}`].keyMap

                    result.push(obj)
                }
            }
        }
        else if (type === "SPECIALTY") {
            for (let i = 0; i < data.length; i++) {
                let obj = {}

                obj.label = language === LANGUAGES.VI ?
                    `${data[`${i}`].nameVi}` :
                    `${data[`${i}`].nameEn}`
                obj.value = data[`${i}`].id

                result.push(obj)
            }
        }
        else {
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let obj = {}

                    obj.label = language === LANGUAGES.VI ? `${data[`${i}`].valueVi}` : `${data[`${i}`].valueEn}`
                    obj.value = data[`${i}`].keyMap

                    result.push(obj)
                }
            }
        }
        return result;
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }

    handleSaveDetailDoctor = async () => {
        const {
            contentHTML,
            contentMarkdown,
            description,
            selectedDoctor,
            action,
            selectedPayment,
            selectedPrice,
            selectedProvince,
            nameClinic,
            clinicAddress,
            note,
            selectedClinic,
            selectedSpecialty
        } = this.state

        await this.props.saveInfoDoctorRedux({
            contentHTML: contentHTML,
            contentMarkdown: contentMarkdown,
            description: description,
            doctorId: selectedDoctor.value,
            action: action,
            selectedPayment: selectedPayment.value,
            selectedPrice: selectedPrice.value,
            selectedProvince: selectedProvince.value,
            selectedSpecialty: selectedSpecialty.value,
            selectedClinic: selectedClinic.value,
            nameClinic: nameClinic,
            clinicAddress: clinicAddress,
            note: note
        })

        this.setState({
            contentHTML: "",
            contentMarkdown: "",
            description: "",
            doctorId: "",
            action: CRUD_ACTIONS.CREATE,
            selectedPayment: null,
            selectedPrice: null,
            selectedProvince: null,
            selectedSpecialty: null,
            selectedClinic: null,
            selectedDoctor: null,
            nameClinic: "",
            clinicAddress: "",
            note: ""
        })
    }

    handleChangeSelect = async (selectedDoctor, name) => {
        const { listPayment, listProvince, listPrice, listSpecialty, listClinic } = this.state
        this.setState({ selectedDoctor })

        let res = await getDetailInfoDoctor(selectedDoctor.value)
        if (res && res.errCode === 0 && res.data.Markdown) {
            let mardown = res.data.Markdown

            let addressClinicId = '',
                nameClinic = '',
                note = '',
                paymentId = '',
                priceId = '',
                provinceId = '',
                specialtyId = "",
                clinicId = ''
            let selectedPayment = {},
                selectedPrice = {},
                selectedProvince = {},
                selectedSpecialty = {},
                selectedClinic = {}
            if (res.data.Doctor_Info) {
                addressClinicId = res.data.Doctor_Info.addressClinicId
                nameClinic = res.data.Doctor_Info.nameClinic
                note = res.data.Doctor_Info.note
                paymentId = res.data.Doctor_Info.paymentId
                priceId = res.data.Doctor_Info.priceId
                provinceId = res.data.Doctor_Info.provinceId
                specialtyId = res.data.Doctor_Info.specialtyId
                clinicId = res.data.Doctor_Info.selectedClinic

                selectedClinic = listClinic.find(item => item.value === clinicId)
                selectedSpecialty = listSpecialty.find(item => item.value === specialtyId)
                selectedPayment = listPayment.find(item => item.value === paymentId)
                selectedPrice = listPrice.find(item => item.value === priceId)
                selectedProvince = listProvince.find(item => item.value === provinceId)
            }

            this.setState({
                contentHTML: mardown.contentHTML,
                contentMarkdown: mardown.contentMarkdown,
                description: mardown.description,
                hasOldData: true,
                action: CRUD_ACTIONS.EDIT,
                selectedPayment: selectedPayment,
                selectedPrice: selectedPrice,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic,
                nameClinic: nameClinic,
                clinicAddress: addressClinicId,
                note: note,
            })
        } else {
            this.setState({
                contentHTML: "",
                contentMarkdown: "",
                description: "",
                hasOldData: false,
                action: CRUD_ACTIONS.CREATE,
                selectedPayment: null,
                selectedPrice: null,
                selectedProvince: null,
                selectedSpecialty: null,
                selectedClinic: null,
                nameClinic: '',
                clinicAddress: '',
                note: '',
            })
        }
    }

    handleChangeSelectDoctorInfo = (selectedValue, name) => {
        let stateName = name.name
        let copyState = this.state
        copyState[stateName] = selectedValue
        this.setState({ ...copyState })
    }

    handleOnChangeTextInput = (e) => {
        const { name, value } = e.target
        let cpState = this.state
        cpState[name] = value
        this.setState({ ...cpState })
    }

    render() {
        const {
            selectedDoctor,
            description,
            listDoctos,
            contentMarkdown,
            hasOldData,
            listPrice,
            listPayment,
            listProvince,
            selectedPayment,
            selectedPrice,
            selectedProvince,
            nameClinic,
            clinicAddress,
            note,
            selectedClinic,
            selectedSpecialty,
            listClinic,
            listSpecialty,
        } = this.state;
        const {
            isLoading
        } = this.props

        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    <FormattedMessage id="manage-doctor.add-a-doctor" />
                </div>

                {isLoading && <h6 style={{ color: "red" }}>Loading data. . . Please wait!</h6>}
                <div className="more-info">
                    <div className="content-left form-group">
                        <label className="">
                            <FormattedMessage id="manage-doctor.choose-a-doctor" />
                        </label>

                        <Select
                            value={selectedDoctor}
                            onChange={this.handleChangeSelect}
                            options={listDoctos}
                            name="selectedDoctor"
                            placeholder={<FormattedMessage id="manage-doctor.choose-a-doctor" />}
                        />
                    </div>

                    <div className="content-right">
                        <label>
                            <FormattedMessage id="manage-doctor.intro-info" />
                        </label>
                        <textarea
                            rows={4}
                            className="form-control"
                            onChange={this.handleOnChangeTextInput}
                            name="description"
                            value={description}
                        >

                        </textarea>
                    </div>
                </div>

                <div className="more-info-extra row">
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="manage-doctor.choose-a-price" /></label>
                        <Select
                            value={selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listPrice}
                            name="selectedPrice"
                            placeholder={<FormattedMessage id="manage-doctor.choose-a-price" />}
                        />
                    </div>

                    <div className="col-4 form-group">
                        <label><FormattedMessage id="manage-doctor.payment" /></label>
                        <Select
                            value={selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listPayment}
                            name="selectedPayment"
                            placeholder={<FormattedMessage id="manage-doctor.payment" />}
                        />
                    </div>

                    <div className="col-4 form-group">
                        <label><FormattedMessage id="manage-doctor.choose-a-province" /></label>
                        <Select
                            value={selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listProvince}
                            name="selectedProvince"
                            placeholder={<FormattedMessage id="manage-doctor.choose-a-province" />}
                        />
                    </div>

                    <div className="col-4 form-group">
                        <label><FormattedMessage id="manage-doctor.clinic-name" /></label>
                        <input
                            className="form-control"
                            name="nameClinic"
                            value={nameClinic}
                            onChange={this.handleOnChangeTextInput}
                        />
                    </div>

                    <div className="col-4 form-group">
                        <label><FormattedMessage id="manage-doctor.clinic-address" /></label>
                        <input
                            className="form-control"
                            value={clinicAddress}
                            name="clinicAddress"
                            onChange={this.handleOnChangeTextInput}
                        />
                    </div>

                    <div className="col-4 form-group">
                        <label><FormattedMessage id="manage-doctor.note" /></label>
                        <input
                            className="form-control"
                            value={note}
                            name="note"
                            onChange={this.handleOnChangeTextInput}
                        />
                    </div>

                </div>

                <div className='row'>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="manage-doctor.select-specialty" /></label>
                        <Select
                            value={selectedSpecialty}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listSpecialty}
                            name="selectedSpecialty"
                            placeholder={<FormattedMessage id="manage-doctor.select-specialty" />}
                        />
                    </div>

                    <div className="col-4 form-group">
                        <label><FormattedMessage id="manage-doctor.select-clinic" /></label>
                        <Select
                            value={selectedClinic}
                            onChange={this.handleChangeSelectDoctorInfo}
                            options={listClinic}
                            name="selectedClinic"
                            placeholder={<FormattedMessage id="manage-doctor.select-clinic" />}
                        />
                    </div>
                </div>

                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={contentMarkdown}
                    />
                </div>
                {
                    hasOldData ? (
                        <button
                            className="save-content-doctor"
                            onClick={this.handleSaveDetailDoctor}
                        >
                            <span>
                                <FormattedMessage id="manage-doctor.edit" />
                            </span>
                        </button>
                    ) : (
                        <button
                            className="create-content-doctor"
                            onClick={this.handleSaveDetailDoctor}
                        >
                            <span>
                                <FormattedMessage id="manage-doctor.save" />
                            </span>
                        </button>
                    )
                }

            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        requiredDoctorInfo: state.admin.requiredDoctorInfo,
        isLoading: state.admin.isLoading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchALLDoctor: () => dispatch(actions.fetchALLDoctor()),
        getRequiredDoctorInfo: () => dispatch(actions.getDoctorRequiredInfo()),
        saveInfoDoctorRedux: (data) => dispatch(actions.saveInfoDoctorRedux(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
