import React, { Component } from 'react'
import '../logo.css';

class Logo extends Component {
    render() {
        const { style, href, type } = this.props,
            logoStyle = style ? {
                '--initialColor': '#000b80',
                '--width': style.width,
                '--bgColor': style.bgColor,
                '--logoColor': style.logoColor,
                '--shadowColor': style.shadowColor
            } : {}

        return (
            <a href={href ? href: '/'} className={`logo ${type ? type : ''}`} style={logoStyle}>
                <p className="letter">R <span>OMAN</span></p>
                <p className="letter">P <span>OPOV</span></p>
                <div className="hex-corner hex-pt1"></div>
                <div className="hex-corner hex-pt2"></div>
            </a>
        )
    }
}

export default Logo
