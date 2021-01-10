import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import ErrorBoundary from 'react-error-boundary';

import { PageWrapper, PageContent, Heading2 } from '../../../shared/Styles';
import Loading from '../../common/Loading';
import SearchBar from './SearchBar';

import { tokenize } from '../../../shared/Util';
import { API_BASE, SEARCH_ENDPOINT, SearchVerticalOption } from '../../../shared/Constants';
import Filters from './Filters';
import { SearchArticle, SearchFilters } from '../../../shared/Models';
import Configuration, { HOME_TEXT, METADATA, SEARCH_RESULT } from '../../../Configuration';

const filterSchema = Configuration[METADATA]['filters'];
const SearchResult = Configuration[SEARCH_RESULT];

const getSearchFilters = (searchResults: SearchArticle[] | null): SearchFilters => {
  // Iterate through JSON fields
  const fields = Object.keys(filterSchema);
  let filterValues: SearchFilters = {};
  fields.forEach((filter) => {
    // Handle year filter values
    if (filterSchema[filter].type === 'year_slider') {
      if (searchResults === null || searchResults.length === 0) {
        filterValues[filter] = [0, 0]; // Dummy range
      } else {
        let min = Number.MAX_VALUE;
        let max = -1;
        searchResults.forEach((article) => {
          if (article[filter]) {
            const year = Number(article[filter].substr(0, 4));
            min = Math.min(year, min);
            max = Math.max(year, max);
          }
        });
        //  Show monthly granularity if only 1 year range
        filterValues[filter] = min === max ? [min * 100 + 1, min * 100 + 12] : [min, max];
      }
    } else if (filterSchema[filter].type === 'selection') {
      filterValues[filter] = new Set([]);
      if (searchResults !== null && searchResults.length > 0) {
        searchResults.forEach((article) => {
          const val = article[filter];
          if (!val) {
            return;
          } else if (typeof val === 'string' || val instanceof String) {
            filterValues[filter].add(val);
          } else if (Array.isArray(val)) {
            article[filter].forEach((a: String) => filterValues[filter].add(a));
          }
        });
        filterValues[filter] = Array.from(filterValues[filter].values()).filter(
          (a: any) => a.length > 0,
        );
      }
    }
  });
  return filterValues;
};

const filterArticle = (selectedFilters: any, article: SearchArticle): Boolean => {
  let includeArticle = true;
  const fields = Object.keys(selectedFilters);
  fields.forEach((field) => {
    const val = article[field];
    if (filterSchema[field].type === 'year_slider') {
      includeArticle =
        includeArticle &&
        (!val ||
          (val.length >= 7 &&
            Number(val.substr(0, 7).replace('-', '')) >= selectedFilters[field][0] &&
            Number(val.substr(0, 7).replace('-', '')) <= selectedFilters[field][1]) ||
          (Number(val.substr(0, 4)) >= selectedFilters[field][0] &&
            Number(val.substr(0, 4)) <= selectedFilters[field][1]));
    } else if (filterSchema[field].type === 'selection') {
      if (typeof val === 'string' || val instanceof String) {
        includeArticle =
          includeArticle && (selectedFilters[field].size === 0 || selectedFilters[field].has(val));
      } else if (Array.isArray(val)) {
        includeArticle =
          includeArticle &&
          (selectedFilters[field].size === 0 ||
            val.some((a: String) => selectedFilters[field].has(a)));
      }
    }
  });
  return includeArticle;
};
const HomeText = Configuration[HOME_TEXT];

const HomePage = () => {
  const urlParams = new URLSearchParams(useLocation().search);
  const query = urlParams.get('query') || '';

  const [loading, setLoading] = useState<Boolean>(false);
  const [queryInputText, setQueryInputText] = useState<string>(query || '');
  const [selectedVertical, setSelectedVertical] = useState<SearchVerticalOption>({
    value: 'dataset',
    label: Configuration[METADATA]['dataset'],
  });

  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({});

  const [queryId, setQueryId] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchArticle[] | null>(null);

  useEffect(() => {
    setQueryInputText(query);
  }, [query]);

  useEffect(() => {
    const fetchData = async (query: string | null) => {
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
        const { query_id, response: searchResults } = data;
        const filters = getSearchFilters(searchResults);

        // Set default filters
        let defaultSelectedFilters: SearchFilters = {};
        const fields = Object.keys(filterSchema);
        fields.forEach((field) => {
          if (filterSchema[field].type === 'year_slider') {
            // Default to maximum range
            defaultSelectedFilters[field] = filters[field];
          } else if (filterSchema[field].type === 'selection') {
            defaultSelectedFilters[field] = new Set([]);
          }
        });

        setQueryId(query_id);
        setSearchResults(searchResults);
        setSelectedFilters(defaultSelectedFilters);
        setFilters(filters);
      } catch (err) {
        setLoading(false);
        setSearchResults([]);
      }
    };
    fetchData(query);
  }, [query]);

  const queryTokens = tokenize(query);
  const filteredResults =
    searchResults === null
      ? null
      : searchResults.filter((article) => filterArticle(selectedFilters, article));

  return (
    <PageWrapper>
      <PageContent>
        <SearchBar
          query={queryInputText}
          vertical={selectedVertical}
          setQuery={setQueryInputText}
          setVertical={setSelectedVertical}
        />
        <ErrorBoundary FallbackComponent={() => <NoResults>Error retrieving results</NoResults>}>
          {loading && <Loading />}
          <HomeContent>
            {!query && <HomeText />}
            {query && searchResults !== null && searchResults.length > 0 && (
              <Filters
                filters={filters}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
              />
            )}
            {query &&
              filteredResults !== null &&
              (searchResults === null || filteredResults.length === 0 ? (
                <NoResults>No results found</NoResults>
              ) : (
                <>
                  <SearchResults>
                    {filteredResults.map((article, i) => (
                      <SearchResult
                        key={i}
                        article={article}
                        position={i}
                        queryTokens={queryTokens}
                        queryId={queryId}
                      />
                    ))}
                  </SearchResults>
                </>
              ))}
          </HomeContent>
        </ErrorBoundary>
      </PageContent>
    </PageWrapper>
  );
};

export default HomePage;

const HomeContent = styled.div`
  width: 100%;
  margin-right: auto;
  display: flex;

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.singleColumn}px) {
    flex-direction: column;
  }
`;

const NoResults = styled.div`
  ${Heading2}
  display: flex;
  margin-top: 16px;
  padding-bottom: 24px;
`;

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
`;
