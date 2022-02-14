import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import './Register.scss';
import { createUserService } from '../../services/userService';
import Select from 'react-select'
import { withRouter } from 'react-router'
import { toast } from 'react-toastify'

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            address: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            birthday: "",
            selectedGender: null,
            listGenders: [],
            confirmpass: "",
            isShowPassword: false,
            err: ""
        };
    }

    async componentDidMount() {
        await this.props.fetchGender()
        const { genders } = this.props
        if(genders && genders.length > 0) {
            this.setState({
                listGenders: this.buildDataGender(genders)
            })
        }
    }

    componentDidUpdate(prevProps) {
        const { genders } = this.props
        if (prevProps.genders.length !== genders.length) {
            this.setState({
                listGenders: this.buildDataGender(genders)
            })
        }
    }

    handleShowPassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    buildDataGender = (data) => {
        let result = []

        if (data && data.length > 0) {
            data.map(item => {
                let obj = {}
                obj.label = item.valueVi
                obj.value = item.keyMap
                result.push(obj)

                return item
            })
        }

        return result
    }

    validatePass = () => {
        const { password, confirmpass } = this.state
        if (confirmpass !== password || !password || !confirmpass)
            return false;

        return true;
    }

    handleRegister = async () => {
        if (!this.validatePass()) {
            this.setState({
                err: "Your password don't match. Please try again!"
            })
        } else {
            const {
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                address,
                selectedGender,
                birthday
            } = this.state
            //call api
            console.log('hceckcea', selectedGender)
            if (!selectedGender) {
                this.setState({
                    err: "Your gender isn't valid. Please try again!"
                })
            } else {
                let message = await createUserService({
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    address: address,
                    gender: selectedGender.value,
                    birthday: birthday
                })

                if (message && message.errCode === 0) {
                    toast.success(message.message)
                    this.props.history.goBack()
                } else {
                    this.setState({ err: message.errMessage })
                }
            }
        }
    }

    handleChangeSelect = (selectedGender) => {
        this.setState({ selectedGender: selectedGender })
    }

    handleChangeText = (e) => {
        const { name, value } = e.target
        let cpState = this.state
        cpState[name] = value
        this.setState(cpState)
    }

    render() {
        const {
            email,
            password,
            isShowPassword,
            err,
            selectedGender,
            listGenders,
            confirmpass,
            firstName,
            lastName,
            address,
            phoneNumber,
            birthday
        } = this.state

        return (
            <div className="login-bg">
                <h2 className="title">
                    Register
                </h2>

                <div className="row form-group register-form">
                    <div className="col-4 form-group">
                        <input
                            placeholder="email"
                            name="email"
                            type="text"
                            className="form-control"
                            value={email}
                            onChange={this.handleChangeText}
                        />
                    </div>

                    <div className="col-4 form-group">
                        <div className="input-password">
                            <input
                                placeholder="password"
                                name="password"
                                type={isShowPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={this.handleChangeText}
                            />
                            <span
                                className="icon-password"
                                onClick={this.handleShowPassword}
                            >
                                <i className={isShowPassword ? "far fa-eye" : "far fa-eye-slash"}></i>
                            </span>
                        </div>

                    </div>


                    <div className="col-4 form-group">
                        <div className="input-password">
                            <input
                                placeholder="confirm password"
                                name="confirmpass"
                                type={isShowPassword ? "text" : "password"}
                                className="form-control"
                                value={confirmpass}
                                onChange={this.handleChangeText}
                            />
                            <span
                                className="icon-password"
                                onClick={this.handleShowPassword}
                            >
                                <i className={isShowPassword ? "far fa-eye" : "far fa-eye-slash"}></i>
                            </span>
                        </div>
                    </div>

                    <div className="col-4 form-group">
                        <input
                            placeholder="first name"
                            name="firstName"
                            type="text"
                            className="form-control"
                            value={firstName}
                            onChange={this.handleChangeText}
                        />
                    </div>

                    <div className="col-4 form-group">
                        <input
                            placeholder="last name"
                            name="lastName"
                            type="text"
                            className="form-control"
                            value={lastName}
                            onChange={this.handleChangeText}
                        />
                    </div>

                    <div className="col-4 form-group">
                        <input
                            placeholder="DD/MM/YYY"
                            name="birthday"
                            type="text"
                            className="form-control"
                            value={birthday}
                            onChange={this.handleChangeText}
                        />
                    </div>

                    <div className="col-4 form-group">
                        <input
                            placeholder="address"
                            name="address"
                            type="text"
                            className="form-control"
                            value={address}
                            onChange={this.handleChangeText}
                        />
                    </div>

                    <div className="col-4 form-group ">
                        <input
                            placeholder="phone number"
                            name="phoneNumber"
                            type="text"
                            className="form-control"
                            value={phoneNumber}
                            onChange={this.handleChangeText}
                        />
                    </div>

                    <Select
                        value={selectedGender}
                        className="col-4"
                        onChange={this.handleChangeSelect}
                        options={listGenders}
                        placeholder="Select gender"
                    />

                    {err && (
                        <div className='login-error col-12'>
                            <span className='error'>{err}</span>
                        </div>
                    )}
                    <div className="col-12" style={{ height: '30px' }} />
                    <div className="form-group btn-register">
                        <button
                            onClick={this.handleRegister}
                            className="btn"
                        >Sign up</button>

                    </div>
                </div>
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        genders: state.admin.genders,
    };
};



const mapDispatchToProps = dispatch => {
    return {
        fetchGender: () => dispatch(actions.fetchGenderStart())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
