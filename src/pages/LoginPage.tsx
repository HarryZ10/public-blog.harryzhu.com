import React from "react";
import styled from "styled-components";
import LoginPanel from '../components/login/LoginPanel';

const PageTitle = styled.h1`
    font-weight: 800;
    font-family: 'Outfit';
    color: ${(props) => props.theme.dark.colors.skyblueHighlight};
    font-size: 82px;
    line-height: 72px;
    width: max-content;
    max-width: 100%;
    margin: 0 auto;
    margin-top: 10rem;
    padding: '28px 0 16px';
`;

const LoginPage = () => {

    return (
        <>
            <PageTitle>Login.</PageTitle>
            <LoginPanel/>
        </>
    )

}

export default LoginPage;
