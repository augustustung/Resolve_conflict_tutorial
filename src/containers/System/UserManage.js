import React, { useEffect } from 'react';
import "./UserManage.scss"
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux';

const arrButton = [
  {
    path: "/system/user-manage",
    name: <FormattedMessage id='menu.admin.crud-redux' />
  },
  {
    path: '/system/manage-doctor',
    name: <FormattedMessage id="menu.admin.manage-doctor" />
  },
  {
    path: '/doctor/manage-schedule',
    name: <FormattedMessage id="menu.doctor.manage-schedule" />
  },
  {
    path: "/system/manage-clinic",
    name: <FormattedMessage id="menu.admin.manage-clinic" />
  },
  {
    path: "/system/manage-specialty",
    name: <FormattedMessage id="menu.admin.manage-specialty" />
  },
  {
    path: '/doctor/manage-patient',
    name: <FormattedMessage id="menu.doctor.manage-patient" />
  }
]

function UserManage() {
  const history = useHistory()
  const { userInfo } = useSelector(state => state.user)

  useEffect(() => {
    if (userInfo) {
      if (userInfo.roleId === "R3") {
        history.replace('/home')
      }
      if (userInfo.roleId === "R2") {
        history.replace('/doctor/manage-schedule')
      }
    }
  }, [userInfo])

  return (
    <div className="bg px-3">
      <div className="title text-center"> Manage users with Augustus Flynn</div>
      <div className="w-100 pt-5">
        <div className="d-flex justify-content-center">
          <div className="h5">
            <FormattedMessage id="homeheader.landing" />
          </div>
        </div>
        <div className="d-flex justify-content-center pt-3">
          <div className="row">
            {
              arrButton.map(item => {
                return (<div className="col-12 col-md-4">
                  <button onClick={() => history.push(item.path)} className="custom-button">
                    {item.name}
                  </button>
                </div>)
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManage;
