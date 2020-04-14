import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router';

import { PageWrapper, PageContent, Heading2 } from '../../../shared/Styles';
import Loading from '../../common/Loading';
import SearchResult from '../../SearchResult';
import HomeText from '../../HomeText';
import SearchBar from './SearchBar';

import { tokenize } from '../../../shared/Util';
import {
  API_BASE,
  SEARCH_ENDPOINT,
  SEARCH_VERTICAL_OPTIONS,
  SearchVerticalOption,
} from '../../../shared/Constants';

const HomePage = () => {
  const urlParams = new URLSearchParams(useLocation().search);
  const query = urlParams.get('query') || '';
  const vertical = urlParams.get('vertical') || 'cord19';

  const [loading, setLoading] = useState<Boolean>(false);
  const [queryInputText, setQueryInputText] = useState<string>(query || '');
  const [selectedVertical, setSelectedVertical] = useState<SearchVerticalOption>(
    SEARCH_VERTICAL_OPTIONS[0],
  );

  const [queryId, setQueryId] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<any> | null>(null);

  useEffect(() => {
    setQueryInputText(query);
  }, [query]);

  useEffect(() => {
    switch (vertical) {
      case 'cord19':
        setSelectedVertical(SEARCH_VERTICAL_OPTIONS[0]);
        break;
      case 'trialstreamer':
        setSelectedVertical(SEARCH_VERTICAL_OPTIONS[1]);
        break;
      default:
        setSelectedVertical(SEARCH_VERTICAL_OPTIONS[0]);
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

        let response = await fetch(
          `${API_BASE}${SEARCH_ENDPOINT}?query=${query.toLowerCase()}?vertical=${vertical}`,
        );
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

  const queryTokens = tokenize(query);

  return (
    <PageWrapper>
      <PageContent>
        <SearchBar
          query={queryInputText}
          vertical={selectedVertical}
          setQuery={setQueryInputText}
          setVertical={setSelectedVertical}
        />
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

export default HomePage;

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
