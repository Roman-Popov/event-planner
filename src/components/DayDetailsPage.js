
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class DayDetailsPage extends Component {

    state = {
        dayData: {},
        currentMonth: this.props.currentMonth,
        currentYear: this.props.currentYear,
        showModal: false,
        deleteObject: '',
    }

    componentWillMount() {
        this.getDayData();
    }

    getDayData = () => {
        const { dayData, updateDate } = this.props;

        if (dayData.day) {
            // Day Data is in props
            this.setState({ dayData: dayData })
        } else {
            // Get info from URL (in case of page reload)
            const dateFromURL = document.location.pathname.split('/day-details/').pop().split('-'),
                monthURL = dateFromURL[1],
                yearURL = dateFromURL[2],
                storedData = localStorage.getItem(`${monthURL}-${yearURL}`),
                storedDay = dateFromURL[0] - 1;
            if (storedData) {
                updateDate(monthURL, yearURL)
                this.setState({ dayData: JSON.parse(storedData)[storedDay] })
            } else {
                // Go to the main page if stored data was not found (or in case of invalid URL)
                window.location.replace("/");
            }
        }
    }

    confirmDeletion = (task) => {
        this.setState({
            showModal: true,
            deleteObject: task || '',
        })
    }

    clearData = (task) => {
        const { dayData, currentMonth, currentYear } = this.state,
            storedMonthData = JSON.parse(localStorage.getItem(`${currentMonth}-${currentYear}`)),
            storedDayData = storedMonthData[dayData.day - 1];

        if (task) {
            storedDayData.tasks = storedDayData.tasks.filter(storedTask => storedTask.name !== task.name)
            if (task.name === 'Day off') storedDayData.work = true;
        } else {
            storedDayData.tasks = [];
            storedDayData.work = true;
        }

        localStorage.setItem(`${currentMonth}-${currentYear}`, JSON.stringify(storedMonthData))
        this.setState({
            dayData: storedDayData,
            showModal: false,
            deleteObject: ''
        })
    }

    render() {
        const { dayData, showModal, deleteObject } = this.state,
            dayTasks = dayData.tasks,
            dayName = dayData.wdName,
            weekend = ['Saturday', 'Sunday'];

        return (
            <section className={`day-details ${showModal ? 'modal-shown' : ''}`} >
                <div className="header-wrapper" data-weekend={weekend.includes(dayName)}>
                    <header>
                        <Link to="/" className="btn btn-back">Back</Link>
                        <div>
                            <h1>{dayData.day}</h1>
                            <span className="day-of-week">{dayName}</span>
                        </div>
                        <button className={`btn btn-delete-day ${dayTasks.length ? 'visible' : ''}`}
                            onClick={() => this.confirmDeletion()}
                        >
                            Clear all tasks for this day
                        </button>
                    </header>
                </div>
                <div className="tasks-wrapper">
                    {dayTasks.length ? dayTasks.map(task => (
                        <div key={`${task.time}-${task.name}`} className={`task ${task.time ? '' : 'no-time'}`}>
                            {task.time && <time className="task-time">{task.time}</time>}
                            <button
                                className="btn btn-delete-task"
                                onClick={() => this.confirmDeletion(task)}
                            >
                                {`Clear task "${task.name}"`}
                            </button>
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

                <div className={`modal-window ${showModal ? 'visible' : ''}`}>
                    <div className="message">
                        <h2><span className="modal-header">Attention!</span></h2>
                        <p>Deleted data can not be restored.</p>
                        <p>
                            Do you really want to delete
                            { deleteObject ? ` the task «${ deleteObject.name }»${ deleteObject.time ? ` (at ${ deleteObject.time })` : '' }` :
                                ' all tasks for today' }?
                        </p>
                        <div className="btn-wrapper">
                            <button className="btn btn-no" onClick={() => this.setState({ showModal: false, deleteObject: '' })}>No, keep</button>
                            <button className="btn btn-yes" onClick={() => this.clearData(deleteObject)}>Yes, delete</button>
                        </div>
                    </div>
                </div>

            </section>
        )
    }
}

export default DayDetailsPage
