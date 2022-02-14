import React, { Component } from 'react'
import { connect } from 'react-redux';


class HomeFooter extends Component {
    render() {
        return (
            <div className="home-footer">
                <p>&copy; 2021 Augustus Flynn.
                    More infomation...<br />
                    <span className="facebook">
                        <a
                            rel="noreferrer"
                            target="_blank" href="https://www.facebook.com/huytung.novers/"
                            style={{ marginRight: "10px" }}
                        >
                            <i className="fab fa-facebook"></i>
                            Facebook
                        </a>
                    </span>
                    <span className="github">
                        <a
                            rel="noreferrer"
                            target="_blank" href="https://github.com/augustustung"
                        >
                            <i className="fab fa-github"></i>
                            Github
                        </a>
                    </span>
                </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
