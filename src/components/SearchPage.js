import React, { Component } from 'react';

class SearchPage extends Component {

    state = {
        localData: (() => {
            const localData = {};

            for (var i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i),
                    value = localStorage[key];

                localData[key] = JSON.parse(value);
            }

            return localData
        })()
    }


    searchByKeyword = (keyword) => {
        const localData = this.state.localData,
            results = [];

        for (let key in localData) {
            const value = localData[key];

            if (Array.isArray(value)) value.forEach(elem => {
                if (('day' in elem) && ('tasks' in elem) && elem['tasks'].length > 0) {
                    const tasks = elem['tasks'];

                    tasks.forEach(task => {
                        const name = task.name,
                            notes = task.notes || '';

                        if ((name.indexOf(keyword) !== -1) || (notes.indexOf(keyword) !== -1)) {
                            const day = elem.day,
                                month = key.split('-')[0],
                                year= key.split('-')[1],
                                unixTime = Date.parse(`${year} ${month} ${day}`);

                            results.push({
                                day: elem.day,
                                month: key.split('-')[0],
                                year: key.split('-')[1],
                                unixTime: unixTime,
                                task: task
                            })
                        }

                    })
                }
            })
        }

        results.sort((a, b) => {
            if (a.unixTime > b.unixTime) { return 1 } else { return -1 }
        })

        return results
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}

export default SearchPage
