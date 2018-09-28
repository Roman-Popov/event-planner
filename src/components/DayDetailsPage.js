import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class DayDetailsPage extends Component {

    getDayData = () => {
        const { dayData } = this.props

        if (dayData.day) {
            // Day Data is in props
            return dayData
        } else {
            // Get info from URL (in case of page reload)
            const dateFromURL = document.location.pathname.split('/day-details/').pop().split('-'),
                storedData = localStorage.getItem(dateFromURL[1] + dateFromURL[2]),
                storedDay = dateFromURL[0] - 1;
                if (storedData) {
                    return JSON.parse(storedData)[storedDay]
                } else {
                    // Go to the main page if stored data was not found (or in case of invalid URL)
                    window.location.replace("/");
                }
        }
    }

    render() {
        const dayData = this.getDayData(),
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
