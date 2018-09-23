import React, { Component } from 'react';

class MainPage extends Component {
    state = {
        daysInMonth: (() => {
            const { months, currentMonth, currentYear} = this.props;
            return new Date(currentYear, months.indexOf(currentMonth) + 1, 0).getDate()
        })()
    }

    createList = () => {
        const listDays = [],
            weekend = ['Sat', 'Sun'],
            { months, currentMonth, currentYear } = this.props;

        for (let i = 0; i < this.state.daysInMonth; i++) {
            const dayName = new Date(currentYear, months.indexOf(currentMonth), i+1).toDateString().split(' ')[0];

            listDays.push(
                <li key={i}>
                    <div className="business-day">
                        <span
                            className="day-of-week"
                            data-holiday={weekend.indexOf(dayName) !== -1}>
                            {dayName}
                        </span>
                        <span className="day-of-month">{i + 1}</span>
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
