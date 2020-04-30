import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Link as LinkIcon } from 'react-feather';

import { RelatedArticle } from '../../../shared/Models';
import BaseArticleResult from '../../common/BaseArticleResult';
import { BodySmall, LinkStyle } from '../../../shared/Styles';
import { parseAbstract } from '../../../shared/Util';
import { RELATED_ROUTE } from '../../../shared/Constants';

interface RelatedResultProps {
  article: RelatedArticle;
  position: number;
}

const RelatedResult: React.FC<RelatedResultProps> = ({ article, position }) => {
  return (
    <RelatedResultWrapper>
      <BaseArticleResult article={article} position={position} />
      {/* Display abstract */}
      {article.abstract && (
        <>
          <AbstractTitle className="hideCollapsed">Abstract</AbstractTitle>
          <Paragraph>{parseAbstract(article.abstract)}</Paragraph>
        </>
      )}
      <RelatedLink to={`${RELATED_ROUTE}/${article.id}`}>
        Related articles <LinkIcon size={12} style={{ marginLeft: '4px' }} />
      </RelatedLink>
    </RelatedResultWrapper>
  );
};

export default RelatedResult;

const RelatedResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  padding: 24px 0;
  border-bottom: 1px dotted ${({ theme }) => theme.lightGrey};
  margin-bottom: 8px;
`;

const Paragraph = styled.div`
  ${BodySmall}
`;

const AbstractTitle = styled.div`
  ${BodySmall}
  font-weight: 700;
`;

const RelatedLink = styled(Link)`
  ${BodySmall}
  ${LinkStyle}
  margin-top: 8px;
  margin-right: 16px;
  display: flex;
  align-items: center;
`;
