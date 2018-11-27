import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class InstructionsPage extends Component {
    render() {

        return (
            <section className='instructions'>
                <p>This page is under construction</p>
                <Link
                    to="/"
                    className="btn"
                    title="Back to month page"
                    style={{padding: '0 1em'}}
                >
                    Go back to month page
                </Link>
            </section>
        )
    }
}

export default InstructionsPage
