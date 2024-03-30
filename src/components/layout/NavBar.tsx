import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/navbar.css';

export const Styles = {
    button: {
        background: 'transparent',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        transition: 'background-color 0.3s, transform 0.3s',
        marginTop: '10px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    }
};

const NavBar: React.FC = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    // Dropdown
    const toggleDropdown = () => setIsOpen(!isOpen);
    const menuClass = isOpen ? "dropdown-menu-enter" : "";

    const handleLogout = () => {
        logout();
    }

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
                            {user ? (
                                <Dropdown show={isOpen} onToggle={toggleDropdown}>
                                    <Dropdown.Toggle style={{...LoggedInLink, ...Styles.button}}>
                                        {user.username}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{ width: "200px" }} className={menuClass}>
                                        <Dropdown.Item>
                                            <Link style={LoggedInLink} to="/profile">
                                                Profile
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Link style={LoggedInLink} to="#" onClick={handleLogout}>
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
