import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils'
import * as actions from '../../../store/actions'
import "./UserRedux.scss"

import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import TableManageUser from './TableManageUser';

class UserRedux extends Component {
    constructor(props) {
        super(props)
        this.state = {
            genderArr: [],
            roleArr: [],
            positionArr: [],
            previewImg: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avartar: '',
            id: '',
            birthday: '',
            action: CRUD_ACTIONS.CREATE
        }
    }

    componentDidUpdate(prevProps) {
        const { genderRedux, roleRedux, positionRedux, users } = this.props
        if (prevProps.genderRedux !== genderRedux) {
            this.setState({
                genderArr: genderRedux,
                gender: genderRedux[0] ? genderRedux[0].keyMap : "M"
            })
        }
        if (prevProps.roleRedux !== roleRedux) {
            console.log(roleRedux)
            this.setState({
                roleArr: roleRedux,
                role: roleRedux[0] ? roleRedux[0].keyMap : "R1"
            })
        }
        if (prevProps.positionRedux !== positionRedux) {
            this.setState({
                positionArr: positionRedux,
                position: positionRedux[0] ? positionRedux[0].keyMap : "P0"
            })
        }
        if (prevProps.users !== users) {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: genderRedux[0] ? genderRedux[0].keyMap : "M",
                position: positionRedux[0] ? positionRedux[0].kekeyMapy : "P0",
                role: roleRedux[0] ? roleRedux[0].keyMap : "R1",
                avartar: '',
                id: '',
                action: CRUD_ACTIONS.CREATE,
                previewImg: '',
                birthday: ''
            })
        }
    }

    componentDidMount() {
        this.props.getGenderStart()
        this.props.getRoleStart()
        this.props.getPositionStart()
    }

    handleChangeImg = async (files) => {
        if (files) {
            let file = files[0]

            //encode user image
            let b64 = await CommonUtils.getBase64(file)
            let imgUrl = URL.createObjectURL(file)
            this.setState({
                previewImg: imgUrl,
                avartar: b64
            })
        }
    }

    validateInput = () => {
        let isValid = true;
        const validate = [
            "email",
            "password",
            "firstName",
            "lastName",
            "phoneNumber",
            "address"
        ]
        for (let i = 0; i < validate.length; i++) {
            if (!this.state[validate[i]]) {
                alert("Missing parrameter: " + validate[i])
                isValid = false
                break;
            }
        }

        return isValid
    }

    handleSaveUser = () => {
        this.setState({ isLoading: true })
        const {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
            gender,
            role,
            position,
            avartar,
            action,
            id,
            birthday
        } = this.state

        let isValid = this.validateInput()
        if (!isValid) return

        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createUser({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                address: address,
                phoneNumber: phoneNumber,
                gender: gender,
                roleId: role,
                positionId: position,
                image: avartar || "",
                birthday: birthday
            })
        } else if (action === CRUD_ACTIONS.EDIT) {
            this.props.editAUser({
                id: id,
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                address: address,
                phoneNumber: phoneNumber,
                gender: gender,
                roleId: role,
                positionId: position,
                image: avartar || "",
                birthday: birthday
            })
        }
        this.setState({ isLoading: false })
    }

    onChangInput = (event) => {
        const { name, value } = event.target
        this.setState({
            ...this.state,
            [name]: value
        })
    }

    handleEditUserFromParent = (user) => {
        let imageBase64 = ""

        //decode user image
        if (user.image) {
            imageBase64 = Buffer.from(user.image, 'base64').toString('binary')
        }

        this.setState({
            email: user.email,
            password: "hashcode",
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            position: user.positionId,
            role: user.roleId,
            avartar: "",
            previewImg: imageBase64,
            id: user.id,
            birthday: user.birthday,
            action: CRUD_ACTIONS.EDIT
        })
    }

    render() {
        const {
            genderArr,
            roleArr,
            positionArr,
            previewImg,
            isOpen,
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
            role,
            position,
            gender,
            birthday,
            action
        } = this.state
        const { language, isLoading } = this.props
        return (
            <div className="user-redux-container">
                <div className="title">
                    <FormattedMessage id="manage-user.add" />
                </div>
                <div className="mt-3" />
                <div className="user-redux-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">{isLoading && "Loading ..."}</div>
                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="manage-user.email" />
                                </label>
                                <input
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={this.onChangInput}
                                    disabled={action === CRUD_ACTIONS.EDIT && true}
                                />
                            </div>

                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input
                                    className="form-control"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={this.onChangInput}
                                    disabled={action === CRUD_ACTIONS.EDIT && true}
                                />
                            </div>

                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.first-name" /></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="firstName"
                                    value={firstName}
                                    onChange={this.onChangInput}
                                />
                            </div>

                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.last-name" /></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="lastName"
                                    value={lastName}
                                    onChange={this.onChangInput}
                                />
                            </div>

                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.phone-number" /></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="phoneNumber"
                                    value={phoneNumber}
                                    onChange={this.onChangInput}
                                />
                            </div>

                            <div className="col-9">
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="address"
                                    value={address}
                                    onChange={this.onChangInput}
                                />
                            </div>

                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.gender" /></label>
                                <select
                                    className="form-control"
                                    name="gender"
                                    onChange={this.onChangInput}
                                    value={gender}
                                >
                                    {genderArr && genderArr.length > 0 && (
                                        genderArr.map((item, index) => (
                                            <option
                                                value={item.keyMap}
                                                key={index}
                                            >
                                                {
                                                    language === LANGUAGES.VI ?
                                                        item.valueVi :
                                                        item.valueEn
                                                }
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.role" /></label>
                                <select
                                    className="form-control"
                                    name="role"
                                    onChange={this.onChangInput}
                                    value={role}
                                >
                                    {roleArr && roleArr.length > 0 && (
                                        roleArr.map((item, index) => (
                                            <option
                                                key={index}
                                                value={item.keyMap}
                                            >
                                                {
                                                    language === LANGUAGES.VI ?
                                                        item.valueVi :
                                                        item.valueEn
                                                }
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.position" /></label>
                                <select
                                    className="form-control"
                                    name="position"
                                    onChange={this.onChangInput}
                                    value={position}
                                >
                                    {positionArr && positionArr.length > 0 && (
                                        positionArr.map((item, index) => (
                                            <option
                                                key={index}
                                                value={item.keyMap}
                                            >
                                                {
                                                    language === LANGUAGES.VI ?
                                                        item.valueVi :
                                                        item.valueEn
                                                }
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.birthday" /></label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="birthday"
                                    value={birthday}
                                    onChange={this.onChangInput}
                                />
                            </div>

                            <div className="col-3">
                                <label>
                                    <FormattedMessage id="manage-user.image" />
                                </label>
                                <div className="preview-image-container">
                                    <input
                                        type="file"
                                        id="previewImg" hidden
                                        onChange={(e) => this.handleChangeImg(e.target.files)}
                                    />
                                    <label className="lable-upload" htmlFor="previewImg">
                                        <FormattedMessage id="manage-user.upload" />
                                        <i className="fas fa-upload  px-3" />
                                    </label>
                                    <div
                                        className="preview-img"
                                        style={{
                                            backgroundImage: `url(${previewImg})`
                                        }}
                                        onClick={previewImg ? (() => this.setState({ isOpen: true })) : () => { }}
                                    />
                                </div>
                            </div>

                            <div className="col-12 my-3">
                                <button
                                    className={action === CRUD_ACTIONS.EDIT ? "btn btn-warning" : "btn btn-primary"}
                                    onClick={this.handleSaveUser}
                                >
                                    {action === CRUD_ACTIONS.EDIT ?
                                        <FormattedMessage id="manage-user.edit" /> :
                                        <FormattedMessage id="manage-user.save" />
                                    }
                                </button>
                            </div>

                            <div className="col-12 mb-5">
                                <TableManageUser
                                    handleEditUserFromParent={this.handleEditUserFromParent}
                                    action={action}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {isOpen && (
                    <Lightbox
                        mainSrc={previewImg}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                )}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        isLoading: state.admin.isLoading,
        users: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPostionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createUser: (data) => dispatch(actions.createUser(data)),
        fetchAllUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editAUser: (user) => dispatch(actions.editAUser(user))
        // processLogout: () => dispatch(actions.processLogout()),
        // changeLanguageApp: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
