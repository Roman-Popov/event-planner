import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class SelectMonthPage extends Component {

    displayUserSelect() {
        document.querySelectorAll('.select-month label').forEach(elem => elem.classList.remove('radio-selected'));
        document.querySelectorAll('input:checked').forEach(elem => elem.parentElement.classList.add('radio-selected'))
    }

    render() {
        const { months, currentMonth, years, currentYear, submitMonth } = this.props;

        return (
            <form className="select-month" onChange={() => this.displayUserSelect()}>
                <fieldset>
                    <legend>Select month</legend>

                    {months.map(month => (
                        <label key={month} className={month === currentMonth ? 'radio-selected' : ''}>
                            <input
                                type="radio"
                                id={`select-${month}`}
                                name="radio-month"
                                value={month}
                                defaultChecked={month === currentMonth}
                            />
                            {month}
                        </label>
                    ))}
                </fieldset>

                <fieldset>
                    <legend>Select year</legend>

                    {years.map(year => (
                        <label key={year} className={year.toString() === currentYear.toString() ? 'radio-selected' : ''}>
                            <input
                                type="radio"
                                id={`select-${year}`}
                                name="radio-year"
                                value={year}
                                defaultChecked={year.toString() === currentYear.toString()}
                            />
                            {year}
                        </label>
                    ))}

                </fieldset>
                <Link to="/" className="btn btn-cancel">Cancel</Link>
                <Link to="/" className="btn btn-submit" onClick={e => submitMonth(e)}>Apply</Link>

            </form>
        )
    }
}

export default SelectMonthPage