import 'bootstrap-icons/font/bootstrap-icons.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import React from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

const Header = (prioritiesSet) => {
    return (
        <Navbar className="w-100" style={{ background: '#1a73e8', height: '60px' }} fixed="top">
            <Container fluid className="p-0 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <img
                        src="./src/img/logo.png"
                        width="40"
                        style={{ marginLeft: '23px' }}
                        className="d-inline-block align-bottom"
                        alt="Priority Link Logo"
                    />
                    <div style={{ fontFamily: 'Gabriela, serif', marginLeft: '10px', fontSize: '22px', color: "white" }}>
                        Priority Link
                    </div>
                </div>
            </Container>
        </Navbar>
    );
};

export default Header;
