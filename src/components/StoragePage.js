import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import RestorationUtility from './RestorationUtility';

class StoragePage extends Component {
    state = {
        usedSpace: this.props.getUsedSpace(),
        monthSizeInfo: [],
        storedKeys: Object.keys(localStorage).filter(key => /^[A-Z]+-20\d\d$/i.test(key)),
        showModal: false,
        deleteObject: '',
        confirmed: false,
    }

    componentWillMount() {
        this.getMonthSizeInfo()
    }

    componentWillUnmount() {
        document.querySelector('body').classList.remove('modal-shown');
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    getMonthSizeInfo = () => {
        const { getUsedSpace, totalSpace } = this.props,
            localStorageSpaceInfo = JSON.parse(localStorage.getItem('localStorageSpaceInfo')) || {},
            monthDataKeys = Object.keys(localStorage).filter(key => /^[A-Z]+-20\d\d$/i.test(key));

        localStorageSpaceInfo.used = getUsedSpace();
        // Information in the LocalStorage exists, so refresh it
        if (localStorageSpaceInfo.total) {
            localStorage.setItem('localStorageSpaceInfo', JSON.stringify(localStorageSpaceInfo));
        }

        const tmp = monthDataKeys.reduce((acc, curr) => {
            const month = curr.split('-')[0],
                year = curr.split('-')[1],
                monthDataSize = getUsedSpace(localStorage.getItem(curr)),
                monthDataSizePercentage = (monthDataSize / totalSpace * 100);

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

            return tmp[key]
        });

        result.sort((a, b) => a.year - b.year)

        this.setState({
            monthSizeInfo: result,
            storedKeys: monthDataKeys,
            usedSpace: localStorageSpaceInfo.used
        })
    }

    confirmDeletion = (obj) => {
        const inputField = document.getElementById('confirm-deletion');

        document.querySelector('body').classList.add('modal-shown');

        inputField.value = '';

        this.setState({
            showModal: true,
            confirmed: false,
            deleteObject: obj || '',
        })

        setTimeout(() => {
            inputField.focus()
        }, 500);
    }

    clearData = (e, obj) => {
        e.preventDefault();

        const { storedKeys } = this.state;

        let arrayToRemove = [];

        if (obj) {
            if (obj.month) {
                arrayToRemove.push(`${obj.month}-${obj.year}`);
            } else {
                arrayToRemove = storedKeys.filter(key => key.includes(obj.year));
            }
        } else {
            arrayToRemove = storedKeys;
        }

        arrayToRemove.forEach(key => localStorage.removeItem(key));

        this.getMonthSizeInfo();

        this.setState({
            showModal: false,
            confirmed: false
        })
    }

    getDelText = (obj) => {
        let text = 'Delete';

        if (obj) {
            text += obj.month ? ` ${obj.month} ${obj.year}` : ` ${obj.year} year`
        } else {
            text += ' application data for all time'
        }

        return text
    }

    getBackupData = (name, type) => {
        const a = document.getElementById('backup-link'),
            text = JSON.stringify(localStorage),
            file = new Blob([text], { type: type });
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    }

    render() {
        const { usedSpace, monthSizeInfo, showModal,
            deleteObject, confirmed, storedKeys } = this.state,
            { currentMonth, currentYear, updateDate,
            getUsedSpace, totalSpace, appSetLoading, isLoading } = this.props,
            usedPercentage = Number((usedSpace / totalSpace * 100).toFixed(2)),
            usedPercentageText = usedPercentage > 100 ? 100 : usedPercentage,
            serviceInfoPercentage = usedPercentageText - monthSizeInfo.reduce((acc, curr) => acc + curr.sizePercentage, 0)

        return (
            <section className='storage-management'>
                <div className="header-wrapper">
                    <header>
                        <Link to="/" className="btn btn-back" title="Back to month page" draggable="false">Back</Link>
                        <div className="progress-bar">
                            <span className="progress-bar-title">
                                Space usage: {usedPercentageText}%
                            </span>
                            <div className="filler" style={{ '--usedSpace': usedPercentageText + '%'}}></div>
                            {[...Array(5).keys()].map(i =>
                                <div key={i} className="tick" data-percent={i * 25 + '%'} style={{ left: i * 25 + '%'}}></div>
                            )}
                        </div>

                        <a href="" id="backup-link" hidden={true}>Click here to download backup file</a>
                        <button
                            className="btn btn-backup"
                            title="Download backup file"
                            onClick={() => this.getBackupData(`TimeTable-${Date.now()}.json`, 'application/json')}
                        >
                            Download backup file
                        </button>
                    </header>
                </div>

                {monthSizeInfo.map(elem => (
                    <section key={elem.year} className="group-year">
                        <div className="year-data-wrapper">
                            <div className="year-info">
                                {<time className="year-name">{elem.year}</time>}
                                <p className="year-size">{elem.sizePercentage > 0.1 ? elem.sizePercentage + '%' : 'less than 0.1%'}</p>
                            </div>

                            <ul>
                                {elem.months.map(month => (
                                    <li key={month.name} className="month-size-info">
                                        <div className="month-link-wrapper">
                                            <Link
                                                to="/"
                                                className="month-link"
                                                title={`Go to ${month.name} ${elem.year}`}
                                                onClick={() => updateDate(month.name, elem.year)}
                                                draggable="false"
                                            >
                                                <h3 className="month">{month.name}</h3>
                                                <p className="size">
                                                    Size: {month.sizePercentage > 0.1 ? month.sizePercentage + '%' : 'less than 0.1%'}
                                                </p>
                                            </Link>
                                            {(elem.year === currentYear && month.name === currentMonth) && <div className="current" title="Current month"></div>}
                                        </div>

                                        <button
                                            className="btn btn-delete-month"
                                            onClick={() => this.confirmDeletion({ month: month.name, year: elem.year })}
                                            title={`Clear ${month.name} ${elem.year} data`}
                                        >
                                            Clear {month.name} {elem.year} data
                                    </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="delete-year-wrapper">
                            <button
                                className="btn btn-delete-year"
                                onClick={() => this.confirmDeletion({ year: elem.year })}
                                title={`Clear all ${elem.year} year data`}
                            >
                                {`Clear all ${elem.year} year data`}
                            </button>
                        </div>

                    </section>
                ))}
                <section className="group-year">
                    <div className="year-info">
                        {<div className="year-name other">Other</div>}
                    </div>
                    <ul>
                        <li className="month-size-info service-info">
                            <div className="month-link-wrapper">
                                <div className="month-link" title="Service information can not be deleted">
                                    <h3 className="month">Service information</h3>
                                    <p className="size">Size: {serviceInfoPercentage > 0.1 ? Number(serviceInfoPercentage.toFixed(2)) + '%' : 'less than 0.1%'}</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </section>

                <RestorationUtility
                    getMonthSizeInfo={this.getMonthSizeInfo}
                    monthSizeInfo={monthSizeInfo}
                    getUsedSpace={getUsedSpace}
                    appSetLoading={appSetLoading}
                    isLoading={isLoading}
                    storedKeys={storedKeys}
                    usedSpace={usedSpace}
                    totalSpace={totalSpace}
                />

                <section className="group-year">
                    <div className="danger-zone">
                        <h2>Danger zone</h2>
                        <button
                            className="btn btn-clear-all-data"
                            onClick={() => this.confirmDeletion()}
                            title="DANGER! Delete all application data"
                        >
                            Delete all application data
                        </button>
                    </div>
                </section>

                <div className={`modal-window ${showModal ? 'visible' : ''}`}>
                    <div className="message">
                        <h2><span className="modal-header">Attention!</span></h2>
                        <p>Deleted data can not be restored.</p>
                        <p>
                            Do you really want to delete all
                            {deleteObject ? ` data for ${deleteObject.month || ''} ${deleteObject.year}${(!deleteObject.month && ' year') || ''}` :
                                ' application data for all time'}?
                        </p>
                        <p>
                            Please type in the following text to confirm:
                            <br/>
                            "{this.getDelText(deleteObject)}"
                        </p>
                        <form
                            className="btn-wrapper"
                            onSubmit={(e) => {
                                this.clearData(e, deleteObject);
                                document.querySelector('body').classList.remove('modal-shown');
                            }}
                        >
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="confirm-deletion"
                                    autoComplete="off"
                                    placeholder={this.getDelText(deleteObject)}
                                    maxLength="40"
                                    onChange={(e) => {
                                        if (e.target.value === this.getDelText(deleteObject)) {
                                            this.setState({confirmed: true})
                                        } else {
                                            this.setState({ confirmed: false })
                                        }
                                    }}
                                />
                            </div>

                            <button
                                className="btn btn-no"
                                type="button"
                                onClick={() => {
                                    this.setState({ showModal: false });
                                    document.querySelector('body').classList.remove('modal-shown');
                                }}
                            >
                                No, keep
                            </button>
                            <button
                                className={`btn btn-yes ${confirmed ? '' : 'disabled'}`}
                                type="submit"
                                disabled={!confirmed}
                            >
                                Yes, delete
                            </button>

                        </form>

                    </div>
                </div>

            </section>
        )
    }
}

export default StoragePage
