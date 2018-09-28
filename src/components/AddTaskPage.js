import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AddTaskPage extends Component {

    getTodayDate = () => {
        const dateNow = new Date(),
            yearNow = dateNow.getFullYear(),
            dayNow = dateNow.getDate();
        let monthNow = (dateNow.getMonth() + 1).toString();
        if (monthNow.length === 1) monthNow = '0' + monthNow;
        return `${yearNow}-${monthNow}-${dayNow}`
    }

    state = {
        dateValue: this.getTodayDate(),
        // Note: 'en-GB' was selected because it matches to time input format
        timeValue: new Date().toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })
    }

    submitTask = () => {
        const taskDate = document.getElementById('task-date').value,
            taskYear = taskDate.split('-')[0],
            taskMonth = this.props.months[parseInt(taskDate.split('-')[1], 10) - 1],
            taskDay = parseInt(taskDate.split('-')[2], 10) - 1,
            workingDay = document.getElementById('working-day').checked,
            taskTime = document.getElementById('task-time').value,
            taskName = document.getElementById('task-name').value,
            taskNotes = document.getElementById('task-notes').value;

        const listOfDays = this.props.initLocalData(taskMonth, taskYear)

        listOfDays[taskDay].day = taskDay + 1;
        listOfDays[taskDay].work = workingDay;
        listOfDays[taskDay].tasks.push({
            time: taskTime,
            name: taskName,
            notes: taskNotes
        })
        listOfDays[taskDay].tasks.sort((a, b) => {
            if (a.time > b.time) {
                return 1
            } else {
                return -1
            }
        })

        localStorage.setItem(taskMonth + taskYear, JSON.stringify(listOfDays));

        this.setState({
            dateValue: taskDate,
            timeValue: taskTime
        })
    }

    render() {
        const { years } = this.props,
            { timeValue, dateValue } = this.state;

        return (
            <section className="add-task">
                <form>
                    <label>
                        <span>Date</span>
                        <input
                            type="date"
                            id="task-date"
                            min={`${years[years.length - 1]}-01-01`}
                            max={`${years[0]}-12-31`}
                            defaultValue={dateValue}
                        />
                    </label>

                    <label>
                        <span>Working day</span>
                        <input type="checkbox" id="working-day" defaultChecked="true" />
                    </label>

                    <label>
                        <span>Time</span>
                        <input type="time" id="task-time" defaultValue={timeValue} />
                    </label>

                    <label>
                        <span>Task Name</span>
                        <input type="text" id="task-name"/>
                    </label>

                    <label>
                        <span>Notes</span>
                        <input type="text" id="task-notes"/>
                    </label>
                </form>

                <Link to="/" className="btn btn-cancel">Cancel</Link>
                <Link to="/" className="btn btn-submit" onClick={() => this.submitTask()}>Add</Link>
            </section>
        )
    }
}

export default AddTaskPage
