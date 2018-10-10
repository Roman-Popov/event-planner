import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Header extends Component {
    render() {
        const { currentMonth, currentYear, updateLastSearch } = this.props,
            buttonText = `${currentMonth}, ${currentYear}`,
            pathNames = window.location.href.split('/')

        return (
            <header className="control-panel">
                <Link to="/add-task" className="btn btn-add">+</Link>

                {(pathNames.includes('select-month')) ?
                        <div className="btn btn-select-month disabled">Select month</div> :
                        (pathNames.includes('day-details')) ?
                            <div className="btn btn-select-month disabled">{buttonText}</div> :
                            (pathNames.includes('add-task')) ?
                                <div className="btn btn-select-month disabled">Add new task</div> :
                                <Link to="/select-month" className="btn btn-select-month">{buttonText}</Link>
                }

                <Link to="/search" className="btn btn-open-search" onClick={() => updateLastSearch('')}>Open search</Link>
            </header>
        )
    }
}

export default Header
