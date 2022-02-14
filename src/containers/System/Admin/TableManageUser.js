import React, { Component } from 'react';
import "./TableManageUser.scss"
import { connect } from 'react-redux';
import * as actions from '../../../store/actions'

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// import { getAllUser, createUserService, deleteUser, editUser } from '../../services/userService';
// import ModalUser from './Modal'
// import ModalEditUser from './ModalEditUser';
// import { emitter } from '../../utils/index'

// emitter xử  lí được cả thằng cha và thằng con
// là 1 cái của nodejs

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
    console.log('handleEditorChange', html, text);
}


class TableManageUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userRedux: []
        }
    }

    componentDidMount() {
        this.props.fetchAllUserRedux()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.users !== this.props.users) {
            this.setState({
                userRedux: this.props.users
            })
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteAUser(user.id)
    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParent(user)
    }

    render() {
        const { userRedux } = this.state
        return (
            <React.Fragment>
                <table id="table-manage-user">
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <th>First name</th>
                            <th>Last Name</th>
                            <th>Birthday</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                        {userRedux && userRedux.map((item, i) => (
                            <tr key={i}>
                                <td>{item.email}</td>
                                <td>{item.firstName}</td>
                                <td>{item.lastName}</td>
                                <td>{item.birthday}</td>
                                <td>{item.address}</td>
                                <td>
                                    <button
                                        className="btn-edit"
                                        onClick={() => {
                                            this.handleEditUser(item)
                                        }}
                                    >
                                        <i className="fas fa-pencil-alt "></i>
                                    </button>
                                    <button className="btn-delete"
                                        onClick={() => this.handleDeleteUser(item)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />

            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        users: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteAUser: (id) => dispatch(actions.deleteAUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
