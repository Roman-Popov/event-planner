import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ManageTaskPage extends Component {

    state = {
        workingDay: this.props.editMode ? this.props.editData.dayData.work : true,
        editDate: (() => {
            const { currentMonth, currentYear, editMode, editData } = this.props;

            if (editMode) {
                const taskFullDate = new Date(`${editData.dayData.day} ${currentMonth} ${currentYear} ${editData.task.time} `),
                    inputDateValue = taskFullDate.toLocaleDateString('en-GB').split('/').reverse().join('-'),
                    inputTimeValue = editData.task.time;

                return { date: inputDateValue, time: inputTimeValue }
            } else {
                return { date: null, time: null }
            }
        })(),
        usedSpacePercentage: Number((this.props.getUsedSpace() / this.props.totalSpace * 100).toFixed(2)),
        showModal: false
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        if (this.state.usedSpacePercentage > 95 && !this.state.showModal) setTimeout(() => this.setState({ showModal: true }), 1);
    }

    componentWillUnmount() {
        this.props.editableTaskToState(null);
        this.props.dayDataToState(null);
    }

    submitTask = (e) => {
        const taskDate = document.getElementById('task-date').value,
            taskTime = document.getElementById('task-time').value;

        e.preventDefault();

        if (taskDate) {
            const workingDay = this.state.workingDay,
                taskName = document.getElementById('task-name').value;

            if (!workingDay || taskName) {
                const { months, currentMonth, currentYear,
                    editMode, editData,
                    initLocalData, dateTimeValueToState } = this.props,
                    { editDate } = this.state,
                    dayDataToChange = editData.dayData,
                    taskToDelete = editData.task,
                    taskYear = taskDate.split('-')[0],
                    taskMonth = months[parseInt(taskDate.split('-')[1], 10) - 1],
                    taskDay = parseInt(taskDate.split('-')[2], 10) - 1,
                    taskNotes = document.getElementById('task-notes').value,
                    listOfDays = initLocalData(taskMonth, taskYear);

                // Delete existing task (old version) if it is being edited
                if (editMode) {
                    function changeData (storedDay) {
                        if (taskToDelete.name === 'Day off') storedDay.work = true;
                        storedDay.tasks = dayDataToChange.tasks.filter(task => task !== taskToDelete)
                    }

                    // Same month-year as a new version (edited) task
                    if (taskDate.slice(0, 7) === editDate.date.slice(0, 7)) {
                        const storedDay = listOfDays[dayDataToChange.day - 1];
                        changeData(storedDay);
                    // Task moved to other month
                    } else {
                        const listOfDays = initLocalData(currentMonth, currentYear),
                            storedDay = listOfDays[dayDataToChange.day - 1];
                        changeData(storedDay);
                        localStorage.setItem(`${currentMonth}-${currentYear}`, JSON.stringify(listOfDays));
                    }
                }

                // Do not add new "Day off" day if it's already exist
                if (workingDay || listOfDays[taskDay].work) {
                    if (!workingDay) listOfDays[taskDay].work = false;

                    const newTask = {
                        time: workingDay ? taskTime : '',
                        name: workingDay ? taskName : 'Day off',
                        notes: workingDay ? taskNotes : '',
                    }

                    if (editMode) {
                        taskToDelete.done && (newTask.done = taskToDelete.done)
                        taskToDelete.res && (newTask.res = taskToDelete.res)
                    }

                    listOfDays[taskDay].tasks.push(newTask)

                    listOfDays[taskDay].tasks.sort((a, b) => {
                        // "Day off" task will always be on top position
                        if (a.name === 'Day off') { return -1 } else if (b.name === 'Day off') { return 1 }
                        if (a.time > b.time) { return 1 } else { return -1 }
                    })
                }

                localStorage.setItem(`${taskMonth}-${taskYear}`, JSON.stringify(listOfDays));
                dateTimeValueToState(taskDate, taskTime);

                document.getElementById('submit-task').click();
            }

        }

    }

    render() {
        const { years, initialTaskDate, initialTaskTime, editMode, editData } = this.props,
            { workingDay, editDate, showModal, usedSpacePercentage } = this.state,
            // Used space can be more than 100% because of reserved space.
            usedPercentageText = usedSpacePercentage > 100 ? 100 : usedSpacePercentage;

        return (
            <section className="add-task">
                <form onSubmit={(e) => this.submitTask(e)}>
                    <label title="Task date">
                        <span>Date</span>
                        <input
                            type="date"
                            id="task-date"
                            required={true}
                            min={`${Math.min(...years)}-01-01`}
                            max={`${Math.max(...years)}-12-31`}
                            defaultValue={editDate.date || initialTaskDate}
                        />
                    </label>

                    <label title={`Click here to set the selected day as a ${workingDay ? "day off" : "working day"}`}>
                        <span>Working day</span>
                        <input
                            type="checkbox"
                            id="working-day"
                            defaultChecked={editMode ? editData.dayData.work : workingDay}
                            onChange={(e) => this.setState({workingDay: e.target.checked})}/>
                        <span className="checkmark"></span>
                    </label>

                    <label title={workingDay ? "Task name (required, 50 symbols max)" : "Day off"}>
                        <span>Task Name</span>
                        <input
                            type="text"
                            id="task-name"
                            required={workingDay}
                            placeholder={workingDay ? "Task name (required)" : "Day off"}
                            defaultValue={!editMode ? '' : editData.task.name !== 'Day off' ? editData.task.name : '' }
                            autoComplete="off"
                            maxLength="50"
                            disabled={!workingDay}
                        />
                    </label>

                    <label title={workingDay ? "Task time" : "Day off"}>
                        <span>Time</span>
                        <input
                            type="time"
                            id="task-time"
                            defaultValue={editDate.time || initialTaskTime}
                            disabled={!workingDay}
                        />
                    </label>

                    <label title={workingDay ? "Write your notes here... (optional, 500 symbols max)" : "Day off"}>
                        <span>Notes</span>
                        <textarea
                            id="task-notes"
                            placeholder={workingDay ? "Write your notes here... (optional, 500 symbols max)" : "Day off"}
                            defaultValue={editMode ? editData.task.notes : ''}
                            maxLength="500"
                            disabled={!workingDay}>
                        </textarea>
                    </label>

                    {/* Fake hidden button to go back if task was added successfully */}
                    <Link to="/" id="submit-task">{editMode ? 'Apply' : 'Add'}</Link>

                    <Link to="/" className="btn btn-cancel" draggable="false">Cancel</Link>
                    <button className={`btn btn-submit ${usedPercentageText < 100 ? '' : 'disabled'}`} disabled={!(usedPercentageText < 100)}>
                        <span className={usedPercentageText > 95 && usedPercentageText < 100 ? 'warning' : ''}>{editMode ? 'Apply' : 'Add'}</span>
                    </button>
                </form>

                <div className={`modal-window ${showModal ? 'visible' : ''}`}>
                    <div className="message">
                        <h2><span className="modal-header">Warning!</span></h2>
                        {usedPercentageText < 100 ?
                            <div>
                                <p>Storage is almost full</p>
                                <p>
                                    Application memory usage: <span className="mem-percent">{usedPercentageText}%</span>
                                </p>
                                <p>Soon you will be unable to add new tasks.</p>
                                <p>You can manage your storage on the appropriate page.</p>
                            </div> :

                            <div>
                                <p>Storage is full!</p>
                                <p>
                                    There is not enough available space to add a new task.
                                </p>
                                <p>You can manage your storage on the appropriate page.</p>
                            </div>
                        }
                        <div className="btn-wrapper">
                            <Link to="/storage-management" className="btn btn-no" draggable="false">Clear now</Link>
                            <button
                                className="btn btn-yes"
                                onClick={() => {
                                    this.setState({ showModal: false });
                                    document.querySelector('body').classList.remove('modal-shown');
                                }}
                            >
                                Clear later
                            </button>
                        </div>
                    </div>
                </div>

            </section>
        )
    }
}

export default ManageTaskPage
