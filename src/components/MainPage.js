import React, { Component } from 'react';

class MainPage extends Component {
    state = {
        daysInMonth: (() => {
            const { months, currentMonth, currentYear} = this.props;
            return new Date(currentYear, months.indexOf(currentMonth) + 1, 0).getDate()
        })()
    }

    componentWillMount() {
        this.initLocalData()
    }

    initLocalData = () => {
        const { currentMonth, currentYear } = this.props,
            data = [];

        if (!localStorage.getItem(currentMonth + currentYear)) {
            for (let i = 0; i < this.state.daysInMonth; i++) {
                // const day = {
                //     date: '',
                //     work: '',
                //     tasks: [
                //         {
                //             time: '',
                //             name: '',
                //             notes: ''
                //         }
                //     ]
                // };

                const day = {
                    date: '12-11-11',
                    work: true,
                    tasks: [
                        {
                            time: '10:00',
                            name: 'John',
                            notes: 'test'
                        },
                        {
                            time: '12:00',
                            name: 'Steve',
                            notes: ''
                        },
                        {
                            time: '16:00',
                            name: 'Lans',
                            notes: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna
                                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    Duis aute irure dolor in reprehenderit in voluptate velit
                                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                                    occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.`
                        }
                    ]
                };
                data.push(day)
            }

            localStorage.setItem(currentMonth + currentYear, JSON.stringify(data));
        } else {
            console.log('here')
        };
    }

    toggleDetails = (targetBtn) => {
        const details = targetBtn.parentNode.querySelector('.details');
        details.classList.toggle('shown')
        details.classList.contains('shown') ? targetBtn.innerHTML = 'Hide notes' : targetBtn.innerHTML = 'Show notes';
    }

    createList = () => {
        const { months, currentMonth, currentYear } = this.props,
            listDays = [],
            weekend = ['Sat', 'Sun'],
            monthData = JSON.parse(localStorage.getItem(currentMonth + currentYear));


        for (let i = 0; i < this.state.daysInMonth; i++) {
            const dayName = new Date(currentYear, months.indexOf(currentMonth), i+1).toDateString().split(' ')[0],
                dayData = monthData[i],
                dayTasks = dayData.tasks;

            listDays.push(
                <li key={i} data-holiday={weekend.indexOf(dayName) !== -1}>
                    <div className="business-day">
                        <span className="day-of-week">
                            {dayName}
                        </span>
                        <span className="day-of-month">{i + 1}</span>
                    </div>

                    <div className="day-data">
                        {dayTasks.length ? dayTasks.map(task => (
                            <section key={task.time}>
                                <time>{task.time}</time>
                                <h4>{task.name}</h4>
                                {task.notes && <button onClick={e => this.toggleDetails(e.target)}>
                                    Show notes
                                </button>}
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
