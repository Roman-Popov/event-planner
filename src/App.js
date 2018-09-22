import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom'
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="control-panel">
                    <button className="btn btn-add">+</button>
                    <button className="btn btn-select-month">Select month</button>
                    <Link to="/search" className="btn btn-open-search">Open search</Link>
                </header>
            </div>
        );
    }
}

export default App;
