import React, { Component } from 'react';

class AddTaskPage extends Component {
    render() {
        const { months, currentMonth, years, currentYear } = this.props;

        return (
            <section className="add-task">
                <form>
                    <label>
                        Date
                        <input
                            type="date"
                            min={`${years[years.length - 1]}-01-01`}
                            max={`${years[0]}-12-31`}
                        />
                    </label>

                    <label>
                        Time
                        <input type="time" />
                    </label>

                    <label>
                        Working day
                        <input type="checkbox" id="working-day" defaultChecked="true"/>
                    </label>
                </form>
            </section>
        )
    }
}

export default AddTaskPage
