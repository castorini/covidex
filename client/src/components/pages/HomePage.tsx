import React, { useState, useEffect } from 'react';
import { Search } from 'react-feather';
import styled from 'styled-components';
import { useLocation, withRouter, RouteComponentProps } from 'react-router';
import { Button } from 'reakit';

import { PageWrapper, PageContent, Heading2 } from '../../shared/Styles';
import { HOME_ROUTE, API_BASE, SEARCH_ENDPOINT } from '../../shared/Constants';

import Loading from '../common/Loading';
import SearchResult from '../SearchResult';
import HomeText from '../HomeText';
import { tokenize } from '../../shared/Util';

const HomePage = ({ history, location }: RouteComponentProps) => {
  const urlParams = new URLSearchParams(useLocation().search);
  const query = urlParams.get('query') || '';

  const [loading, setLoading] = useState<Boolean>(false);
  const [queryInputText, setQueryInputText] = useState<string>(query || '');
  const [searchResults, setSearchResults] = useState<Array<any> | null>(null);

  useEffect(() => {
    setQueryInputText(query);
  }, [query]);

  useEffect(() => {
    const fetchData = async () => {
      if (query === null || query === '') {
        setLoading(false);
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        setSearchResults(null);
        let response = await fetch(`${API_BASE}${SEARCH_ENDPOINT}?query=${query.toLowerCase()}`);
        setLoading(false);
        let data = await response.json();
        setSearchResults(data);
      } catch {
        setLoading(false);
        setSearchResults([]);
      }
    };
    fetchData();
  }, [query]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    setQueryInputText(event.target.value);

  const submitQuery = () => history.push(`${HOME_ROUTE}?query=${encodeURI(queryInputText)}`);

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submitQuery();
    }
  };

  const queryTokens = tokenize(query);

  return (
    <PageWrapper>
      <PageContent>
        <SearchBarWrapper>
          <SearchBar
            placeholder="Search..."
            value={queryInputText}
            onChange={handleInput}
            onSubmit={submitQuery}
            onKeyPress={handleEnter}
          />
          <SearchButton
            type="submit"
            onSubmit={submitQuery}
            onClick={submitQuery}
            onMouseDown={(e) => e.preventDefault()}
          >
            <SearchIcon />
            Search
          </SearchButton>
        </SearchBarWrapper>
        {loading && <Loading />}
        <SearchResults>
          {!query && <HomeText />}
          {query &&
            searchResults !== null &&
            (searchResults.length === 0 ? (
              <NoResults>No results found</NoResults>
            ) : (
              searchResults.map((article, i) => (
                <SearchResult article={article} key={i} number={i + 1} queryTokens={queryTokens} />
              ))
            ))}
        </SearchResults>
      </PageContent>
    </PageWrapper>
  );
};

export default withRouter(HomePage);

const SearchBarWrapper = styled.div`
  position: relative;
  margin-right: auto;
  display: flex;
  margin-bottom: 24px;
  width: 800px;
  max-width: 100%;
`;

const SearchIcon = styled(Search)`
  display: inline;
  height: 16px;
  width: 16px;
  margin-right: 8px;
`;

const SearchBar = styled.input`
  display: flex;
  width: 100%;
  padding: 12px 16px;
  outline: none;
  border-radius: 4px 0 0 4px;
  border: 1px solid ${({ theme }) => theme.grey};
  border-right: none;
`;

const SearchButton = styled(Button)`
  display: flex;
  background: ${({ theme }) => theme.primary};
  border: none;
  padding: 12px 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.white};
  border-radius: 0 4px 4px 0;
  outline: none;
  transition: background 0.1s;

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.secondary};
  }
`;

const SearchResults = styled.div`
  width: 100%;
  margin-right: auto;
`;

const NoResults = styled.div`
  ${Heading2}
  display: flex;
  margin-top: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.lightGrey};
`;
