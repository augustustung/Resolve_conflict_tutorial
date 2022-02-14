import React, { Component } from 'react';
import "./TableManageSpecialty.scss"
import { connect } from 'react-redux';

class TableManageSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    async componentDidMount() {

    }

    componentDidUpdate(prevProps) {
    }

    handleDelete = (user) => {
        this.props.deleteFromParent(user.id)
    }

    handleEdit = (user) => {
        this.props.handleEditFromParent(user)
    }

    render() {
        const { data } = this.props
        return (
            <React.Fragment>
                <table id="table-manage-user">
                    <tbody>
                        <tr>
                            <th>Tên phòng khám</th>
                            <th>Specialty's name</th>
                            <th>Action</th>
                        </tr>
                        {data && data.map((item, i) => (
                            <tr key={i}>
                                <td>{item.nameVi}</td>
                                <td>{item.nameEn}</td>
                                <td>
                                    <button
                                        className="btn-edit"
                                        onClick={() => {
                                            this.handleEdit(item)
                                        }}
                                    >
                                        <i className="fas fa-pencil-alt "></i>
                                    </button>
                                    <button className="btn-delete"
                                        onClick={() => this.handleDelete(item)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageSpecialty);
