import React from 'react';
import styled from 'styled-components';

import { Link, Heading2 } from '../shared/Styles';

interface Article extends Object {
  id: string
  title: string
  doi: string
  source: string
  url: string
  score: Number
  authors: Array<String>
  abstract: string
  journal: string
  year: Number
  publish_time: string
}

interface SearchResultProps {
  article: Article
}

const SearchResult = ({ article }: SearchResultProps) => {
  let authorString = '';
  if (article.authors.length > 0) {
    article.authors.forEach((author, idx) => {
      if (author !== '') {
        authorString += idx === article.authors.length - 1 ? `${author}.` : `${author}, `
      }
    });
  }

  return (
    <SearchResultWrapper>
      <Title href={article.url} target="_blank" rel="noopener noreferrer">
        {article.title}
      </Title>
      <Subtitle>
        {authorString && (<Authors>
          {authorString}
        </Authors>)}
        {article.journal && (<Journal>
          {article.journal}
        </Journal>)}
        {article.publish_time && (<PublishTime>
          ({article.publish_time})
        </PublishTime>)}
      </Subtitle>
      <Abstract>
          {article.abstract}
      </Abstract>
    </SearchResultWrapper>
  );
}

export default SearchResult;

const SearchResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
  padding: 24px;
  border-bottom: 2px solid ${({ theme }) => theme.lightGrey};
  margin-bottom: 8px;
`;

const Title = styled(Link)`
  ${Heading2}
  margin-bottom: 16px;
`;

const Subtitle = styled.div`
  font-size: 16px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.black};
`;

const Authors = styled.span`
  margin-right: 4px;
`;

const Journal = styled.span`
  font-style: italic;
  margin-right: 4px;
`;

const PublishTime = styled.span``;

const Abstract = styled.div`
  color: ${({ theme }) => theme.secondary};
`;

