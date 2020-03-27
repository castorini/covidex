import React, { useState, useEffect } from 'react';
import { Search } from 'react-feather';
import styled from 'styled-components';
import { useLocation, withRouter, RouteComponentProps } from 'react-router';
import { Button } from 'reakit';

import { PageWrapper, PageContent } from '../../shared/Styles';

import Loading from '../Loading';
import { HOME_ROUTE } from '../../shared/Constants';

const HomePage = ({ history }: RouteComponentProps) => {
  const urlParams = new URLSearchParams(useLocation().search);
  const query = urlParams.get('query');

  const [loading, setLoading] = useState<Boolean>(false);
  const [queryInputText, setQueryInputText] = useState<string>(query || '');
  const [searchResults, setSearchResults] = useState<Array<any>|null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (query === null || query === '') {
        setSearchResults([]);
        return;
      }
      try {
        setLoading(true);
        setSearchResults(null);
        let response = await fetch(`http://localhost:8000/search?query=${encodeURI(query)}`)
        setLoading(false);
        let data = await response.json();
        setSearchResults(data);
      } catch {
        setLoading(false);
        setSearchResults([]);
      }
    }
    fetchData();
  }, [query]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => setQueryInputText(event.target.value);
  const submitQuery = () => history.push(`${HOME_ROUTE}?query=${queryInputText}`);
  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submitQuery();
    }
  }

  return (
    <PageWrapper>
      <PageContent>
        <SearchBarWrapper>
          <SearchIcon />
          <SearchBar
            value={queryInputText}
            onChange={handleInput}
            onSubmit={submitQuery}
            onKeyPress={handleEnter}
          />
          <SearchButton
            type="submit"
            onSubmit={submitQuery}
            onClick={submitQuery}
            onMouseDown={e => e.preventDefault}
          >
            Search
          </SearchButton>
        </SearchBarWrapper>
        {loading && <Loading />}
        <SearchResults>
          {searchResults !== null && (searchResults.length === 0
            ? <NoResults>No results found</NoResults>
            : searchResults.map(result => <div>test</div>))}
        </SearchResults>
      </PageContent>
    </PageWrapper>
  );
}

export default withRouter(HomePage);

const SearchBarWrapper = styled.div`
  position: relative;
  margin: auto;
  display: flex;
  margin-bottom: 48px;
  width: 800px;
  max-width: 100%;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  height: 24px;
  top: 12px;
  left: 16px;
`;

const SearchBar = styled.input`
  display: flex;
  width: 100%;
  margin: auto;
  padding: 12px 16px 12px 56px;
  border: none;
  font-size: 20px;
  outline: none;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.primary};
`;

const SearchButton = styled(Button)`
  margin-left: 8px;
  background: ${({ theme }) => theme.primary};
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.white};
  border-radius: 8px;
  outline: none;

  &:hover, &:focus {
    filter: brightness(90%);
  }

  &:active {
    filter: brightness(80%);
  }
`;

const SearchResults = styled.div`
  width: 800px;
  max-width: 100%;
  margin: auto;
`;

const NoResults = styled.div`
  font-size: 20px;
  font-weight: 600;
`;