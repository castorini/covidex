import React, { useState, ReactNode, useRef } from 'react';
import styled, { css } from 'styled-components';
import { ChevronsDown } from 'react-feather';
import Highlighter from 'react-highlight-words';

import { Link, Heading3, LinkStyle, BodySmall, FadeInText } from '../shared/Styles';

interface Article extends Object {
  id: string;
  title: string;
  doi: string;
  source: string;
  url: string;
  score: number;
  authors: Array<string>;
  abstract: string;
  journal: string;
  year: number;
  publish_time: string;
  paragraphs: Array<string>;
  highlights: Array<Array<[number, number]>>;
  highlighted_abstract: boolean;
}
interface SearchResultProps {
  article: Article;
  number: number;
  queryTokens: Array<string>;
}

const highlightText = (
  text: string,
  highlights: Array<[number, number]>,
  queryTokens: Array<string>,
): Array<string | ReactNode> => {
  if (!highlights) {
    return [text];
  }

  let highlighted: Array<string | ReactNode> = [];
  let prevEnd = -1;

  highlights.forEach((highlight, i) => {
    const [start, end] = highlight;
    highlighted.push(
      <Ellipsis key={`${i}-ellipsis-1`} className="ellipsis">
        ...
      </Ellipsis>,
    );
    highlighted.push(
      <TextSpan key={`${i}-1`} className="text">
        {highlightMatches(queryTokens, text.substr(prevEnd + 1, start - prevEnd - 1))}
      </TextSpan>,
    );
    highlighted.push(
      <Highlight className="highlight" key={`${i}-2`}>
        {highlightMatches(queryTokens, text.substr(start, end - start + 1))}
      </Highlight>,
    );

    prevEnd = end;
  });

  // add last part of text
  if (prevEnd < text.length) {
    highlighted.push(
      <TextSpan key="last" className="text">
        {highlightMatches(queryTokens, text.substr(prevEnd + 1, text.length - prevEnd - 1))}
      </TextSpan>,
    );
  }

  return highlighted;
};

const highlightMatches = (queryTokens: Array<string>, text: string): ReactNode => {
  return <Highlighter searchWords={queryTokens} textToHighlight={text} highlightTag={Match} />;
};

const SearchResult = ({ article, number, queryTokens }: SearchResultProps) => {
  const fullTextRef = useRef(null);
  const [collapsed, setCollapsed] = useState<boolean>(true);

  let authorString = '';
  if (article.authors.length > 0) {
    article.authors.forEach((author, idx) => {
      if (author !== '') {
        authorString += idx === article.authors.length - 1 ? `${author}.` : `${author}, `;
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
      <FullText ref={fullTextRef}>
        {article.highlighted_abstract === false && article.abstract && (
          <Paragraph marginBottom={16} collapsed={collapsed}>
            {highlightText(article.abstract, [], queryTokens)}
          </Paragraph>
        )}
        {article.paragraphs.map((paragraph, i) => (
          <Paragraph marginTop={i === 0 ? 0 : 16} key={i} collapsed={collapsed}>
            {highlightText(paragraph, article.highlights[i], queryTokens)}
            {i === article.paragraphs.length - 1 && <Ellipsis className="ellipsis">...</Ellipsis>}
          </Paragraph>
        ))}
      </FullText>
      {(article.abstract || article.paragraphs.length > 0) && (
        <ShowTextLink
          collapsed={collapsed}
          onClick={() => setCollapsed(!collapsed)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {collapsed ? 'Show full text' : 'Show less'}
          <Chevron collapsed={collapsed} />
        </ShowTextLink>
      )}
    </SearchResultWrapper>
  );
};

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

const fadeInAnimation = css`animation ${FadeInText} 0.5s ease-in-out;`;

const Paragraph = styled.div<{
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

  & > .ellipsis {
    opacity: ${({ collapsed }) => (collapsed ? 1 : 0)};
    display: ${({ collapsed }) => (collapsed ? 'inline' : 'none')};
    ${({ collapsed }) => (collapsed ? fadeInAnimation : '')}
  }

  & > .text {
    opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
    display: ${({ collapsed }) => (collapsed ? 'none' : 'inline')};
    ${({ collapsed }) => (collapsed ? '' : fadeInAnimation)}
  }

  & > .highlight {
    background: ${({ theme, collapsed }) => (collapsed ? 'none' : theme.paleYellow)};
  }
`;

const ShowTextLink = styled.button<{ collapsed: boolean }>`
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

const Chevron = styled(ChevronsDown)<{ collapsed: boolean }>`
  height: 14px;
  width: 14px;
  transform: rotate(${({ collapsed }) => (collapsed ? 0 : 180)}deg);
  transition: 550ms transform;
`;

const TextSpan = styled.span`
  line-height: 1.4;
  transition: all 0.3s;
`;

const Ellipsis = styled(TextSpan)`
  letter-spacing: 1px;
  margin: 0 2px;
`;

const Highlight = styled(TextSpan)`
  position: relative;
  font-weight: 400;
`;

const Match = styled(TextSpan)`
  position: relative;
  font-weight: 600;
`;
