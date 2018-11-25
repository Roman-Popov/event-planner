import React, { Component } from 'react';

import emailIcon from '../icons/email.svg';
import gitHubIcon from '../icons/github.svg';
import linkedInIcon from '../icons/linkedin.svg';
import telegramIcon from '../icons/telegram.svg';
import vkIcon from '../icons/vkontakte.svg';

import ClipboardJS from 'clipboard';

class ErrorBoundaryPage extends Component {
    state = {
        errorText: null,
        error: null,
        errorInfo: null
    }

    componentDidCatch(error, errorInfo) {
        var clipboard = new ClipboardJS('.copy-to-clipboard');

        clipboard.on('success', function (e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);
            console.log('success')

            e.clearSelection();
        });

        clipboard.on('error', function (e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });

        this.setState({
            error: error,
            errorInfo: errorInfo,
            clipboard: clipboard
        })
    }

    componentWillUnmount() {
        this.state.clipboard && this.state.clipboard.destroy();
    }

    render() {
        const { error, errorInfo } = this.state;

        if (errorInfo) {
            // Error path
            const subject = encodeURIComponent('Event-planner bug report'),
                location = window.location.href,
                shortErrStack = error.stack.split('\n').slice(0,6).join('\n'),
                description = encodeURIComponent(`Location: ${location}\n\nError: ${error.toString()}\n\nError stack: ${shortErrStack}\n\nError info componentStack: ${errorInfo.componentStack}`);

            window.scrollTo(0, 0);

            function appReset(hard) {
                const monthDataKeys = hard === true ? Object.keys(localStorage).filter(key => /^[A-Z]+-20\d\d$/i.test(key)) : [],
                    serviceInfoKeys = ['localStorageSpaceInfo'];

                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations()
                        .then(registrations => {
                            for (let registration of registrations) {
                                registration.unregister()
                            }
                        })
                        .catch(() => alert('ServiceWorker error'))
                        .then(() => [...monthDataKeys, ...serviceInfoKeys].forEach(key => localStorage.removeItem(key)))
                        .catch(() => alert('Reset error'))
                        .then(() => window.location.replace(process.env.PUBLIC_URL || '/'))
                }
            }

            return (
                <section className="error-boundary-page">

                    <header>
                        <h2>...Oops!</h2>
                        <h2>An error has occurred!</h2>
                    </header>

                    <button
                        className="summary"
                        title="Toggle technical details section visibility"
                        onClick={(e) => {
                            const bugInfo = e.target.nextElementSibling;

                            bugInfo.classList.toggle('visible');
                            bugInfo.classList.contains('visible') ?
                                e.target.innerText = 'Hide technical details' :
                                e.target.innerText = 'Show technical details';
                        }}
                    >
                        Show technical details
                    </button>

                    <div className="bug-info-wrapper">
                        <article id="bug-info">
                            <div><b>Location:</b> {location}</div>
                            <div><b>Error:</b> {error.toString()}</div>
                            <div>
                                <b>Error stack:</b>
                                <ul>
                                    {error.stack.split('\n').map((line, index) => {
                                        return line ? (
                                            <li key={index}>{line}</li>
                                        ) : ''
                                    })}
                                </ul>
                            </div>
                            <div>
                                <b>Error componentStack:</b>
                                <ul>
                                    {errorInfo.componentStack.split('\n').map((line, index) => {
                                        return line ? (
                                            <li key={index}>{line}</li>
                                        ) : ''
                                    })}
                                </ul>

                            </div>
                        </article>

                        <div className="copy-panel">
                            <button
                                className="copy-to-clipboard btn"
                                data-clipboard-target="#bug-info"
                                title="Copy whole information about error to clipboard"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    <a
                        href={`mailto:popov.r.k.18@gmail.com?subject=${subject}&body=${description}`}
                        className="btn btn-send-report"
                        title="Click to create an email automatically"
                    >
                        Send bug report
                    </a>

                    <p className="send-report-notes">Your default mail client for sending an email will be open.</p>

                    <div className="backup-btn-wrapper">
                        You can
                        <button
                            className="btn btn-download-backup"
                            title="Download backup file"
                            onClick={() => {
                                const a = document.getElementById('err-boundary-backup-link'),
                                    text = JSON.stringify(localStorage),
                                    file = new Blob([text], { type: 'application/json' });
                                a.href = URL.createObjectURL(file);
                                a.download = `TimeTable-${Date.now()}.json`;
                                a.click();
                            }}
                        >
                            <span></span>download backup file
                        </button>
                        just in case
                    </div>
                    <a href="" id="err-boundary-backup-link" hidden={true}>Click here to download backup file</a>

                    <button
                        href='/'
                        className="btn btn-go-main"
                        title="Go to the main page"
                        onClick={() => {
                            if ('serviceWorker' in navigator) {
                                navigator.serviceWorker.getRegistrations()
                                .then(registrations => {
                                    for (let registration of registrations) {
                                        registration.unregister()
                                    }
                                })
                                .then(() => window.location.replace(process.env.PUBLIC_URL || '/'))
                                .catch(() => alert('ServiceWorker error'))
                            }
                        }}
                    >
                        Go to the main page
                    </button>

                    <section className="application-reset">
                        <h2>Application reset</h2>
                        <div className="btn-wrapper">
                            <button
                                className="btn btn-no"
                                onClick={() => window.confirm(
                                    'Attention! During the soft reset, only service application data will be deleted. ' +
                                    'User data will not be affected. ' +
                                    'Do you really want to continue?'
                                ) ? appReset() : false}
                                title="Reset all settings and keep user data"
                            >
                                Soft
                            </button>
                            <button
                                className="btn btn-yes"
                                onClick={() => window.confirm(
                                    'Warning! During the hard reset, ALL application data will be deleted. ' +
                                    'Deleted data CAN NOT BE RESTORED without a backup file. ' +
                                    'Do you really want to continue?'
                                    ) ? appReset(true) : false}
                                title="Warning! Deleted data can not be restored without a backup file"
                            >
                                Hard
                            </button>
                        </div>
                    </section>

                    <footer className="footer">
                        <aside>
                            <span className="copyright">© 2018 Roman Popov</span>
                            <div className="contacts">
                                <a href="mailto:popov.r.k.18@gmail.com" title="popov.r.k.18@gmail.com" draggable="false">
                                    Email <img src={emailIcon} alt="Email" />
                                </a>
                                <a href="https://github.com/Roman-Popov" title="GitHub" draggable="false">
                                    GitHub <img src={gitHubIcon} alt="GitHub" />
                                </a>
                                <a href="https://linkedin.com/in/-roman-popov-/" title="LinkedIn" draggable="false">
                                    LinkedIn <img src={linkedInIcon} alt="LinkedIn" />
                                </a>
                                <a href="https://t.me/Barmalew" title="Telegram" draggable="false">
                                    Telegram <img src={telegramIcon} alt="Telegram" />
                                </a>
                                <a href="https://vk.com/vk.popovroman" title="Vkontakte" draggable="false">
                                    Vkontakte <img src={vkIcon} alt="Vkontakte" />
                                </a>
                            </div>
                        </aside>
                    </footer>
                </section>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}

export default ErrorBoundaryPage
