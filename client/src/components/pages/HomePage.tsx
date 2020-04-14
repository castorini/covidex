import React, { useState, useEffect } from 'react';
import { Search } from 'react-feather';
import styled from 'styled-components';
import { useLocation, withRouter, RouteComponentProps } from 'react-router';
import { Button } from 'reakit';
import Select from 'react-select';

import { PageWrapper, PageContent, Heading2 } from '../../shared/Styles';
import Loading from '../common/Loading';
import SearchResult from '../SearchResult';
import HomeText from '../HomeText';

import { tokenize } from '../../shared/Util';
import Theme from '../../shared/Theme';
import { HOME_ROUTE, API_BASE, SEARCH_ENDPOINT, SearchVerticalOptions } from '../../shared/Constants';

const HomePage = ({ history, location }: RouteComponentProps) => {
  const urlParams = new URLSearchParams(useLocation().search);
  const query = urlParams.get('query') || '';
  const vertical = urlParams.get('vertical') || 'cord19';

  const [loading, setLoading] = useState<Boolean>(false);
  const [queryInputText, setQueryInputText] = useState<string>(query || '');
  const [selectedVertical, setSelectedVertical] = useState<any>('cord19');

  const [queryId, setQueryId] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<any> | null>(null);

  useEffect(() => {
    setQueryInputText(query);
  }, [query]);

  useEffect(() => {
    switch (vertical) {
      case 'cord19':
        setSelectedVertical(SearchVerticalOptions[0]);
        break;
      case 'trialstreamer':
        setSelectedVertical(SearchVerticalOptions[1]);
        break;
      default:
        setSelectedVertical(SearchVerticalOptions[0]);
    }
  }, [vertical]);

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

        let response = await fetch(`${API_BASE}${SEARCH_ENDPOINT}?query=${query.toLowerCase()}&vertical=${vertical}`);
        setLoading(false);

        let data = await response.json();
        setQueryId(data.query_id);
        setSearchResults(data.response);
      } catch {
        setLoading(false);
        setSearchResults([]);
      }
    };
    fetchData();
  }, [query, vertical]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    setQueryInputText(event.target.value);

  const submitQuery = () => history.push(`${HOME_ROUTE}?query=${encodeURI(queryInputText)}&vertical=${selectedVertical.value}`);

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
          <Dropdown
            styles={dropdownStyles}
            className="dropdown"
            width="200px"
            options={SearchVerticalOptions}
            isSearchable={false}
            value={selectedVertical}
            onChange={(value: Object) => setSelectedVertical(value)}
          />
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
            onMouseDown={(e: any) => e.preventDefault()}
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
                <SearchResult
                  key={i}
                  article={article}
                  position={i}
                  queryTokens={queryTokens}
                  queryId={queryId}
                />
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

const Dropdown = styled(Select)``;

const dropdownStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    color: state.isFocused ? Theme.white : Theme.primary,
    background: state.isFocused ? Theme.primary : Theme.white,
    cursor: 'pointer',
    '&:hover': {
      background: Theme.primary,
      color: Theme.white,
    }
  }),
  control: (_: any, state: any) => ({
    width: 'fit-content',
    border: `1px solid ${state.isFocused ? Theme.primary : Theme.grey}`,
    marginRight: 8,
    borderRadius: 4,
    cursor: 'pointer',
    display: 'flex',
    padding: 4,
    paddingLeft: 8,
    '&:hover': {
      border: `1px solid ${Theme.primary}`
    }
  }),
  valueContainer: () => ({
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap'
  }),
  singleValue: () => ({
    position: 'relative',
    whiteSpace: 'nowrap'
  }),
  placeholder: () => ({
    position: 'relative'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  })
};
