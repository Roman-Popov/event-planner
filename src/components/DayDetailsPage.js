
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

    componentWillUnmount() {
        document.querySelector('body').classList.remove('modal-shown');
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
        document.querySelector('body').classList.add('modal-shown');

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
            showModal: false
        })
    }

    taskDoneCheckmark = (checkmark, task, index) => {
        const { dayDataToState } = this.props,
                { dayData, currentMonth, currentYear } = this.state,
                storedMonthData = JSON.parse(localStorage.getItem(`${currentMonth}-${currentYear}`)),
                storedDayData = storedMonthData[dayData.day - 1];

        if (checkmark.checked) {
            task.done = true;
        } else {
            task.done = false;
            document.querySelector(`.result[data-task="${index}"] .result-form`).classList.remove('visible');
            delete task.res
        }

        storedDayData.tasks = dayData.tasks;
        localStorage.setItem(`${currentMonth}-${currentYear}`, JSON.stringify(storedMonthData));
        dayDataToState(storedDayData);
    }

    submitResult = (e, task, index) => {
        function calc(str) {
            // Delete spaces, duplicate '+' signs, '+' signs at the beginning and at the end of the string
            const formatStr = str.replace(/[\s+]+/g, '+').replace(/(?:^\+)|(?:\+$)/g, '');
            // Summation of all numbers of the string
            return formatStr.split('+').reduce((a, b) => parseFloat(a) + parseFloat(b), 0) || 0;
        }

        e.preventDefault();

        const form = e.target;

        let revenue = calc(form.querySelector(`#revenue-task-${index}`).value),
            expenses = calc(form.querySelector(`#expenses-task-${index}`).value);

        if (revenue === 0 && expenses === 0) {
            form.parentElement.querySelector('.btn-add-fin-result').classList.add('visible');
        } else {
            const { dayDataToState } = this.props,
                { dayData, currentMonth, currentYear } = this.state,
                storedMonthData = JSON.parse(localStorage.getItem(`${currentMonth}-${currentYear}`)),
                storedDayData = storedMonthData[dayData.day - 1];

            task.res = {
                rev: Number(revenue.toFixed(2)) || 0,
                exp: Number(expenses.toFixed(2)) || 0,
                tot: Number((revenue - expenses).toFixed(2))
            }

            storedDayData.tasks = dayData.tasks;
            localStorage.setItem(`${currentMonth}-${currentYear}`, JSON.stringify(storedMonthData));
            dayDataToState(storedDayData);

            form.parentElement.querySelector('.summary').classList.add('visible');
        }

        form.classList.remove('visible');
    }

    clearResult = (task, index) => {
        const { dayDataToState } = this.props,
                { dayData, currentMonth, currentYear } = this.state,
                storedMonthData = JSON.parse(localStorage.getItem(`${currentMonth}-${currentYear}`)),
                storedDayData = storedMonthData[dayData.day - 1];

        document.querySelector(`.result[data-task="${index}"] .summary`).classList.remove('visible');
        delete task.res;

        storedDayData.tasks = dayData.tasks;
        localStorage.setItem(`${currentMonth}-${currentYear}`, JSON.stringify(storedMonthData));
        dayDataToState(storedDayData, () => {
            document.querySelector(`.result[data-task="${index}"] .btn-add-fin-result`).classList.remove('initial')
        });
    }

    render() {
        const { editDataToState } = this.props,
            { dayData, showModal, deleteObject, currentMonth, currentYear } = this.state,
            dayTasks = dayData.tasks,
            dayName = dayData.wdName,
            weekend = ['Saturday', 'Sunday'];

        return (
            <section className='day-details' >
                <div className="header-wrapper" data-weekend={weekend.includes(dayName)}>
                    <header>
                        <Link to="/" className="btn btn-back" title="Back to month page" draggable="false">Back</Link>
                        <div>
                            <h1>{dayData.day}</h1>
                            <span className="day-of-week">{dayName}</span>
                        </div>
                        <button
                            className={`btn btn-delete-day ${dayTasks.length ? 'visible' : ''}`}
                            onClick={() => this.confirmDeletion()}
                            title="Clear all tasks for this day"
                        >
                            Clear all tasks for this day
                        </button>
                    </header>
                </div>

                {dayTasks.length ? dayTasks.map((task, index) => (
                    <div key={index} className={`task ${task.time ? '' : 'no-time'}`}>
                        {task.time && <time className="task-time">{task.time}</time>}
                        <article className={`task-info ${task.done ? 'done' : ''} ${task.name === 'Day off' ? 'day-off' : ''}`}>
                            <Link
                                to={`/edit-task/${dayData.day}-${currentMonth}-${currentYear}/${task.name}~${task.time.replace(':', '-')}`}
                                className="btn btn-edit-task"
                                title="Edit task"
                                onClick={() => { editDataToState(dayData, task) }}
                            >
                                {`Edit task "${task.name}"`}
                            </Link>
                            <button
                                className="btn btn-delete-task"
                                title="Delete task"
                                onClick={() => this.confirmDeletion(task)}
                            >
                                {`Clear task "${task.name}"`}
                            </button>

                            <h2>{task.name}</h2>
                            {task.notes && <p className="details">{task.notes}</p>}

                            {task.name !== 'Day off' && <section className="result" data-task={index}>
                                <header className="result-header">
                                    <label title={`Click here to mark this task as ${task.done ? "incomplete" : "completed"}`}>
                                        <span>Task is<span className='cmplt' data-cmplt={task.done}> not</span> completed</span>
                                        <input
                                            type="checkbox"
                                            className="task-done"
                                            defaultChecked={task.done}
                                            onChange={(e) => this.taskDoneCheckmark(e.target, task, index)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>

                                    <button
                                        className={`btn btn-add-fin-result ${task.done && !task.res ? 'visible initial' : ''}`}
                                        title="Add financial result"
                                        onClick={(e) => {
                                            const openedForm = document.querySelector('.result-form.visible');

                                            if (openedForm) {
                                                openedForm.classList.remove('visible');
                                                openedForm.parentElement.querySelector('.btn-add-fin-result').classList.add('visible');
                                            }
                                            e.target.classList.remove('visible', 'initial');
                                            document.querySelector(`.result[data-task="${index}"] .result-form`).classList.add('visible');
                                        }}
                                    >
                                        Add financial result
                                    </button>
                                </header>

                                <form
                                    className="result-form"
                                    onSubmit={(e) => this.submitResult(e, task, index)}
                                >
                                    <h3>Results</h3>
                                    <label>
                                        Revenues:
                                        <input
                                            type="tel"
                                            id={`revenue-task-${index}`}
                                            autoComplete="off"
                                            pattern="[\s\+]*(?:\d+(?:\.\d)?(?:\s*\++\s*)*)+\s*"
                                            placeholder="0"
                                            title='Allowed symbols: "+" (plus), "." (dot), " " (space) and numbers'
                                        />
                                    </label>
                                    <label>
                                        Expenses:
                                        <input
                                            type="tel"
                                            id={`expenses-task-${index}`}
                                            autoComplete="off"
                                            pattern="[\s\+]*(?:\d+(?:\.\d)?(?:\s*\++\s*)*)+\s*"
                                            placeholder="0"
                                            title='Allowed symbols: "+" (plus), "." (dot), " " (space) and numbers'
                                        />
                                    </label>

                                    <div className="btn-wrapper">
                                        <button
                                            className="btn btn-yes"
                                            type="button"
                                            title="Cancel"
                                            onClick={() => {
                                                document.querySelector(`.result[data-task="${index}"] .result-form`).classList.remove('visible');
                                                document.querySelector(`.result[data-task="${index}"] .btn-add-fin-result`).classList.add('visible')
                                            }}
                                        >
                                            Cancel <i></i><i></i>
                                        </button>
                                        <button
                                            className="btn btn-no"
                                            type="submit"
                                            title="Apply"
                                        >
                                            Apply <i></i><i></i>
                                        </button>
                                    </div>
                                </form>

                                <div className={`summary ${task.res && task.done ? 'visible' : ''}`}>
                                <button
                                    className="btn btn-clear-fin-res"
                                    title="Clear financial result"
                                    onClick={() => this.clearResult(task, index)}
                                >
                                    {`Clear financial result for task "${task.name}"`}
                                </button>
                                    <ul>
                                        <li>Revenue: <span>{task.res ? task.res.rev : 0}</span></li>
                                        <li>Expense: <span>{task.res ? task.res.exp : 0}</span></li>
                                        <li className="total">
                                            Total:
                                            <span
                                                className={!task.res || (task.res && task.res.tot === 0) ? '' :
                                                    task.res.tot > 0 ? 'profit' : 'loss'}
                                            >
                                                {task.res ? Math.abs(task.res.tot) : 0}
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                            </section>}
                        </article>
                    </div>
                )) : ''}

                <span className="end-of-tasks">
                    {dayTasks.length ? 'There is no more tasks for today' :
                        'There is no tasks yet'}
                </span>

                <div className={`modal-window ${showModal ? 'visible' : ''}`}>
                    <div className="message">
                        <h2><span className="modal-header">Attention!</span></h2>
                        <p>Deleted data can not be restored.</p>
                        <p>
                            Do you really want to delete
                            { deleteObject ? ` the task "${ deleteObject.name }"${ deleteObject.time ? ` (at ${ deleteObject.time })` : '' }` :
                                ' all tasks for today' }?
                        </p>
                        <div className="btn-wrapper">
                            <button
                                className="btn btn-no"
                                onClick={() => {
                                    this.setState({ showModal: false });
                                    document.querySelector('body').classList.remove('modal-shown');
                                }}
                            >
                                No, keep
                            </button>

                            <button
                                className="btn btn-yes"
                                onClick={() => {
                                    this.clearData(deleteObject)
                                    document.querySelector('body').classList.remove('modal-shown');
                                }}
                            >
                                Yes, delete
                            </button>
                        </div>
                    </div>
                </div>

            </section>
        )
    }
}

export default DayDetailsPage
