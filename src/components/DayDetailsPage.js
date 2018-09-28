import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class DayDetailsPage extends Component {

    state = {
        dayData: ''
    }

    componentWillMount() {
        this.getDayData();
    }

    getDayData = () => {
        const { dayData, updateDate } = this.props

        if (dayData.day) {
            // Day Data is in props
            this.setState({ dayData: dayData })
        } else {
            // Get info from URL (in case of page reload)
            const dateFromURL = document.location.pathname.split('/day-details/').pop().split('-'),
                monthURL = dateFromURL[1],
                yearURL = dateFromURL[2],
                storedData = localStorage.getItem(monthURL + yearURL),
                storedDay = dateFromURL[0] - 1;
                if (storedData) {
                    updateDate(monthURL, yearURL)
                    this.setState({ dayData: JSON.parse(storedData)[storedDay]})
                } else {
                    // Go to the main page if stored data was not found (or in case of invalid URL)
                    window.location.replace("/");
                }
        }
    }

    render() {
        const dayData = this.state.dayData,
            dayTasks = dayData.tasks,
            dayName = dayData.wdName,
            weekend = ['Saturday', 'Sunday'];

        return (
            <section className="day-details">
                <div className="header-wrapper" data-weekend={weekend.indexOf(dayName) !== -1}>
                    <header>
                        <Link to="/" className="btn btn-back">Back</Link>
                        <h1>{dayData.day}</h1>
                        <span className="day-of-week">{dayName}</span>
                        <button className="btn btn-delete">Clear tasks</button>
                    </header>
                </div>
                <div className="tasks-wrapper">
                    {dayTasks.length ? dayTasks.map(task => (
                        <div key={`${task.time}-${task.name}`} className="task">
                            <time className="task-time">{task.time}</time>
                            <article className="task-info">
                                <h2>{task.name}</h2>
                                {task.notes && <p className="details">{task.notes}</p>}
                            </article>
                        </div>
                        )) : ''
                    }

                    <span className="end-of-tasks">
                        {dayTasks.length ? 'There is no more tasks for today' :
                            'There is no tasks yet'}
                    </span>
                </div>


            </section>
        )
    }
}

export default DayDetailsPage
