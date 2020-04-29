import React from 'react';
import styled from 'styled-components';
import RangeSlider from '../../common/RangeSlider';
import { Heading3, Heading2 } from '../../../shared/Styles';
import SelectionFilter from '../../common/SelectionFilter';
import { SearchFilters, SelectedSearchFilters } from '../../../shared/Models';

interface FiltersProps {
  filters: SearchFilters;
  selectedFilters: SelectedSearchFilters;
  setSelectedFilters: (value: SelectedSearchFilters) => void;
}

const updateSelectionFilter = (selectedFilter: Set<string>, value: string): Set<string> => {
  let newFilters = selectedFilter;
  if (newFilters.has(value)) {
    newFilters.delete(value);
  } else {
    newFilters.add(value);
  }
  return newFilters;
};

const Filters: React.FC<FiltersProps> = ({ filters, selectedFilters, setSelectedFilters }) => {
  return (
    <FiltersWrapper>
      <FilterTitle>Filter your search</FilterTitle>
      {filters.yearMinMax[0] !== filters.yearMinMax[1] && (
        <FilterComponent>
          <FilterSubtitle>Year</FilterSubtitle>
          <RangeSlider
            min={filters.yearMinMax[0]}
            max={filters.yearMinMax[1]}
            values={selectedFilters.yearRange}
            setValues={(values) =>
              setSelectedFilters({
                ...selectedFilters,
                yearRange: values,
              })
            }
          />
        </FilterComponent>
      )}
      {filters.authors.length > 0 && (
        <FilterComponent>
          <FilterSubtitle>Author</FilterSubtitle>
          <SelectionFilter
            options={filters.authors}
            selectedOptions={selectedFilters.authors}
            setSelectedOptions={(author) => {
              setSelectedFilters({
                ...selectedFilters,
                authors: updateSelectionFilter(selectedFilters.authors, author),
              });
            }}
          />
        </FilterComponent>
      )}
      {filters.journals.length > 0 && (
        <FilterComponent>
          <FilterSubtitle>Journal</FilterSubtitle>
          <SelectionFilter
            options={filters.journals}
            selectedOptions={selectedFilters.journals}
            setSelectedOptions={(journal) => {
              setSelectedFilters({
                ...selectedFilters,
                journals: updateSelectionFilter(selectedFilters.journals, journal),
              });
            }}
          />
        </FilterComponent>
      )}
      {filters.sources.length > 0 && (
        <FilterComponent>
          <FilterSubtitle>Source</FilterSubtitle>
          <SelectionFilter
            options={filters.sources}
            selectedOptions={selectedFilters.sources}
            setSelectedOptions={(source) => {
              setSelectedFilters({
                ...selectedFilters,
                sources: updateSelectionFilter(selectedFilters.sources, source),
              });
            }}
          />
        </FilterComponent>
      )}
    </FiltersWrapper>
  );
};

export default Filters;

const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  min-width: 240px;
  margin-right: 48px;
  padding-top: 24px;
`;

const FilterTitle = styled.div`
  ${Heading2}
  margin-bottom: 16px;
`;

const FilterSubtitle = styled.div`
  ${Heading3}
  color: ${({ theme }) => theme.slate};
  margin-bottom: 8px;
`;

const FilterComponent = styled.div`
  margin: 16px auto;
  width: 100%;
`;
