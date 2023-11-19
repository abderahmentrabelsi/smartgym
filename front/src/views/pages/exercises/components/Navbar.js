import React from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'reactstrap';

import Logo from '../assets/images/Logo.png';

const Navbar = () => (
    <Row className="d-flex flex-row justify-content-around gap-sm-123 gap-xs-40 mt-sm-32 mt-xs-20 px-20">
    <Link to="/">
      <img src={Logo} alt="logo" style={{ width: '48px', height: '48px', margin: '0px 20px' }} />
    </Link>

        <Row className="d-flex gap-40 font-family-Alegreya font-size-24 align-items-end">
            <Link to="/" className="text-decoration-none color-3A1212 border-bottom-3-FF2625">Home</Link>
            <a href="#exercises" className="text-decoration-none color-3A1212">Exercises</a>
        </Row>
    </Row>
);

export default Navbar;
