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
        })()
    }

    componentWillUnmount() {
        this.props.editableTaskToState(null);
        this.props.dayDataToState(null);
    }

    submitTask = (e) => {
        const taskDate = document.getElementById('task-date').value,
            taskTime = document.getElementById('task-time').value;

        if (taskDate) {
            const workingDay = this.state.workingDay,
                taskName = document.getElementById('task-name').value;

            if (workingDay && !taskName) {
                e.preventDefault();
                document.getElementById('submit-task').click()
            } else {
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

                if (!workingDay) listOfDays[taskDay].work = false;

                listOfDays[taskDay].tasks.push({
                    time: workingDay ? taskTime : '',
                    name: workingDay ? taskName : 'Day off',
                    notes: workingDay ? taskNotes : '',
                })

                listOfDays[taskDay].tasks.sort((a, b) => {
                    // "Day off" task will always be on top position
                    if (a.name === 'Day off') { return -1 } else if (b.name === 'Day off') { return 1 }
                    if (a.time > b.time) { return 1 } else { return -1 }
                })

                localStorage.setItem(`${taskMonth}-${taskYear}`, JSON.stringify(listOfDays));
                dateTimeValueToState(taskDate, taskTime);
            }

        } else {
            e.preventDefault();
            document.getElementById('submit-task').click()
        }
    }

    render() {
        const { years, initialTaskDate, initialTaskTime, editMode, editData } = this.props,
            { workingDay, editDate } = this.state;

        return (
            <section className="add-task">
                <form onSubmit={(e) => e.preventDefault()}>
                    <label>
                        <span>Date</span>
                        <input
                            type="date"
                            id="task-date"
                            required={true}
                            min={`${years[years.length - 1]}-01-01`}
                            max={`${years[0]}-12-31`}
                            defaultValue={editDate.date || initialTaskDate}
                        />
                    </label>

                    <label>
                        <span>Working day</span>
                        <input
                            type="checkbox"
                            id="working-day"
                            defaultChecked={editMode ? editData.dayData.work : workingDay}
                            onChange={(e) => this.setState({workingDay: e.target.checked})}/>
                        <span className="checkmark"></span>
                    </label>

                    <label>
                        <span>Task Name</span>
                        <input
                            type="text"
                            id="task-name"
                            required={workingDay}
                            placeholder={workingDay ? "Task name (required)" : "Day off"}
                            defaultValue={editMode ? editData.task.name : '' }
                            autoComplete="off"
                            disabled={!workingDay}
                        />
                    </label>

                    <label>
                        <span>Time</span>
                        <input
                            type="time"
                            id="task-time"
                            defaultValue={editDate.time || initialTaskTime}
                            disabled={!workingDay}
                        />
                    </label>

                    <label>
                        <span>Notes</span>
                        <textarea
                            id="task-notes"
                            placeholder={workingDay ? "Write your notes here... (optional)" : "Day off"}
                            defaultValue={editMode ? editData.task.notes : ''}
                            disabled={!workingDay}>
                        </textarea>
                    </label>

                    {/* Fake hidden button to trigger form's .submit() event and validate input */}
                    <input type="submit" id="submit-task"/>

                    <Link to="/" className="btn btn-cancel">Cancel</Link>
                    <Link to="/" className="btn btn-submit" onClick={(e) => this.submitTask(e)}>{ editMode ? 'Apply' : 'Add' }</Link>
                </form>
            </section>
        )
    }
}

export default ManageTaskPage
