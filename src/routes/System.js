import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';

class System extends Component {
    getRedirectLink = () => {
        const { userInfo, systemMenuPath, doctorMenuPath, patientMenuPath } = this.props
        if (userInfo) {
            switch (userInfo.roleId) {
                case "R1":
                    return systemMenuPath
                case "R2":
                    return doctorMenuPath
                default:
                    return patientMenuPath
            }
        }
    }
    render() {
        const { isLoggedIn } = this.props;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/system/home-page" component={UserManage} />
                            <Route path="/system/user-manage" component={UserRedux} />
                            <Route path="/system/manage-doctor" component={ManageDoctor} />
                            <Route path="/system/manage-specialty" component={ManageSpecialty} />
                            <Route path="/system/manage-clinic" component={ManageClinic} />

                            <Route component={() => {
                                return (<Redirect to={this.getRedirectLink()} />)
                            }} />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        doctorMenuPath: state.app.doctorMenuPath,
        patientMenuPath: state.app.patientMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
