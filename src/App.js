import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './App.css';

import Header from './components/Header';
import MainPage from './components/MainPage';
import SearchPage from './components/SearchPage';
import SelectMonthPage from './components/SelectMonthPage';
import ManageTaskPage from './components/ManageTaskPage';
import DayDetailsPage from './components/DayDetailsPage';
import StoragePage from './components/StoragePage';

class App extends Component {
    state = {
        lsSpaceInfo: JSON.parse(localStorage.getItem('localStorageSpaceInfo')),
        months: ['January', 'February', 'March',
            'April', 'May', 'June',
            'July', 'August', 'September',
            'October', 'November', 'December'],
        years: [],
        currentMonth: '',
        currentYear: '',
        daysInMonth: '',
        dayData: null,
        editableTask: null,
        addTaskDateValue: '',
        addTaskTimeValue: '',
        lastSearchString: ''
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

    componentDidMount() {
        if (!('localStorage' in window)) {
            alert('Sorry :( \nThis app will not work with this browser because it has no localStorage support.')
        }

        setTimeout(() => {
            const lsSpaceInfo = JSON.parse(localStorage.getItem('localStorageSpaceInfo')),
                usedLocalSpace = this.testLocalStorageSize.getUsedSpaceInBytes();
            let localStorageQuota = lsSpaceInfo ? lsSpaceInfo.total : undefined;

            if (!localStorageQuota) {
                const unusedLocalSpace = this.testLocalStorageSize.getUnusedSpaceInBytes();
                localStorageQuota = Math.round((usedLocalSpace + unusedLocalSpace) * 0.95); // 5% - reserved space
            }

            const localStorageSpaceInfo = {
                total: localStorageQuota,
                used: usedLocalSpace,
            }

            localStorage.setItem('localStorageSpaceInfo', JSON.stringify(localStorageSpaceInfo))
            this.setState({ lsSpaceInfo: localStorageSpaceInfo })
        }, 1000);
    }

    testLocalStorageSize = {
        getUsedSpaceInBytes: (elem) => {
            return new Blob([JSON.stringify(elem || localStorage)]).size;
        },

        getUnusedSpaceInBytes: () => {
            const testQuotaKey = 'testQuota',
                startTime = new Date(),
                timeout = 20000;
            let maxByteSize = 10485760, // 10MiB
                minByteSize = 0,
                tryByteSize = 0,
                runtime = 0,
                unusedSpace = 0;

            do {
                runtime = new Date() - startTime;
                try {
                    tryByteSize = Math.floor((maxByteSize + minByteSize) / 2);
                    localStorage.setItem(testQuotaKey, new Array(tryByteSize).join('1'));
                    minByteSize = tryByteSize;
                } catch (e) {
                    maxByteSize = tryByteSize - 1;
                }
            } while ((maxByteSize - minByteSize > 1) && runtime < timeout);

            localStorage.removeItem(testQuotaKey);

            if (runtime >= timeout) {
                alert("Calculation of LocalStorage's free space was off due to timeout.");
            }

            // Compensate for the byte size of the key that was used,
            // then subtract 1 byte because the last value of the tryByteSize threw the exception
            unusedSpace = tryByteSize + testQuotaKey.length - 1;
            return unusedSpace;
        }
    }

    submitMonth = () => {
        const selectedMonth = document.querySelector('input[name="radio-month"]:checked').value,
            selectedYear = document.querySelector('input[name="radio-year"]:checked').value;

        this.updateDate(selectedMonth, selectedYear);
    }

    GetDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate()
    }

    updateDate = (month, year) => {
        if (month !== this.state.currentMonth || year !== this.state.currentYear) {
            this.setState({
                currentMonth: month,
                currentYear: Number(year),
                daysInMonth: this.GetDaysInMonth(this.state.months.indexOf(month), year)
            })
        }
    }

    updateLastSearch = (query) => {
        this.setState({
            lastSearchString: query,
            dayData: null
        })
    }

    initLocalData = (month, year) => {
        const { currentYear, months, currentMonth, daysInMonth } = this.state,
            localMonth = (month || currentMonth),
            localYear = (year || currentYear),
            localDataName = `${localMonth}-${localYear}`,
            storedData = localStorage.getItem(localDataName),
            initialData = [];

        if (!storedData) {
            for (let i = 0; i < daysInMonth; i++) {
                const weekdayName = new Date(localYear, months.indexOf(localMonth), i + 1).toLocaleString('en-GB', { weekday: 'long' }),
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
            addTaskTimeValue: time ? time : state.addTaskTimeValue
        }))
    }

    dayDataToState = (dayData, callback) => {
        this.setState({ dayData: dayData }, callback)
    }

    editableTaskToState = (task) => {
        this.setState({ editableTask: task })
    }

    render() {
        const { lsSpaceInfo, months, currentMonth, years, currentYear, daysInMonth,
            dayData, addTaskDateValue, addTaskTimeValue, lastSearchString, editableTask } = this.state;

        return (
            <div className="App">
                {!lsSpaceInfo && <aside className="loading">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                    <p>Please wait</p>
                </aside>}

                <Header
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    updateLastSearch={this.updateLastSearch}
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

                <Route path={`${editableTask ? /(add-task|edit-task)/ : '/add-task'}`} render={() => (
                    <ManageTaskPage
                        months={months}
                        currentMonth={currentMonth}
                        years={years}
                        currentYear={currentYear}
                        initLocalData={this.initLocalData}
                        initialTaskDate={addTaskDateValue}
                        initialTaskTime={addTaskTimeValue}
                        dateTimeValueToState={this.dateTimeValueToState}
                        editMode={dayData && editableTask}
                        editData={{ dayData: dayData, task: editableTask }}
                        dayDataToState={this.dayDataToState}
                        editableTaskToState={this.editableTaskToState}
                        getUsedSpace={this.testLocalStorageSize.getUsedSpaceInBytes}
                        totalSpace={lsSpaceInfo.total}
                    />
                )} />

                <Route path="/search" render={() => (
                    <SearchPage
                        lastSearchString={lastSearchString}
                        updateLastSearch={this.updateLastSearch}
                    />
                )} />

                <Route path="/day-details" render={() => (
                    <DayDetailsPage
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        dayData={dayData}
                        dayDataToState={this.dayDataToState}
                        editableTaskToState={this.editableTaskToState}
                        updateDate={this.updateDate}
                    />
                )} />

                <Route path="/storage-management" render={() => (
                    <StoragePage
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        getUsedSpace={this.testLocalStorageSize.getUsedSpaceInBytes}
                        totalSpace={lsSpaceInfo.total}
                        updateDate={this.updateDate}
                    />
                )} />

            </div>
        );
    }
}

export default App;
