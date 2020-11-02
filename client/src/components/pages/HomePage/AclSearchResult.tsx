import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import Highlighter from 'react-highlight-words';

import { BodySmall, FadeInText } from '../../../shared/Styles';
import { API_BASE, SEARCH_CLICKED_ENDPOINT } from '../../../shared/Constants';
import { makePOSTRequest, parseAbstract } from '../../../shared/Util';
import { AclSearchArticle } from '../../../shared/Models';
import AclBaseArticleResult from '../../common/AclBaseArticleResult';

interface SearchResultProps {
  article: AclSearchArticle;
  position: number;
  queryId: string;
  queryTokens: Array<string>;
}

const AclSearchResult = ({ article, position, queryId, queryTokens }: SearchResultProps) => {
  const fullTextRef = useRef(null);
  const originalAbstract = article.abstract || '';
  const abstract = parseAbstract(originalAbstract);
  const interactionRequestBody = { query_id: queryId, result_id: article.id, position };
  console.log(article.abstract)
  return (
    <SearchResultWrapper>
      <AclBaseArticleResult
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
            <ResultText collapsed={false} marginBottom={4}>
              <SectionTitle>Abstract</SectionTitle>
            </ResultText>
            <Paragraph marginBottom={16} collapsed={false}>
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
        {/* Display paragraphs */}
      </div>
    </SearchResultWrapper>
  );
};

export default AclSearchResult;

const SearchResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  padding: 24px 0;
  border-bottom: 1px dotted ${({ theme }) => theme.lightGrey};
  margin-bottom: 8px;
`;

const fadeInAnimation = css`animation ${FadeInText} 0.5s ease-in-out;`;

const ResultText = styled.div<{
  marginTop?: number;
  marginBottom?: number;
  collapsed: boolean;
}>`
  ${BodySmall}
  color: ${({ theme }) => theme.darkGrey};
  margin-top: ${({ marginTop, collapsed }) => (marginTop && !collapsed ? marginTop : 0)}px;
  margin-bottom: ${({ marginBottom, collapsed }) =>
    marginBottom && !collapsed ? marginBottom : 0}px;
  display: ${({ collapsed }) => (collapsed ? 'inline' : 'block')};

  & > .showCollapsed {
    opacity: ${({ collapsed }) => (collapsed ? 1 : 0)};
    display: ${({ collapsed }) => (collapsed ? 'inline' : 'none')};
    ${({ collapsed }) => (collapsed ? fadeInAnimation : '')}
  }

  & > .hideCollapsed {
    opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
    display: ${({ collapsed }) => (collapsed ? 'none' : 'inline')};
    ${({ collapsed }) => (collapsed ? '' : fadeInAnimation)}
  }

  & > .highlight {
    background: ${({ theme, collapsed }) => (collapsed ? 'none' : theme.paleYellow)};
  }
`;

const Paragraph = styled(ResultText)`
  ${({ theme, collapsed }) =>
    collapsed
      ? ''
      : `
    padding-left: 8px;
    border-left: 1px solid ${theme.lightGrey};
  `}
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
