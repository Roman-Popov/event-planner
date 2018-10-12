import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Header extends Component {
    render() {
        console.log('render cp')

        const { currentMonth, currentYear, updateLastSearch } = this.props,
            pathName = window.location.pathname,
            pages = [
                {
                    name: 'Add task',
                    here: pathName.includes('add-task'),
                    text: 'Add new task',
                },
                {
                    name: 'Select month',
                    here: pathName.includes('select-month'),
                    text: 'Select month',
                },
                {
                    name: 'Day details',
                    here: pathName.includes('day-details'),
                    text: `${currentMonth}, ${currentYear}`,
                },
                {
                    name: 'Search',
                    here: pathName.includes('search'),
                    text: 'Search by keywords',
                }
            ],
            currentPage = pages.find(elem => elem.here) || '',
            buttonText = currentPage ? currentPage.text : `${currentMonth}, ${currentYear}`;

        return (
            <header className="control-panel">
                {currentPage.name === 'Add task' ?
                    <div className='btn btn-add disabled'></div> :
                    <Link to="/add-task" className='btn btn-add'>Add new task</Link>
                }

                {currentPage ? // !== Main page
                    <div className="btn btn-select-month disabled">{buttonText}</div> :
                    <Link to="/select-month" className="btn btn-select-month">{buttonText}</Link>
                }

                {currentPage.name === 'Search' ?
                    <div className="btn btn-open-search disabled"></div> :
                    <Link to="/search" className="btn btn-open-search" onClick={() => updateLastSearch('')}>Open search</Link>
                }
            </header>
        )
    }
}

export default Header
