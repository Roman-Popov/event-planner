import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Header extends Component {
    render() {
        const { currentMonth, currentYear } = this.props,
            buttonText = `${currentMonth}, ${currentYear}`,
            pathNames = window.location.href.split('/')

        return (
            <header className="control-panel">
                <Link to="/add-task" className="btn btn-add">+</Link>

                {(pathNames.indexOf('select-month') !== -1) ?
                        <div className="btn btn-select-month disabled">Select month</div> :
                    (pathNames.indexOf('day-details') !== -1) ?
                        <div className="btn btn-select-month disabled">{buttonText}</div> :
                    <Link to="/select-month" className="btn btn-select-month">{buttonText}</Link>
                }

                <Link to="/search" className="btn btn-open-search">Open search</Link>
            </header>
        )
    }
}

export default Header
