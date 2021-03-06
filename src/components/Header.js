import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Header extends Component {

    historyBack = () => {
        const { history, location } = window;

        history.length > 2 ? history.back() : location.assign(process.env.PUBLIC_URL || '/')
    }

    render() {
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
                    name: 'Edit task',
                    here: pathName.includes('edit-task'),
                    text: `Edit task`,
                },
                {
                    name: 'Search',
                    here: pathName.includes('search'),
                    text: 'Search by keywords',
                },
                {
                    name: 'Storage management',
                    here: pathName.includes('storage-management'),
                    text: 'Storage management',
                },
                {
                    name: 'Statistics',
                    here: pathName.includes('statistics'),
                    text: 'Statistics',
                }
            ],
            currentPage = pages.find(elem => elem.here) || '',
            buttonText = currentPage ? currentPage.text : `${currentMonth}, ${currentYear}`;

        return (
            <header className="control-panel">
                {currentPage.name === 'Add task' ?
                    <button
                        className='btn btn-add activated'
                        onClick={this.historyBack}
                        title="Back to the previous screen"
                    >
                        Back to the previous screen
                    </button> :
                    currentPage.name === 'Edit task' ?
                        <button
                            className='btn btn-edit-task activated'
                            onClick={this.historyBack}
                            title="Back to the previous screen"
                        >
                            Back to the previous screen
                        </button> :
                        <Link to="/add-task"
                            className='btn btn-add'
                            draggable="false"
                            title="Add new task"
                        >
                            Add new task
                        </Link>
                }

                {currentPage ? // !== Main page
                    <div className="btn btn-select-month disabled">{buttonText}</div> :
                    <Link
                        to="/select-month"
                        className="btn btn-select-month"
                        draggable="false"
                        title="Select month"
                    >
                        {buttonText}
                    </Link>
                }

                {currentPage.name === 'Search' ?
                    <button
                        className="btn btn-open-search activated"
                        onClick={this.historyBack}
                        title="Back to the previous screen"
                    >
                        Back
                    </button> :
                    <Link
                        to="/search"
                        className="btn btn-open-search"
                        onClick={() => updateLastSearch('')}
                        draggable="false"
                        title="Open search"
                    >
                        Open search
                    </Link>
                }
            </header>
        )
    }
}

export default Header
