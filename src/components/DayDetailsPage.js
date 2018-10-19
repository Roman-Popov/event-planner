
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class DayDetailsPage extends Component {

    state = {
        dayData: null,
        currentMonth: this.props.currentMonth,
        currentYear: this.props.currentYear,
        showModal: false,
        deleteObject: '',
    }

    componentWillMount() {
        this.getDayData();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    getDayData = () => {
        const { dayData, updateDate, dayDataToState } = this.props;

        if (dayData) {
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
                const parsedData = JSON.parse(storedData)[storedDay];

                updateDate(monthURL, yearURL);
                dayDataToState(parsedData);
                this.setState({ dayData: parsedData })
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
        const { dayDataToState } = this.props,
            { dayData, currentMonth, currentYear } = this.state,
            storedMonthData = JSON.parse(localStorage.getItem(`${currentMonth}-${currentYear}`)),
            storedDayData = storedMonthData[dayData.day - 1];

        if (task) {
            storedDayData.tasks = dayData.tasks.filter(storedTask => storedTask !== task)
            if (task.name === 'Day off') storedDayData.work = true;
        } else {
            storedDayData.tasks = [];
            storedDayData.work = true;
        }

        localStorage.setItem(`${currentMonth}-${currentYear}`, JSON.stringify(storedMonthData));
        dayDataToState(storedDayData);

        this.setState({
            dayData: storedDayData,
            showModal: false,
            deleteObject: ''
        })
    }

    render() {
        const { editableTaskToState } = this.props,
            { dayData, showModal, deleteObject, currentMonth, currentYear } = this.state,
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
                            <article className="task-info">
                                <Link
                                    to={`/edit-task/${dayData.day}-${currentMonth}-${currentYear}/${task.name}~${task.time.replace(':', '-')}`}
                                    className="btn btn-edit-task"
                                    onClick={() => editableTaskToState(task)}
                                >
                                    {`Edit task "${task.name}"`}
                                </Link>
                                <button
                                    className="btn btn-delete-task"
                                    onClick={() => this.confirmDeletion(task)}
                                >
                                    {`Clear task "${task.name}"`}
                                </button>

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
