import React, { useState, ReactNode, useRef } from 'react';
import styled from 'styled-components';
import {Collapse} from 'react-collapse';
import { ChevronsDown } from 'react-feather';

import { Link, Heading3, LinkStyle, BodySmall } from '../shared/Styles';

interface Article extends Object {
  id: string
  title: string
  doi: string
  source: string
  url: string
  score: number
  authors: Array<string>
  abstract: string
  journal: string
  year: number
  publish_time: string
  paragraphs: Array<string>
  highlights: Array<Array<[number, number]>>
  highlighted_abstract: boolean
}

interface SearchResultProps {
  article: Article,
  number: number
}

const highlightText = (text: string, highlights: Array<[number, number]>): Array<string|ReactNode> => {
  if (!highlights) {
    return [text];
  }

  let highlighted: Array<string|ReactNode> = [];
  let prevEnd = -1;

  highlights.forEach((highlight, i) => {
    const [start, end] = highlight;
    highlighted.push(<TextSpan key={`${i}-1`}>{text.substr(prevEnd + 1, start - prevEnd - 1)}</TextSpan>);
    highlighted.push(<Highlight className="highlight" key={`${i}-2`}>{text.substr(start, end - start + 1)}</Highlight>);
    prevEnd = end;
  });

  return highlighted;
}

const SearchResult = ({ article, number }: SearchResultProps) => {
  const fullTextRef = useRef(null);
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
      <Collapse isOpened={!collapsed} initialStyle={{height: 32, overflow: 'hidden'}}>
        <FullText onClick={() => setCollapsed(!collapsed)} ref={fullTextRef}>
          {article.highlighted_abstract === false && article.abstract && (
            <Paragraph marginBottom={16}>
              {article.abstract}
            </Paragraph>
          )}
          {article.paragraphs.map((paragraph, i) => (
            <Paragraph marginTop={i === 0 ? 0 : 16} key={i}>
              {highlightText(paragraph, article.highlights[i])}
            </Paragraph>
          ))}
        </FullText>
      </Collapse>
      {(article.abstract || article.paragraphs.length > 0) && (
        <ShowTextLink collapsed={collapsed} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? 'Show relevant text' : 'Show less'}
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

const FullText = styled.div``;

const Paragraph = styled.div<{marginTop?: number, marginBottom?: number}>`
  ${BodySmall}
  color: ${({ theme }) => theme.darkGrey};
  margin-top: ${({ marginTop }) => marginTop ? marginTop : 0}px;
  margin-bottom: ${({ marginBottom }) => marginBottom ? marginBottom : 0}px;
  cursor: pointer;
`;

const ShowTextLink = styled.button<{collapsed?: Boolean}>`
  ${BodySmall}
  ${LinkStyle}
  max-width: fit-content;
  margin-top: 8px;
  display: flex;
  align-items: center;
  background: none;
  padding: 0;
  border: none;
`;

const Chevron = styled(ChevronsDown)<{collapsed?: Boolean}>`
  height: 14px;
  width: 14px;
  transform: rotate(${({ collapsed }) => collapsed ? 0 : 180}deg);
  transition: 550ms transform;
`;

const TextSpan = styled.span`
`;

const Highlight = styled(TextSpan)`
  position: relative;
  font-weight: 600;
`;
