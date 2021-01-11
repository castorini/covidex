import React, { useCallback, useState, useEffect } from 'react';
import { Search } from 'react-feather';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';
import { Button } from 'reakit';
import Select from 'react-select';

import Theme from '../../../shared/Theme';
import {
  HOME_ROUTE,
  SearchVerticalOption,
  LARGE_MOBILE_BREAKPOINT,
} from '../../../shared/Constants';
import { BoxShadow } from '../../../shared/Styles';
import Keycodes from '../../../shared/Keycodes';
import Configuration, { METADATA } from '../../../Configuration';

interface SearchBarProps extends RouteComponentProps {
  query: string;
  vertical: SearchVerticalOption;
  setQuery: (query: string) => any;
  setVertical: (vertical: SearchVerticalOption) => any;
}

const SearchBar = ({ query, vertical, setQuery, setVertical, history }: SearchBarProps) => {
  const [typeaheadIndex, setTypeaheadIndex] = useState<number>(-1);
  const [inputFocused, setInputFocused] = useState<boolean>(false);

  const examples: Array<string> = Configuration[METADATA]['searchExamples'];

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);

  const submitQuery = (q: string = query) => history.push(`${HOME_ROUTE}?query=${encodeURI(q)}`);

  const handleUserKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === Keycodes.ENTER && inputFocused) {
        submitQuery();
      }

      if (event.keyCode === Keycodes.UP) {
        setTypeaheadIndex(Math.max(0, typeaheadIndex - 1));
      } else if (event.keyCode === Keycodes.DOWN) {
        setTypeaheadIndex(Math.min(examples.length - 1, typeaheadIndex + 1));
      } else if (event.keyCode === Keycodes.ENTER && typeaheadIndex >= 0 && query === '') {
        submitQuery(examples[typeaheadIndex]);
      }
    },
    // eslint-disable-next-line
    [typeaheadIndex, query, inputFocused],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);
    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  useEffect(() => {
    setTypeaheadIndex(-1);
  }, [query, vertical]);

  return (
    <SearchBarWrapper>
      <Section>
        <SearchBarText>Search</SearchBarText>
        <Dropdown
          styles={dropdownStyles}
          className="dropdown"
          width="200px"
          options={[
            {
              value: 'dataset',
              label: Configuration[METADATA]['dataset'],
            },
          ]}
          isSearchable={false}
          value={vertical}
          onChange={(value: SearchVerticalOption) => setVertical(value)}
        />
        <SearchBarText>for</SearchBarText>
      </Section>
      <Section>
        <SearchInputWrapper>
          <SearchBarInput
            placeholder={Configuration[METADATA]['searchPlaceholder']}
            value={query}
            onChange={handleInput}
            onSubmit={() => submitQuery()}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          {inputFocused && query === '' && (
            <TypeaheadWrapper>
              {examples.map((example, idx) => (
                <TypeaheadResult
                  key={idx}
                  onClick={() => submitQuery(example)}
                  onMouseDown={() => submitQuery(example)}
                  selected={idx === typeaheadIndex}
                >
                  {example}
                </TypeaheadResult>
              ))}
            </TypeaheadWrapper>
          )}
        </SearchInputWrapper>
        <SearchButton
          type="submit"
          onSubmit={() => submitQuery()}
          onClick={() => submitQuery()}
          onMouseDown={(e: any) => e.preventDefault()}
        >
          <SearchIcon />
          Search
        </SearchButton>
      </Section>
    </SearchBarWrapper>
  );
};

export default withRouter(SearchBar);

const SearchBarWrapper = styled.div`
  position: relative;
  margin-right: auto;
  display: flex;
  margin-bottom: 24px;
  width: 860px;
  max-width: 100%;

  @media only screen and (max-width: ${LARGE_MOBILE_BREAKPOINT}px) {
    flex-direction: column;
  }
`;

const SearchBarText = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.darkGrey};
  margin-right: 8px;
`;

const SearchIcon = styled(Search)`
  display: inline;
  height: 16px;
  width: 16px;
  margin-right: 8px;
`;

const SearchBarInput = styled.input`
  display: flex;
  width: 100%;
  padding: 12px 16px;
  outline: none;
  border-radius: 4px 0 0 4px;
  border: 1px solid ${({ theme }) => theme.grey};
  border-right: none;

  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
    border-right: none;
  }
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

const SearchInputWrapper = styled.div`
  display: flex;
  flex: 1;
  position: relative;
`;

const TypeaheadResult = styled.div<{ selected: boolean }>`
  outline: none;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.lightGrey};
  color: ${({ selected, theme }) => (selected ? theme.white : theme.black)};
  background: ${({ selected, theme }) => (selected ? theme.primary : theme.white)};
  width: 100%;
  padding: 12px 16px;
  cursor: pointer;
  text-align: left;
  border-radius: 0;

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.white};
  }

  &:first-child {
    border-radius: 4px 4px 0 0;
  }

  &:last-child {
    border: none;
    border-radius: 0 0 4px 4px;
  }
`;

const TypeaheadWrapper = styled.div`
  ${BoxShadow}
  position: absolute;
  top: 52px;
  width: 100%;
  background: ${({ theme }) => theme.white};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.lightGrey};
  z-index: 2;
`;

const Section = styled.div`
  display: flex;

  &:last-child {
    flex: 1;
  }

  @media only screen and (max-width: ${LARGE_MOBILE_BREAKPOINT}px) {
    &:last-child {
      margin-top: 16px;
    }
  }
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
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    border: `1px solid ${Theme.lightGrey}`,
    boxShadow: `0px 2px 5px rgba(236, 237, 237, 0.4),
      0px 0px 5px rgba(142, 147, 148, 0.2)`,
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
    minWidth: 150,
    '&:hover': {
      border: `1px solid ${Theme.primary}`,
    },
  }),
  valueContainer: () => ({
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    whiteSpace: 'nowrap',
  }),
  singleValue: () => ({
    position: 'relative',
    whiteSpace: 'nowrap',
  }),
  placeholder: () => ({
    position: 'relative',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
};
