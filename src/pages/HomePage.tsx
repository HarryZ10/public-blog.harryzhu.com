import React from 'react';
import styled from 'styled-components';
import NavBar from '../components/layout/NavBar';

const PageTitle = styled.h1`
    font-weight: 800;
    font-family: 'Outfit';
    color: ${(props) => props.theme.dark.colors.skyblueHighlight };
    letter-spacing: 0.7rem;
    font-size: 82px;
    line-height: 72px;
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
    margin-top: 10rem;
    padding: '28px 0 16px';
`;

export const PageSubTitle = styled.h1`
    font-weight: 100;
    font-family: 'Outfit';
    color: ${(props) => props.theme.dark.colors.text };
    font-size: '36px';
    line-height: 62px;
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
    margin-top: 70px;
    letter-spacing: 0;
    margin-bottom: 52px;
    padding: '28px 0 16px';
`;

// Home Page component
const HomePage = () => {

    return (
        <>
            <NavBar />
            <section>
                <PageTitle>Journex</PageTitle>
                <PageSubTitle>Career journaling made easy</PageSubTitle>
            </section>
        </>
    );
};

export default HomePage;
