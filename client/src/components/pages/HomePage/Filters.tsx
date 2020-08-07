import React from 'react';
import styled from 'styled-components';
import RangeSlider from '../../common/RangeSlider';
import { Heading2, Body } from '../../../shared/Styles';
import SelectionFilter from '../../common/SelectionFilter';
import { SearchFilters, SelectedSearchFilters } from '../../../shared/Models';
import { filterSchema } from '../../../shared/Constants';


interface FiltersProps {
  filters: any;
  selectedFilters: any;
  setSelectedFilters: (value: any) => void;
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
  const fields = Object.keys(filters);
  return (
    <FiltersWrapper>
      <FilterTitle>Filter your search</FilterTitle>
      {fields.map((filter, i) => {
        if (filters[filter]) {
          if (filterSchema[filter] == "slider") {
            return <FilterComponent>
                    <FilterSubtitle>{filter}</FilterSubtitle>
                      <RangeSlider
                        min={filters[filter][0]}
                        max={filters[filter][1]}
                        values={selectedFilters[filter]}
                        setValues={(values) => {
                          selectedFilters[filter] = values
                          setSelectedFilters({
                            ...selectedFilters
                          })
                         }
                        }
                      />
                    </FilterComponent>
          } else if (filterSchema[filter] == "selection") {
            return <FilterComponent>
                    <FilterSubtitle>{filter}</FilterSubtitle>
                    <SelectionFilter
                      options={filters[filter]}
                      selectedOptions={selectedFilters[filter]}
                      setSelectedOptions={(value) => {
                        selectedFilters[filter] = updateSelectionFilter(selectedFilters[filter], value)
                        setSelectedFilters({
                          ...selectedFilters
                        });
                      }}
                    />
                  </FilterComponent>
          }
        }
      })}
    </FiltersWrapper>
  );
};

export default Filters;

const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  min-width: 200px;
  margin-right: 48px;
  padding-top: 24px;

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.singleColumn}px) {
    width: 100%;
    padding: 8px 0;
    border-bottom: 1px solid ${({ theme }) => theme.lightGrey};
  }
`;

const FilterTitle = styled.div`
  ${Heading2}
  margin-bottom: 16px;
`;

const FilterSubtitle = styled.div`
  ${Body}
  color: ${({ theme }) => theme.darkGrey};
  font-weight: 600;
`;

const FilterComponent = styled.div`
  margin: 16px auto;
  width: 100%;

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.singleColumn}px) {
    margin: 8px auto;
  }
`;
