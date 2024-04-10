import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from "antd";
import NavBar from '../components/layout/NavBar';
import { PageTitle } from './FeedPage';
import styled from 'styled-components';

const {Search} = Input;

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const { user, login, logout, appUsers } = useAuth();

    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {

        const searchInput = e.target.value;
        setInput(searchInput);

        const newFilter = appUsers.filter((value: any) => {
            return value.username.toLowerCase().includes(searchInput.toLowerCase());
        });

        if (searchInput === "") {
            setSearchResults([]);
        } else {
            setSearchResults(newFilter);
        }
    };

    return (
        <>
            <NavBar />
            <PageTitle>Search</PageTitle>

            <SearchContainer>
                <div className="searchInputs">
                    <Search
                        placeholder="Find people you know!" 
                        value={input}
                        onChange={(e) => handleFilter(e)}
                        enterButton
                    />
                </div>

                {searchResults.length > 0 && (
                    <DataResult>
                        {searchResults.map((value: any, index) => {
                            return (
                                <DataItem>
                                    <Item to={`/profile/${value.id}`}>{value.username}</Item>
                                </DataItem>
                            );
                        })}
                    </DataResult>
                )}
            </SearchContainer>
        </>
    );

};

const SearchContainer = styled.div`
  margin: 5rem;

  @media (max-width: 768px) {
    margin: 2rem;
  }
`;

const DataResult = styled.div`
  margin-top: 5px;
  width: 90%;
  height: 200px;
  background-color: #f5f5f5;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  overflow: hidden;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DataItem = styled.div`
  padding:`;

const Item = styled(Link)`
  text-decoration: none;
  color: #000;
`;

export default SearchPage;
