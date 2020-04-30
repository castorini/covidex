import React from 'react';
import styled from 'styled-components';

import { BaseArticle } from '../../shared/Models';
import { Heading3, Link } from '../../shared/Styles';

interface BaseArticleResultProps {
  article: BaseArticle;
  position: number;
  onClickTitle?: () => void;
}

const BaseArticleResult: React.FC<BaseArticleResultProps> = ({
  article,
  position,
  onClickTitle,
}) => {
  let authorString = '';
  if (article.authors.length > 0) {
    article.authors.forEach((author, idx) => {
      if (author !== '') {
        authorString += idx === article.authors.length - 1 ? `${author}.` : `${author}, `;
      }
    });
  }

  // Indicate if medRxiv or bioRxiv is the source
  const source = ['medrxiv', 'biorxiv'].includes(article.source.toLowerCase())
    ? article.source.replace('r', 'R')
    : '';

  return (
    <>
      <Title>
        {position + 1}.&nbsp;
        {article.url !== null && article.url !== '' ? (
          <Link href={article.url} target="_blank" rel="noopener noreferrer" onClick={onClickTitle}>
            {article.title}
          </Link>
        ) : (
          article.title
        )}
      </Title>
      <Subtitle>
        {authorString && <Authors>{authorString}</Authors>}
        {article.journal && <Journal>{article.journal}</Journal>}
        {source && <Journal>{source}</Journal>}
        {article.publish_time && <PublishTime>({article.publish_time})</PublishTime>}
      </Subtitle>
    </>
  );
};

export default BaseArticleResult;

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
