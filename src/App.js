import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './App.css';

import Header from './components/Header';
import MainPage from './components/MainPage';
import SearchPage from './components/SearchPage';
import SelectMonthPage from './components/SelectMonthPage';
import AddTaskPage from './components/AddTaskPage';



class App extends Component {
    state = {
        months: ['January', 'February', 'March',
            'April', 'May', 'June',
            'July', 'August', 'September',
            'October', 'November', 'December'],
        years: [],
        currentMonth: '',
        currentYear: '',
        daysInMonth: ''
    }

    componentWillMount() {
        const currentDate = new Date(),
            currentMonth = this.state.months[currentDate.getMonth()],
            currentYear = currentDate.getFullYear(),
            daysInMonth = (() => {
                return new Date(currentYear, currentDate.getMonth() + 1, 0).getDate()
            })(),
            years = [];
        for (let i = 0; i < 5; i++) {
            years.push(currentYear + 1 - i)
        }

        this.setState({
            years: years,
            currentMonth: currentMonth,
            currentYear: currentYear,
            daysInMonth: daysInMonth
        })
    }

    submitMonth = () => {
        const selectedMonth = document.querySelector('input[name="radio-month"]:checked').value,
            selectedYear = document.querySelector('input[name="radio-year"]:checked').value;

        window.scrollTo(0, 0);

        this.setState({
            currentMonth: selectedMonth,
            currentYear: selectedYear
        })
    }

    initLocalData = (month, year) => {
        const { currentMonth, currentYear } = this.state,
            localDataName = (month || currentMonth) + (year || currentYear),
            storedData = localStorage.getItem(localDataName),
            initialData = [];

        if (!storedData) {
            for (let i = 0; i < this.state.daysInMonth; i++) {
                const day = {
                    date: '',
                    work: true,
                    tasks: []
                };
                initialData.push(day)
            }
            localStorage.setItem(localDataName, JSON.stringify(initialData));
        }
        return initialData.length ? initialData : JSON.parse(storedData)
    }

    render() {
        const { months, currentMonth, years, currentYear, daysInMonth } = this.state;

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
                    />
                )} />

                <Route path="/add-task" render={() => (
                    <AddTaskPage
                        months={months}
                        currentMonth={currentMonth}
                        years={years}
                        currentYear={currentYear}
                        initLocalData={this.initLocalData}
                    />
                )} />

                <Route path="/search" render={() => (
                    <SearchPage />
                )} />

            </div>
        );
    }
}

export default App;
