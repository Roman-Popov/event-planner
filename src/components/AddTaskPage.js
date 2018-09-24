import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AddTaskPage extends Component {
    render() {
        const { months, currentMonth, years, currentYear } = this.props;

        return (
            <section className="add-task">
                <form>
                    <label>
                        <span>Date</span>
                        <input
                            type="date"
                            min={`${years[years.length - 1]}-01-01`}
                            max={`${years[0]}-12-31`}
                        />
                    </label>

                    <label>
                        <span>Working day</span>
                        <input type="checkbox" id="working-day" defaultChecked="true" />
                    </label>

                    <label>
                        <span>Time</span>
                        <input type="time" />
                    </label>

                    <label>
                        <span>Task Name</span>
                        <input type="text" />
                    </label>

                    <label>
                        <span>Notes</span>
                        <input type="text" />
                    </label>
                </form>

                <Link to="/" className="btn btn-cancel">Cancel</Link>
                <Link to="/" className="btn btn-submit" onClick={() => console.log('submit')}>Add</Link>
            </section>
        )
    }
}

export default AddTaskPage
