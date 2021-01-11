import React, { useRef } from 'react';
import styled from 'styled-components';
import Highlighter from 'react-highlight-words';

import { BodySmall } from '../../../shared/Styles';
import { API_BASE, SEARCH_CLICKED_ENDPOINT } from '../../../shared/Constants';
import { makePOSTRequest, parseAbstract } from '../../../shared/Util';
import { SearchResultProps } from '../../common/BaseSearchResult';
import ArticleResult from './ArticleResult';

const SearchResult = ({ article, position, queryId, queryTokens }: SearchResultProps) => {
  const fullTextRef = useRef(null);
  const originalAbstract = article.abstract_html || '';
  const abstract = parseAbstract(originalAbstract);
  const interactionRequestBody = { query_id: queryId, result_id: article.id, position };

  return (
    <SearchResultWrapper>
      <ArticleResult
        article={article}
        position={position}
        onClickTitle={() =>
          makePOSTRequest(`${API_BASE}${SEARCH_CLICKED_ENDPOINT}`, interactionRequestBody)
        }
      />
      <div ref={fullTextRef}>
        {/* Display abstract */}
        {abstract && (
          <>
            <ResultText marginBottom={4}>
              <SectionTitle>Abstract</SectionTitle>
            </ResultText>
            <Paragraph marginBottom={16}>
              <TextSpan>
                <Highlighter
                  searchWords={queryTokens}
                  textToHighlight={abstract}
                  highlightTag={Match}
                  highlightClassName="match"
                />
              </TextSpan>
            </Paragraph>
          </>
        )}
      </div>
    </SearchResultWrapper>
  );
};

export default SearchResult;

const SearchResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  padding: 24px 0;
  border-bottom: 1px dotted ${({ theme }) => theme.lightGrey};
  margin-bottom: 8px;
`;

const ResultText = styled.div<{
  marginTop?: number;
  marginBottom?: number;
}>`
  ${BodySmall}
  color: ${({ theme }) => theme.darkGrey};
  margin-top: ${({ marginTop }) => (marginTop ? marginTop : 0)}px;
  margin-bottom: ${({ marginBottom }) => (marginBottom ? marginBottom : 0)}px;
  display: block;
  & > .highlight {
    background: ${({ theme }) => theme.paleYellow};
  }
`;

const Paragraph = styled(ResultText)`
  padding-left: 8px;
  border-left: 1px solid ${({ theme }) => theme.lightGrey};
`;

const TextSpan = styled.span`
  line-height: 1.4;
  transition: all 0.3s;
`;

const Match = styled(TextSpan)`
  position: relative;
  font-weight: 500;
`;

const SectionTitle = styled.div`
  ${BodySmall}
  color: ${({ theme }) => theme.slate};
  font-weight: 600;
`;
