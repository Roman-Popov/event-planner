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


    getSearchResults = (searchString) => {
        const query = searchString.toLowerCase(),
            localData = this.state.localData,
            keywords = query.split(' '),
            results = [];

        for (let key in localData) {
            const value = localData[key];

            if (Array.isArray(value)) value.forEach(elem => {
                if (('day' in elem) && ('tasks' in elem) && elem['tasks'].length > 0) {
                    const tasks = elem['tasks'];

                    tasks.forEach(task => {
                        const name = task.name.toLowerCase(),
                            notes = task.notes.toLowerCase() || '';

                        if (keywords.some(keyword => name.includes(keyword) || notes.includes(keyword))) {
                            const day = elem.day,
                                month = key.split('-')[0],
                                year = key.split('-')[1],
                                time = task.time || '',
                                unixTime = Date.parse(`${year} ${month} ${day} ${time}`);

                            results.push({
                                day: elem.day,
                                month: key.split('-')[0],
                                year: key.split('-')[1],
                                unixTime: unixTime,
                                task: task,
                                exactMatch: name.includes(query) || notes === query.includes(query)
                            })
                        }

                    })
                }
            })
        }

        results.sort((a, b) => {
            return (b.exactMatch === true) - (a.exactMatch === true) ||
                (a.unixTime < b.unixTime) - (b.unixTime < a.unixTime);
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
