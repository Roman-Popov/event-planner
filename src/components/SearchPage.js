import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
        })(),

        searchString: this.props.lastSearchString,
        searchResults: []
    }

    componentDidMount() {
        this.setState({ searchResults: this.getSearchResults(this.state.searchString) })
    }

    getSearchResults = (searchString) => {
        const query = searchString.trim().toLowerCase(),
            localData = this.state.localData,
            keywords = query.split(' ').filter(word => word.length > 2),
            results = [];

        if (query.length === 0) return []

        for (let key in localData) {
            const value = localData[key];

            if (Array.isArray(value)) value.forEach(elem => {
                if (('day' in elem) && ('tasks' in elem) && elem['tasks'].length > 0) {
                    const tasks = elem['tasks'];

                    tasks.forEach(task => {
                        const name = task.name.toLowerCase(),
                            notes = task.notes.toLowerCase() || '';

                        if (keywords.some(keyword => name.includes(keyword) || notes.includes(keyword))) {
                            const copiedTask = JSON.parse(JSON.stringify(task)),
                                day = elem.day,
                                month = key.split('-')[0],
                                year = key.split('-')[1],
                                time = task.time || '',
                                unixTime = Date.parse(`${year} ${month} ${day} ${time}`);

                            // To highlight found words in search results
                            copiedTask.name = task.name
                                .replace(new RegExp('<|>', "gi"), '')
                                .replace(new RegExp(keywords.join('|'), "gi"), match => `<i class="highlighted">${match}</i>`)
                            copiedTask.notes = task.notes
                                .replace(new RegExp('<|>', "gi"), '')
                                .replace(new RegExp(keywords.join('|'), "gi"), match => `<i class="highlighted">${match}</i>`)

                            results.push({
                                day: elem.day,
                                month: key.split('-')[0],
                                year: key.split('-')[1],
                                unixTime: unixTime,
                                task: copiedTask,
                                exactMatch: name === 'day off' ? (name === query) : (name.includes(query) || notes.includes(query))
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
        const { searchString, searchResults } = this.state,
            { updateLastSearch } = this.props;

        return (
            <section className="search-page">
                <header className="search-bar">
                    <Link to="/" className="btn btn-back" title="Back to month page" draggable="false">Back</Link>
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder="Please enter text to search..."
                            value={searchString}
                            autoFocus="yes"
                            title="Please enter at least three characters to search by task name and notes"
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                this.setState({
                                    searchString: inputValue,
                                    searchResults: inputValue.trim().length > 2 && this.getSearchResults(inputValue)
                                })
                            }}
                        />
                        <button
                            className="btn btn-clear"
                            onClick={() => this.setState({ searchString: '', searchResults: [] })}
                            title="Clear query"
                        >
                            Clear query
                        </button>
                    </div>
                </header>

                <section className="search-results">
                    {searchResults.length > 0 ?

                        <nav className="list-of-results">
                            <ul>
                                {searchResults.map((foundElem, index) => (
                                    <li key={index}>
                                        <div className="date-info">
                                            <time>
                                                {new Date(foundElem.unixTime).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                                                {foundElem.task.time ? ` at ${new Date(foundElem.unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                                            </time>

                                            <Link
                                                to={`/day-details/${foundElem.day}-${foundElem.month}-${foundElem.year}`}
                                                className="show-day"
                                                onClick={() => updateLastSearch(searchString)}
                                                draggable="false"
                                                title={`Go to ${new Date(`${foundElem.day}-${foundElem.month}-${foundElem.year}`).toLocaleDateString()}`}
                                            >
                                                Show this day
                                            </Link>
                                        </div>
                                        <article>
                                            {searchResults.length > 1 && <span className="result-counter">{index + 1}/{searchResults.length}</span>}
                                            <h2 dangerouslySetInnerHTML={{ __html: foundElem.task.name }}></h2>
                                            {foundElem.task.notes && <div className="details">
                                                <p dangerouslySetInnerHTML={{ __html: foundElem.task.notes }}></p>
                                            </div>}
                                        </article>

                                    </li>
                                ))}
                            </ul>
                            <span className="end-of-search">There is no more results</span>
                        </nav> :

                        searchString.trim().length > 2 ?

                            <div className="message">
                                <p>Sorry...</p>
                                <p>No results found</p>
                            </div> :

                            searchString.trim().length > 0 ?

                                <div className="message">
                                    <p>The search request is too short.</p>
                                    <p>Please enter at least three characters.</p>
                                </div> : ''
                    }
                </section>
            </section>
        )
    }
}

export default SearchPage
