import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import ErrorBoundary from 'react-error-boundary';

import { PageWrapper, PageContent, Heading2 } from '../../../shared/Styles';
import Loading from '../../common/Loading';
import AclSearchResult from './AclSearchResult';
import HomeText from './HomeText';
import SearchBar from './SearchBar';

import { tokenize } from '../../../shared/Util';
import {
  API_BASE,
  SEARCH_ENDPOINT,
  SEARCH_VERTICAL_OPTIONS,
  SearchVerticalOption,
  filterSchema
} from '../../../shared/Constants';
import Filters from './Filters';
import { AclSearchArticle, SearchFilters, SelectedSearchFilters } from '../../../shared/Models';

const defaultFilter = {
  yearMinMax: [0, 0],
  authors: [],
  journals: [],
  sources: []
};

const getSearchFilters = (searchResults: AclSearchArticle[] | null): any => {
  if (searchResults === null || searchResults.length === 0) {
    return defaultFilter;
  }

  let filterDictionary: any = {};
  const fields = Object.keys(filterSchema);
  // iterating through the fields in json
  fields.forEach(filter => {
    // checking the type of the field
    if (filterSchema[filter] == "slider"){
      let min = Number.MAX_VALUE;
      let max = -1;
      // filtering through each article
      searchResults.forEach(article => {
        if (article[filter]) {
          // year for now but can change to a more arbitrary measurement
          const year = Number(article[filter].substr(0,4))
          min = Math.min(year, min);
          max = Math.max(year, max);
        }
      })
      filterDictionary[filter] = min === max ? [min * 100 + 1, min * 100 + 12] : [min, max];
    } else if (filterSchema[filter] == "selection") {
      // initializing the list to store the selections
      filterDictionary[filter] = new Set([]);
      // filtering through each article
      searchResults.forEach(article => {
        if (article[filter]) {
          article[filter].forEach((a: String) => filterDictionary[filter].add(a));
        }
      })
      filterDictionary[filter] = Array.from(filterDictionary[filter].values()).filter((a: any) => a.length > 0);
    }
  })
  // console.log(filterDictionary);
  return filterDictionary;
};

const filterArticles = (selectedFilters: any, article: AclSearchArticle): Boolean => {
  let article_status = true;
  const fields = Object.keys(selectedFilters);
  fields.forEach(field => {
    if (filterSchema[field] == "slider") {
      article_status = article_status && Number(article[field].substr(0, 4)) >= selectedFilters[field][0] 
                       && Number(article[field].substr(0, 4)) <= selectedFilters[field][1]
    } else if (filterSchema[field] == "selection") {
      article_status = article_status && (selectedFilters[field].size == 0 || 
                       article[field].some((a: String) => selectedFilters[field].has(a)))
    }
  })

  return article_status;
}

const HomePage = () => {
  const urlParams = new URLSearchParams(useLocation().search);
  const query = urlParams.get('query') || '';
  const vertical = urlParams.get('vertical') || 'cord19';
  const [loading, setLoading] = useState<Boolean>(false);
  const [queryInputText, setQueryInputText] = useState<string>(query || '');
  const [selectedVertical, setSelectedVertical] = useState<SearchVerticalOption>(
    SEARCH_VERTICAL_OPTIONS[0],
  );

  const [filters, setFilters] = useState<any>({});
  const [selectedFilters, setSelectedFilters] = useState<any>({});
  const [queryId, setQueryId] = useState<string>('');
  const [searchResults, setSearchResults] = useState<AclSearchArticle[] | null>(null);

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
          `${API_BASE}${SEARCH_ENDPOINT}?query=${query.toLowerCase()}&vertical=${vertical}`,
        );
        setLoading(false);

        let data = await response.json();
        const { query_id, response: searchResults } = data;
        const filters = getSearchFilters(searchResults);

        let defaultSelectionFilter: any = {}
        const fields = Object.keys(filterSchema);
        fields.forEach(field => {
          if (filterSchema[field] == "slider") {
            defaultSelectionFilter[field] = filters[field];
          }else if (filterSchema[field] == "selection") {
            defaultSelectionFilter[field] = new Set([]);
          }
        });
        setQueryId(query_id);
        setSearchResults(searchResults);
        setSelectedFilters(defaultSelectionFilter);
        setFilters(filters);

      } catch {
        setLoading(false);
        setSearchResults([]);
      }
    };
    fetchData();
  }, [query, vertical]);

  const queryTokens = tokenize(query);
  const filteredResults =
    searchResults === null
      ? null
      : searchResults.filter(
          (article) => filterArticles(selectedFilters, article)
        );
  return (
    <PageWrapper>
      <PageContent>
        <SearchBar
          query={queryInputText}
          vertical={selectedVertical}
          setQuery={setQueryInputText}
          setVertical={setSelectedVertical}
        />
        <ErrorBoundary FallbackComponent={() => <NoResults>No results found</NoResults>}>
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
                      <AclSearchResult
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
