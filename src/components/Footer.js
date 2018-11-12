import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Logo from '../components/Logo';

import emailIcon from '../icons/email.svg';
import gitHubIcon from '../icons/github.svg';
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
                        <li> <Link to="/instructions">User instructions</Link> </li>
                        <li> <Link to={`/statistics/${currentMonth}-${currentYear}`}>Month overview</Link> </li>
                        <li> <Link to="/storage-management">Storage management</Link> </li>
                    </ul>
                </nav>
                <div className="logo">
                    {(vw > 950) ?
                        <Logo style={{ width: '50px', bgColor: '#076cab' }} type="small" /> :
                        (vw <500 || vw > 620) ?
                            <Logo style={{ width: '70px', bgColor: '#076cab' }} type="medium" /> :
                            <Logo style={{ width: '100px', bgColor: '#076cab' }} type="big" />
                    }
                </div>
                <aside>
                    <span className="copyright">© 2018 Roman Popov</span>
                    <div className="contacts">
                        <a href="mailto:popov.r.k.18@gmail.com" className="cnt-email">Email <img src={emailIcon} alt="Email"/></a>
                        <a href="https://github.com/Roman-Popov" className="cnt-github">GitHub <img src={gitHubIcon} alt="Email" /></a>
                        <a href="https://t.me/Barmalew" className="cnt-telegram">Telegram <img src={telegramIcon} alt="Email" /></a>
                        <a href="https://vk.com/vk.popovroman" className="cnt-vk">Vkontakte <img src={vkIcon} alt="Email" /></a>
                    </div>
                </aside>
            </footer>
        )
    }
}

export default Footer
