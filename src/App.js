import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './App.css';

import Header from './components/Header';
import MainPage from './components/MainPage';
import SearchPage from './components/SearchPage';
import SelectMonthPage from './components/SelectMonthPage';
import AddTaskPage from './components/AddTaskPage';
import DayDetailsPage from './components/DayDetailsPage'

class App extends Component {
    state = {
        months: ['January', 'February', 'March',
            'April', 'May', 'June',
            'July', 'August', 'September',
            'October', 'November', 'December'],
        years: [],
        currentMonth: '',
        currentYear: '',
        daysInMonth: '',
        dayData: {},
        addTaskDateValue: '',
        addTaskTimeValue: ''
    }

    componentWillMount() {
        const currentDate = new Date(),
            currentMonth = this.state.months[currentDate.getMonth()],
            currentYear = currentDate.getFullYear(),
            daysInMonth = this.GetDaysInMonth(currentDate.getMonth(), currentYear),
            years = [],
            // Note: 'en-GB' was selected because it matches to time input format
            addTaskDateValue = currentDate.toLocaleDateString('en-GB').split('/').reverse().join('-'),
            addTaskTimeValue = currentDate.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })

        for (let i = 0; i < 5; i++) {
            years.push(currentYear + 1 - i)
        }

        this.setState({
            years: years,
            currentMonth: currentMonth,
            currentYear: currentYear,
            daysInMonth: daysInMonth,
            addTaskDateValue: addTaskDateValue,
            addTaskTimeValue: addTaskTimeValue
        })
    }

    submitMonth = () => {
        const selectedMonth = document.querySelector('input[name="radio-month"]:checked').value,
            selectedYear = document.querySelector('input[name="radio-year"]:checked').value,
            daysInSelectedMonth = this.GetDaysInMonth(this.state.months.indexOf(selectedMonth), selectedYear);

        window.scrollTo(0, 0);

        this.setState({
            currentMonth: selectedMonth,
            currentYear: selectedYear,
            daysInMonth: daysInSelectedMonth
        })
    }

    GetDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate()
    }

    updateDate = (month, year) => {
        if (month !== this.state.currentMonth || year !== this.state.currentYear) {
            this.setState({
                currentMonth: month,
                currentYear: year
            })
        }
    }

    initLocalData = (month, year) => {
        const { months, currentMonth, currentYear } = this.state,
            localMonth = (month || currentMonth),
            localYear = (year || currentYear),
            localDataName = `${localMonth}-${localYear}`,
            storedData = localStorage.getItem(localDataName),
            initialData = [];

        if (!storedData) {
            for (let i = 0; i < this.state.daysInMonth; i++) {
                const weekdayName = new Date(localYear, months.indexOf(localMonth), i + 1).toLocaleString('en-GB', {weekday: 'long'}),
                    dayData = {
                        day: i + 1,
                        wdName: weekdayName,
                        work: true,
                        tasks: []
                    };
                initialData.push(dayData)
            }
            localStorage.setItem(localDataName, JSON.stringify(initialData));
        }
        return initialData.length ? initialData : JSON.parse(storedData)
    }

    dateTimeValueToState = (date, time) => {

        this.setState((state) => ({
            addTaskDateValue: date ? date : state.addTaskDateValue,
            addTaskTimeValue: time ? time: state.addTaskTimeValue
        }))
    }

    dayDataToState = (dayData) => {
        this.setState({ dayData: dayData })
    }

    render() {
        const { months, currentMonth, years, currentYear, daysInMonth, dayData, addTaskDateValue, addTaskTimeValue } = this.state;

        return (
            <div className="App">
                <Header
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                />

                <Route path="/select-month" render={() => (
                    <SelectMonthPage
                        months={months}
                        currentMonth={currentMonth}
                        years={years}
                        currentYear={currentYear}
                        submitMonth={this.submitMonth}
                    />
                )} />

                <Route exact path="/" render={() => (
                    <MainPage
                        months={months}
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        daysInMonth={daysInMonth}
                        initLocalData={this.initLocalData}
                        dayDataToState={this.dayDataToState}
                    />
                )} />

                <Route path="/add-task" render={() => (
                    <AddTaskPage
                        months={months}
                        currentMonth={currentMonth}
                        years={years}
                        currentYear={currentYear}
                        initLocalData={this.initLocalData}
                        initialTaskDate={addTaskDateValue}
                        initialTaskTime={addTaskTimeValue}
                        dateTimeValueToState={this.dateTimeValueToState}
                    />
                )} />

                <Route path="/search" render={() => (
                    <SearchPage />
                )} />

                <Route path="/day-details" render={() => (
                    <DayDetailsPage
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        dayData={dayData}
                        updateDate={this.updateDate}
                    />
                )} />

            </div>
        );
    }
}

export default App;
