import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class MainPage extends Component {
    state = {
        openedDetails: []
    }

    componentWillMount() {
        this.props.initLocalData()
    }

    toggleDetails = (targetBtn) => {
        const details = targetBtn.parentNode.nextElementSibling;
        details.classList.toggle('shown')
        details.classList.contains('shown') ? targetBtn.innerHTML = 'Hide notes' : targetBtn.innerHTML = 'Show notes';
        this.showOnlyFewDetails(details)
    }

    showOnlyFewDetails = (detailItem) => {
        let openedDetails = this.state.openedDetails.map(detail => detail);

        if (detailItem.classList.contains('shown')) {
            if (openedDetails.indexOf(detailItem) !== -1) {
                // Delete detailItem from stack
                openedDetails = openedDetails.filter(item => item !== detailItem)
            } else if (openedDetails.length > 3) {
                const closedItem = openedDetails.splice(0, 1);
                closedItem[0].classList.remove('shown');
                closedItem[0].parentNode.querySelector('button').innerHTML = 'Show notes'
            }

            // Add detailItem to stack
            openedDetails.push(detailItem)
            this.setState({ openedDetails: openedDetails })
        }
    }

    createList = () => {
        const { currentMonth, currentYear, daysInMonth, dayDataToState } = this.props,
            listDays = [],
            weekend = ['Sat', 'Sun'],
            monthData = JSON.parse(localStorage.getItem(`${currentMonth}-${currentYear}`));


        for (let i = 0; i < daysInMonth; i++) {
            const dayData = monthData[i],
                day = dayData.day,
                weekdayName = dayData.wdName.slice(0,3),
                dayTasks = dayData.tasks;

            listDays.push(
                <li key={day} data-weekend={weekend.indexOf(weekdayName) !== -1}>
                    <Link
                        to={`/day-details/${ day }-${ currentMonth }-${ currentYear }`}
                        className="business-day"
                        onClick={() => dayDataToState(dayData)}
                    >
                        <span className="day-of-week">
                            {weekdayName}
                        </span>
                        <span className="day-of-month">{day}</span>
                    </Link>

                    <div className={`day-data ${dayData.work ? '' : 'day-off'}`}>
                        {dayTasks.length ? dayTasks.map(task => (
                            <section key={`${task.time}-${task.name}`}>
                                <div className="main-info">
                                    <time>{task.time}</time>
                                    <h4>{task.name}</h4>
                                    {task.notes && <button className="summary" onClick={e => this.toggleDetails(e.target)}>
                                        Show notes
                                    </button>}
                                </div>
                                <div className="details">
                                    <p>{task.notes}</p>
                                </div>
                            </section>
                        )) : <span className="no-tasks">There is no tasks yet</span>}
                    </div>
                </li>
            )
        }
        return listDays
    }

    render() {
        return (
            <nav className="list-days">
                <ul>
                    {this.createList()}
                </ul>
            </nav>
        )
    }
}

export default MainPage
