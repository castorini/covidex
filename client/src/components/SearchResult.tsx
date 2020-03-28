import React, { useState } from 'react';
import styled from 'styled-components';
import {Collapse} from 'react-collapse';

import { Link, Heading3, LinkStyle, BodySmall } from '../shared/Styles';
import { ChevronsDown } from 'react-feather';

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
  paragraphs: Array<String>
  highlighted: Array<Array<[Number, Number]>>
}

interface SearchResultProps {
  article: Article,
  number: Number
}

const SearchResult = ({ article, number }: SearchResultProps) => {
  const [collapsed, setCollapsed] = useState<Boolean>(true);

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
      <Title>
        {number}.&nbsp;
        <Link href={article.url} target="_blank" rel="noopener noreferrer">
          {article.title}
        </Link>
      </Title>
      <Subtitle>
        {authorString && <Authors>{authorString}</Authors>}
        {article.journal && <Journal>{article.journal}</Journal>}
        {article.publish_time && <PublishTime>({article.publish_time})</PublishTime>}
      </Subtitle>
      <Collapse isOpened={!collapsed} initialStyle={{height: 24, overflow: 'hidden'}}>
        <Paragraph>
          {article.abstract}
        </Paragraph>
        {article.paragraphs.map(paragraph => <Paragraph>{paragraph}</Paragraph>)}
      </Collapse>
      {(article.abstract || article.paragraphs.length > 0 ) && (
        <ShowTextLink collapsed={collapsed} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? 'Show highlighted paragraphs' : 'Show less'}
          <Chevron collapsed={collapsed} />
        </ShowTextLink>
      )}
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
  border-bottom: 1px dotted ${({ theme }) => theme.lightGrey};
  margin-bottom: 8px;
`;

const Title = styled.div`
  ${Heading3}
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

const Paragraph = styled.div`
  ${BodySmall}
  color: ${({ theme }) => theme.darkGrey};
`;

const ShowTextLink = styled.div<{collapsed?: Boolean}>`
  ${BodySmall}
  ${LinkStyle}
  max-width: fit-content;
  margin-top: 8px;
  display: flex;
  align-items: center;
`;

const Chevron = styled(ChevronsDown)<{collapsed?: Boolean}>`
  height: 14px;
  width: 14px;
  transform: rotate(${({ collapsed }) => collapsed ? 0 : 180}deg);
  transition: 550ms transform;
`;