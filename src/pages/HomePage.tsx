import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import NavBar from '../components/layout/NavBar';

const PageTitle = styled.h1`
    font-weight: 800;
    font-family: 'Outfit';
    color: ${(props) => props.theme.dark.colors.skyblueHighlight};
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
    margin-bottom: 11rem;
    padding: '28px 0 16px';
`;

const HeroSection = styled(Container)`
    padding-bottom: 9rem;
`;

const FlavorSection = styled(Container)`
    padding-top: 9rem;
`;

const FlavorTitle = styled.h2`
    font-size: 2.8rem;
    font-weight: bold;
    margin-bottom: 5rem;
    color: ${(props) => props.theme.dark.colors.skyblueHighlight};
    text-align: center;
`;

const FlavorCard = styled(Card)`
    border: none;
    background-color: ${(props) => props.theme.dark.colors.backgroundLight};
    color: ${(props) => props.theme.dark.colors.text};
    padding: 2rem;
    margin-bottom: 2rem;
    min-height: 300px;
    border-radius: 8px;
`;

const FlavorCardTitle = styled(Card.Title)`
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
`;

const FlavorCardText = styled(Card.Text)`
    font-size: 1.2rem;
    padding: 20px;
    text-align: center;
`;

const HeroButton = styled(Button)`
    margin: 0 auto;
    display: block;
    background: linear-gradient(to right, #4292ad, #1e2e9c);
    border: none;
    color: white;
    background-size: 200% auto;
    padding: 12px 24px;
    font-size: 18px;
    border-radius: 8px;
    transition: all 0.3s ease;
    width: 200px;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        background-position: right center;
    }
`;

// Home Page component
const HomePage = () => {

    const navigate = useNavigate();

    return (
        <>
            <NavBar />
            <HeroSection>
                <PageTitle>Journex</PageTitle>
                <PageSubTitle>Career journaling made easy</PageSubTitle>
                <HeroButton onClick={() => {
                    navigate("/blog")
                }}>Get Started</HeroButton>
            </HeroSection>

            <FlavorSection>
                <FlavorTitle>What We're About</FlavorTitle>
                <Row>
                <Col md={4}>
                    <FlavorCard>
                        <FlavorCardTitle>Intuitive</FlavorCardTitle>
                        <FlavorCardText>
                            Easily capture your thoughts, experiences, and milestones with the community
                        </FlavorCardText>
                    </FlavorCard>
                </Col>
                <Col md={4}>
                    <FlavorCard>
                        <FlavorCardTitle>Insightful</FlavorCardTitle>
                        <FlavorCardText>
                            Track your progress, identify patterns, and make data-driven decisions
                        </FlavorCardText>
                    </FlavorCard>
                </Col>
                <Col md={4}>
                    <FlavorCard>
                        <FlavorCardTitle>Collaborative</FlavorCardTitle>
                        <FlavorCardText>
                            Get feedback, seek advice, and celebrate your achievements together
                        </FlavorCardText>
                    </FlavorCard>
                </Col>
                </Row>
            </FlavorSection>
        </>
    );
};

export default HomePage;
