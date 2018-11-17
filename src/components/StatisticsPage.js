import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class StatisticsPage extends Component {
    state = {
        monthStatsInfo: []
    }

    componentWillMount() {
        this.setState({ monthStatsInfo: this.getMonthStatsInfo() })
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    getMonthStatsInfo = () => {
        const monthDataKeys = Object.keys(localStorage).filter(key => /^[A-Z]+-20\d\d$/i.test(key));

        const tmp = monthDataKeys.reduce((acc, curr) => {
            const month = curr.split('-')[0],
                year = curr.split('-')[1],
                monthData = JSON.parse(localStorage.getItem(curr)),
                statsTemplate = {
                    totalTasksCount: 0,
                    doneTasksCount: 0,
                    profitableTasksCount: 0,
                    expensiveTasksCount: 0,
                    mostProfitableTask: { day: 0, task: { res: { tot: 0 } } },
                    mostExpensiveTask: { day: 0, task: { res: { tot: 0 } } },
                    avgResultPerDay: 0,
                    totalRevenue: 0,
                    totalExpense: 0,
                    totalResult: 0
                }

            const stats = monthData.reduce((acc, curr) => {
                const dayTasks = curr.tasks.filter(task => task.name !== 'Day off'),
                    dayTasksCount = dayTasks.length,
                    doneDayTasks = dayTasks.filter(task => task.done),
                    doneDayTasksCount = doneDayTasks.length;

                const dayFinResults = doneDayTasks.reduce((acc, curr) => {
                        if (curr.res) {
                            if (curr.res.tot > 0) {
                                acc.profitableTasksCount++;
                            } else if (curr.res.tot < 0) {
                                acc.expensiveTasksCount++;
                            }

                            acc.mostProfitableTask = (curr.res.tot > 0) && (curr.res.tot > acc.mostProfitableTask.res.tot) ? curr : acc.mostProfitableTask;
                            acc.mostExpensiveTask = (curr.res.tot < 0) && (curr.res.tot < acc.mostExpensiveTask.res.tot) ? curr : acc.mostExpensiveTask;
                            acc.totalRevenue += curr.res.rev;
                            acc.totalExpense += curr.res.exp;
                        }

                        return acc
                    },
                    {
                        profitableTasksCount: 0,
                        expensiveTasksCount: 0,
                        mostProfitableTask: { res: { tot: 0 } },
                        mostExpensiveTask: { res: { tot: 0 } },
                        totalRevenue: 0,
                        totalExpense: 0
                    })

                acc.totalTasksCount += dayTasksCount;
                acc.doneTasksCount += doneDayTasksCount;
                acc.profitableTasksCount += dayFinResults.profitableTasksCount;
                acc.expensiveTasksCount += dayFinResults.expensiveTasksCount;

                if (dayFinResults.mostProfitableTask.res.tot > acc.mostProfitableTask.task.res.tot) {
                    acc.mostProfitableTask.day = curr.day;
                    acc.mostProfitableTask.unixTime = Date.parse(`${year} ${month} ${curr.day} ${dayFinResults.mostProfitableTask.time || ''}`);
                    acc.mostProfitableTask.task = dayFinResults.mostProfitableTask;
                }

                if (dayFinResults.mostExpensiveTask.res.tot < acc.mostExpensiveTask.task.res.tot) {
                    acc.mostExpensiveTask.day = curr.day;
                    acc.mostExpensiveTask.unixTime = Date.parse(`${year} ${month} ${curr.day} ${dayFinResults.mostExpensiveTask.time || ''}`);
                    acc.mostExpensiveTask.task = dayFinResults.mostExpensiveTask;
                }

                acc.totalRevenue += dayFinResults.totalRevenue;
                acc.totalExpense += dayFinResults.totalExpense;

                return acc
            }, JSON.parse(JSON.stringify(statsTemplate)))

            stats.totalResult = Number((stats.totalRevenue - stats.totalExpense).toFixed(2));
            stats.avgResultPerDay = Number((stats.totalResult / monthData.length).toFixed(2));
            stats.totalRevenue = Number(stats.totalRevenue.toFixed(2));
            stats.totalExpense = Number(stats.totalExpense.toFixed(2));

            let yearInstance = acc[year];

            if (yearInstance === undefined) {
                acc[year] = yearInstance = {};
                yearInstance.year = Number(year);
                yearInstance.months = [];
                yearInstance.yearStats = JSON.parse(JSON.stringify(statsTemplate));
            };

            yearInstance.months.push({
                name: month,
                monthNum: new Date(curr).getMonth(),
                stats: stats
            });

            const yearStats = yearInstance.yearStats;

            yearStats.totalTasksCount += stats.totalTasksCount;
            yearStats.doneTasksCount += stats.doneTasksCount;
            yearStats.profitableTasksCount += stats.profitableTasksCount;
            yearStats.expensiveTasksCount += stats.expensiveTasksCount;

            if (stats.mostProfitableTask.task.res.tot > yearStats.mostProfitableTask.task.res.tot) {
                yearStats.mostProfitableTask.day = stats.mostProfitableTask.day;
                yearStats.mostProfitableTask.month = month;
                yearStats.mostProfitableTask.unixTime = stats.mostProfitableTask.unixTime;
                yearStats.mostProfitableTask.task = stats.mostProfitableTask.task;
            }

            if (stats.mostExpensiveTask.task.res.tot > yearStats.mostExpensiveTask.task.res.tot) {
                yearStats.mostExpensiveTask.day = stats.mostExpensiveTask.day;
                yearStats.mostExpensiveTask.month = month;
                yearStats.mostExpensiveTask.unixTime = stats.mostExpensiveTask.unixTime;
                yearStats.mostExpensiveTask.task = stats.mostExpensiveTask.task;
            }

            yearStats.totalRevenue += stats.totalRevenue;
            yearStats.totalExpense += stats.totalExpense;
            yearStats.totalResult += stats.totalResult;



            return acc;
        }, {});

        const result = Object.keys(tmp).map(key => {
            tmp[key].months.sort((a, b) => a.monthNum - b.monthNum)

            return tmp[key]
        });

        return result.sort((a, b) => a.year - b.year)
    }

    generateTaskInfo = (task, month, year) => {
        const name = task.task.name,
            result = task.task.res.tot,
            unixTime = task.unixTime,
            time = task.task.time,
            resultString = result > 0 ? 'The most profitable task' : result < 0 ? 'The most expensive task' : 'Task'

        return (
            <li>
                {resultString}: "{name}", <span>{result} </span>
                (<time>
                    {new Date(unixTime).toLocaleDateString()}
                    {time ? ` at ${new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                </time>) <Link to={`/day-details/${task.day}-${month}-${year}`} className="show-day" draggable="false">Show this day</Link>
            </li>
        )
    }


    render() {
        const { monthStatsInfo } = this.state,
            { currentMonth, currentYear, updateDate } = this.props;

        return (
            <section className='storage-management'>
                <div className="header-wrapper">
                    <header>
                        <Link to="/" className="btn btn-back" title="Back to month page" draggable="false">Back</Link>
                    </header>
                </div>

                {monthStatsInfo.map(elem => (
                    <section key={elem.year} className="group-year">
                        <div className="year-info">
                            {<time className="year-name">{elem.year}</time>}
                        </div>

                        <ul className="year-data">
                            {elem.months.map(month => {
                                const { totalTasksCount, doneTasksCount, profitableTasksCount,
                                    expensiveTasksCount, mostProfitableTask, mostExpensiveTask,
                                    avgResultPerDay, totalRevenue, totalExpense, totalResult } = month.stats;

                                return (<li key={month.name} className="month-size-info">
                                    <div className="month-link-wrapper">
                                        <Link
                                            to="/"
                                            className="month-link"
                                            title={`Go to ${month.name} ${elem.year}`}
                                            onClick={() => updateDate(month.name, elem.year)}
                                            draggable="false"
                                        >
                                            <h3 className="month">{month.name}</h3>
                                        </Link>
                                        {(elem.year === currentYear && month.name === currentMonth) && <div className="current" title="Current month"></div>}
                                    </div>


                                    <div className="stats-wrapper">
                                        <ol>
                                            <li>
                                                Total number of tasks: {totalTasksCount}
                                            </li>
                                            <li>
                                                Total number of completed tasks: {doneTasksCount} ({Number((doneTasksCount / totalTasksCount * 100).toFixed(2)) || 0}%)
                                                <ul>
                                                    <li>
                                                        The number of profitable ones: {profitableTasksCount}
                                                    </li>
                                                    {profitableTasksCount > 0 && this.generateTaskInfo(mostProfitableTask, month.name, elem.year)}
                                                    <li>
                                                        The number of expensive ones: {expensiveTasksCount}
                                                    </li>
                                                    {expensiveTasksCount > 0 && this.generateTaskInfo(mostExpensiveTask, month.name, elem.year)}
                                                </ul>
                                            </li>
                                            <li>
                                                Month revenue: {totalRevenue}
                                            </li>
                                            <li>
                                                Month expense: {totalExpense}
                                            </li>
                                            <li>
                                                Average financial result per day: {avgResultPerDay}
                                            </li>
                                            <li>
                                                Month total result: {totalResult}
                                            </li>
                                        </ol>
                                    </div>


                                </li>)
                            })}
                            <li>
                                <h3>Annual summary statistics</h3>

                                <div className="stats-wrapper">
                                    <ol>
                                        <li>
                                            Total number of tasks: {elem.yearStats.totalTasksCount}
                                        </li>
                                        <li>
                                            Total number of completed tasks: {elem.yearStats.doneTasksCount} ({Number((elem.yearStats.doneTasksCount / elem.yearStats.totalTasksCount * 100).toFixed(2)) || 0}%)
                                            <ul>
                                                <li>
                                                    The number of profitable ones: {elem.yearStats.profitableTasksCount}
                                                </li>
                                                {elem.yearStats.profitableTasksCount > 0 && this.generateTaskInfo(elem.yearStats.mostProfitableTask, elem.yearStats.mostProfitableTask.month, elem.year)}
                                                <li>
                                                    The number of expensive ones: {elem.yearStats.expensiveTasksCount}
                                                </li>
                                                {elem.yearStats.expensiveTasksCount > 0 && this.generateTaskInfo(elem.yearStats.mostExpensiveTask, elem.yearStats.mostExpensiveTask.month, elem.year)}
                                            </ul>
                                        </li>
                                        <li>
                                            Year revenue: {elem.yearStats.totalRevenue}
                                        </li>
                                        <li>
                                            Year expense: {elem.yearStats.totalExpense}
                                        </li>
                                        <li>
                                            Average financial result per day: {Number(((elem.yearStats.totalRevenue - elem.yearStats.totalExpense) * 86400000 / (new Date(elem.year, 11, 31) - new Date(elem.year, 0, 0))).toFixed(2))}
                                        </li>
                                        <li>
                                            Average financial result per month: {Number(((elem.yearStats.totalRevenue - elem.yearStats.totalExpense) / 12).toFixed(2))}
                                        </li>
                                        <li>
                                            Year total result: {elem.yearStats.totalResult}
                                        </li>
                                    </ol>
                                </div>
                            </li>
                        </ul>
                    </section>
                ))}

                <span className="end-of-storage">There is no more stored items</span>

            </section>
        )
    }
}

export default StatisticsPage
