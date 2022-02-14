import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSpecialty.scss'
import { FormattedMessage } from 'react-intl'
//import markdonw
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
//
import { CRUD_ACTIONS, CommonUtils } from '../../../utils'
import { createNewSpecialty, getAllSpecialties, deleteSpecialty, editSpecialty } from '../../../services/userService'
import { toast } from 'react-toastify';
import TableManageSpecialty from './TableManageSpecialty';

const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageSpecialty extends Component {
    constructor(props) {
        super(props)

        this.state = {
            nameVi: "",
            nameEn: "",
            imgBase64: "",
            descriptionHTML: "",
            descriptionMarkdown: "",
            descriptionMarkdown: "",
            allSpecialty: [],
            action: CRUD_ACTIONS.CREATE,
            id: ''
        }
    }

    async componentDidMount() {
        await this.fetchDataSpecialty()
    }

    fetchDataSpecialty = async () => {
        let res = await getAllSpecialties()
        if (res && res.errCode === 0) {
            this.setState({
                allSpecialty: res.data
            })
        }
    }

    async componentDidUpdate(prevProps) {

    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionMarkdown: text,
            descriptionHTML: html,
        })
    }

    handleChangeText = (e) => {
        const { value, name } = e.target
        let copyState = this.state
        copyState[name] = value
        this.setState({ ...copyState })
    }

    handleChangeImg = async (files) => {
        if (files) {
            let file = files[0]

            //encode user image
            let b64 = await CommonUtils.getBase64(file)
            //to preview img //
            // let imgUrl = URL.createObjectURL(file)
            this.setState({
                imgBase64: b64
            })
        }
    }

    handleSubmit = async () => {
        const {
            action,
            nameVi,
            nameEn,
            imgBase64,
            descriptionHTML,
            descriptionMarkdown,
            id
        } = this.state

        if (action === CRUD_ACTIONS.CREATE) {
            let res = await createNewSpecialty({
                nameVi,
                nameEn,
                descriptionHTML,
                descriptionMarkdown,
                imgBase64
            })

            if (res && res.errCode === 0) {
                toast.success(res.message)
                this.setState({
                    nameVi: "",
                    nameEn: "",
                    imgBase64: "",
                    descriptionHTML: "",
                    descriptionMarkdown: "",
                    action: CRUD_ACTIONS.CREATE
                })
            }
            else
                toast.error(res.errMessage)
        } else {
            let res = await editSpecialty({
                nameVi,
                nameEn,
                image: imgBase64,
                descriptionHTML,
                descriptionMarkdown,
                id
            })
            if (res && res.errCode === 0) {
                toast.success(res.message)
                this.setState({
                    nameVi: "",
                    nameEn: "",
                    imgBase64: "",
                    descriptionHTML: "",
                    descriptionMarkdown: "",
                    action: CRUD_ACTIONS.CREATE,
                    id: ""
                })
            }
            else
                toast.error(res.errMessage)
        }

        await this.fetchDataSpecialty()
    }

    deleteFromParent = async (id) => {
        let message = await deleteSpecialty(id)
        if (message && message.errCode === 0) {
            toast.success(message.message)
        } else {
            toast.error(message.errMessage)
        }

        await this.fetchDataSpecialty()
    }

    handleEditFromParent = async (item) => {
        this.setState({
            nameVi: item.nameVi,
            nameEn: item.nameEn,
            image: item.image,
            descriptionHTML: item.descriptionHTML,
            descriptionMarkdown: item.descriptionMarkdown,
            action: CRUD_ACTIONS.EDIT,
            id: item.id
        })
    }

    render() {
        const { descriptionMarkdown, nameVi, nameEn, allSpecialty } = this.state

        return (
            <div className="manage-specialty-container">
                <div className="ms-title">

                </div>

                <div className="add-new-specialty row">
                    <div className="col-3 form-group">
                        <label>
                            Tên chuyên khoa
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            name="nameVi"
                            value={nameVi}
                            onChange={this.handleChangeText}
                        />
                    </div>

                    <div className="col-3 form-group">
                        <label>
                            Specialty's name
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            name="nameEn"
                            value={nameEn}
                            onChange={this.handleChangeText}
                        />
                    </div>

                    <div className="col-6">
                        <FormattedMessage id="manage-specialty.specialty-img" />
                        <input
                            className="form-control-file"
                            type="file"
                            onChange={(e) => this.handleChangeImg(e.target.files)}
                        />
                    </div>
                    <div className="col-12">
                        <MdEditor
                            style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={descriptionMarkdown}
                        />
                    </div>

                    <div className="col-12">
                        <button className="btn-save-specialty" onClick={this.handleSubmit}>
                            <FormattedMessage id="manage-specialty.save" />
                        </button>
                    </div>
                </div>
                <TableManageSpecialty
                    data={allSpecialty}
                    deleteFromParent={this.deleteFromParent}
                    handleEditFromParent={this.handleEditFromParent}
                />
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
