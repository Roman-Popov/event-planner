import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './App.css';

import Header from './components/Header';
import MainPage from './components/MainPage';
import SearchPage from './components/SearchPage';
import SelectMonthPage from './components/SelectMonthPage';



class App extends Component {
    state = {
        months: ['January', 'February', 'March',
            'April', 'May', 'June',
            'July', 'August', 'September',
            'October', 'November', 'December'],
        years: [],
        currentMonth: '',
        currentYear: '',
        selectMonth: true,
    }

    componentWillMount() {
        const currentDate = new Date(),
            currentMonth = this.state.months[currentDate.getMonth()],
            currentYear = currentDate.getFullYear(),
            years = [];
        for (let i = 0; i < 5; i++) {
            years.push(currentYear + 1 - i)
        }

        this.setState({
            years: years,
            currentMonth: currentMonth,
            currentYear: currentYear
        })
    }

    submitMonth = () => {
        const selectedMonth = document.querySelector('input[name="radio-month"]:checked').value,
            selectedYear = document.querySelector('input[name="radio-year"]:checked').value;

        this.setState({
            currentMonth: selectedMonth,
            currentYear: selectedYear
        })
    }

    render() {
        const { months, currentMonth, years, currentYear } = this.state;

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
                    <MainPage />
                )} />

                <Route path="/search" render={() => (
                    <SearchPage />
                )} />

            </div>
        );
    }
}

export default App;
