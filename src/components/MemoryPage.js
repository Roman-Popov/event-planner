import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class MemoryPage extends Component {
    state = {
        usedSpace: this.props.getUsedSpace(),
        totalSpace: this.props.lsSpaceInfo.total,
        monthSizeInfo: []
    }

    componentWillMount() {
        this.setState({ monthSizeInfo: this.getMonthSizeInfo() })
    }

    getMonthSizeInfo = () => {
        const { getUsedSpace, lsSpaceInfo } = this.props,
            storedKeys = Object.keys(localStorage),
            monthDataKeys = storedKeys.filter(key => /^[A-Z]+-20\d\d$/i.test(key));

        const tmp = monthDataKeys.reduce((acc, curr) => {
            const month = curr.split('-')[0],
                year = curr.split('-')[1],
                monthDataSize = getUsedSpace(localStorage.getItem(curr)),
                monthDataSizePercentage = (monthDataSize / lsSpaceInfo.total * 100);

            let yearInstance = acc[year];

            if (yearInstance === undefined) {
                acc[year] = yearInstance = {};
                yearInstance.year = Number(year);
                yearInstance.months = [];
                yearInstance.size = 0;
                yearInstance.sizePercentage = 0;
            };

            yearInstance.size += monthDataSize;
            yearInstance.sizePercentage = Number((yearInstance.sizePercentage + monthDataSizePercentage).toFixed(2))

            yearInstance.months.push({
                name: month,
                monthNum: new Date(curr).getMonth(),
                size: monthDataSize,
                sizePercentage: Number(monthDataSizePercentage.toFixed(2))
            });

            return acc;
        }, {});

        const result = Object.keys(tmp).map(key => {
            tmp[key].months.sort((a, b) => a.monthNum - b.monthNum)
            console.log(tmp[key])
            return tmp[key]
        });

        return result.sort((a, b) => a.year - b.year)
    }

    render() {
        const { usedSpace, totalSpace, monthSizeInfo } = this.state,
            usedPercentage = (usedSpace / totalSpace * 100).toFixed(2),
            serviceInfoPercentage = Number(usedPercentage) - monthSizeInfo.reduce((acc, curr) => acc + curr.sizePercentage, 0)

        console.log('12312312 ', serviceInfoPercentage)
        console.log('render')
        return (
            <section className="memory-management">
                <div className="header-wrapper">
                    <header>
                        <Link to="/" className="btn btn-back">Back</Link>
                        <div className="progress-bar">
                            <span className="progress-bar-title">
                                Space usage: {usedPercentage}%
                            </span>
                            <div className="filler" style={{ '--usedSpace': usedPercentage + '%'}}></div>
                            {[...Array(5).keys()].map(i =>
                                <div key={i} className="tick" data-percent={i * 25 + '%'} style={{ left: i * 25 + '%'}}></div>
                            )}
                        </div>
                        <button className={`btn btn-clear-all-data`}>
                            DANGER! Delete all application data
                        </button>
                    </header>
                </div>

                <div className="data-wrapper">
                    {monthSizeInfo.map(elem => (
                        <section key={elem.year} className="group-year">
                            <p className="year-name">
                                {elem.year} <span className="year-size">{elem.sizePercentage > 0.1 ? elem.sizePercentage + '%' : 'less than 0.1%'}</span>
                            </p>
                            <ul>
                                {elem.months.map(month => (
                                    <li key={month.name}>
                                        <p>{month.name}</p>
                                        <p>
                                            Size: {month.sizePercentage > 0.1 ? month.sizePercentage + '%' : 'less than 0.1%'}
                                        </p>
                                        <button className="btn btn-delete-task">Clear {month.name} {elem.year} data</button>
                                    </li>
                                ))}
                            </ul>
                            <button className="btn">Clear all year data</button>
                        </section>
                    ))}
                    <section className="group-year">
                        <p className="year-name">
                            Other
                        </p>
                        <ul>
                            <li>
                                <p>Service information</p>
                                <p>Size: {serviceInfoPercentage > 0.1 ? serviceInfoPercentage + '%' : 'less than 0.1%'}</p>
                            </li>
                        </ul>
                    </section>
                </div>
            </section>
        )
    }
}

export default MemoryPage
