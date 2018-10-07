import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AddTaskPage extends Component {

    state = {
        workingDay: true
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
                const taskYear = taskDate.split('-')[0],
                    taskMonth = this.props.months[parseInt(taskDate.split('-')[1], 10) - 1],
                    taskDay = parseInt(taskDate.split('-')[2], 10) - 1,
                    taskNotes = document.getElementById('task-notes').value,
                    listOfDays = this.props.initLocalData(taskMonth, taskYear);

                if (!workingDay) listOfDays[taskDay].work = workingDay;

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

                localStorage.setItem(taskMonth + taskYear, JSON.stringify(listOfDays));
            }

            this.props.dateTimeValueToState(taskDate, taskTime)

        } else {
            e.preventDefault();
            document.getElementById('submit-task').click()
        }
    }

    render() {
        const { years, initialTaskDate, initialTaskTime } = this.props,
            workingDay = this.state.workingDay;

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
                            defaultValue={initialTaskDate}
                        />
                    </label>

                    <label>
                        <span>Working day</span>
                        <input
                            type="checkbox"
                            id="working-day"
                            defaultChecked={workingDay}
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
                            autoComplete="off"
                            disabled={!workingDay}
                        />
                    </label>

                    <label>
                        <span>Time</span>
                        <input
                            type="time"
                            id="task-time"
                            defaultValue={initialTaskTime}
                            disabled={!workingDay}
                        />
                    </label>

                    <label>
                        <span>Notes</span>
                        <textarea
                            id="task-notes"
                            placeholder={workingDay ? "Write your notes here... (optional)" : "Day off"}
                            disabled={!workingDay}>
                        </textarea>
                    </label>

                    {/* Fake hidden button to trigger form's .submit() event and validate input */}
                    <input type="submit" id="submit-task"/>

                    <Link to="/" className="btn btn-cancel">Cancel</Link>
                    <Link to="/" className="btn btn-submit" onClick={(e) => this.submitTask(e)}>Add</Link>
                </form>
            </section>
        )
    }
}

export default AddTaskPage
