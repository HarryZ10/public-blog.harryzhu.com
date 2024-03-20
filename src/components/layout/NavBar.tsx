import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import { JSONPayload } from '../feed/CreateCommentForm';

import '../../styles/navbar.css';

export const Styles = {
    button: {
        // backgroundColor: '#5bc3eb',
        background: 'transparent',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        // borderRadius: '45px',
        transition: 'background-color 0.3s, transform 0.3s',
        marginTop: '10px',
        display: 'block',
        marginLeft: 'auto', // Centers the button
        marginRight: 'auto', // Centers the button
    }
};

const NavBar: React.FC = () => {
    const [username, setUsername] = useState('');
    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Dropdown
    const toggleDropdown = () => setIsOpen(!isOpen);
    const menuClass = isOpen ? "dropdown-menu-enter" : "";

    // Get username to display
    useEffect(() => {
        // Get the token from cookies
        const token = Cookies.get('token');
        if (token) {
            try {
                // Decode the token to get the username
                const decodedToken = jwtDecode<JSONPayload>(token);
                setUsername(decodedToken.username);

                // Check if the token is expired
                const now = new Date();
                setIsTokenExpired(decodedToken.exp * 1000 < now.getTime());
            } catch (error) {
                console.error("Removing unused or improper token");
                Cookies.remove('token');
            }
        }
    }, []);

    return (
        <>
            <Navbar style={NavStyle} expand="lg">
                <Container>
                    <Navbar.Brand style={LinkStyle} href="/">Journex</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" className="custom-toggler" />
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link as={Link} to="/" style={LinkStyle}>
                                Home
                            </Nav.Link>
                            <Nav.Link as={Link} to="/feed" style={LinkStyle}>
                                Feed
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            {username && !isTokenExpired ? (
                                <Dropdown show={isOpen} onToggle={toggleDropdown}>
                                    <Dropdown.Toggle style={{...LoggedInLink, ...Styles.button}}>
                                        {username}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{ width: "200px" }} className={menuClass}>
                                        <Dropdown.Item>
                                            <Link style={LoggedInLink} to="/profile">
                                                Profile
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Link style={LoggedInLink} to="/logout">
                                                Log Out
                                            </Link>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <Nav.Link as={Link} to="/login" style={LinkStyle}>
                                    Login
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};


const LinkStyle = {
    textDecoration: 'none',
    color: '#fff'
}

const LoggedInLink = {
    textDecoration: 'none',
    border: '#5bc3eb',
    width: '200px',
}

const NavStyle = {
    marginLeft: '50px',
    marginRight: '50px',
    fontFamily: 'Outfit',
    fontSize: '19px',
}

export default NavBar;
