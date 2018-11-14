import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Logo from '../components/Logo';

import emailIcon from '../icons/email.svg';
import gitHubIcon from '../icons/github.svg';
import linkedInIcon from '../icons/linkedin.svg';
import telegramIcon from '../icons/telegram.svg';
import vkIcon from '../icons/vkontakte.svg';


class Footer extends Component {
    resize = () => this.forceUpdate()

    componentDidMount() {
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    render() {
        const { currentMonth, currentYear } = this.props,
            vw = window.innerWidth;

        return (
            <footer className="footer">
                <nav>
                    <ul>
                        <li> <Link to="/instructions" draggable="false">User instructions</Link> </li>
                        <li> <Link to={`/statistics/${currentMonth}-${currentYear}`} draggable="false">Month overview</Link> </li>
                        <li> <Link to="/storage-management" draggable="false">Storage management</Link> </li>
                    </ul>
                </nav>
                <div className="logo">
                    {(vw > 950) ?
                        <Logo style={{ width: '50px', bgColor: '#076cab' }} type="small" href="https://roman-popov.github.io" /> :
                        (vw <500 || vw > 620) ?
                            <Logo style={{ width: '70px', bgColor: '#076cab' }} type="medium" href="https://roman-popov.github.io" /> :
                            <Logo style={{ width: '100px', bgColor: '#076cab' }} type="big" href="https://roman-popov.github.io" />
                    }
                </div>
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
        )
    }
}

export default Footer
