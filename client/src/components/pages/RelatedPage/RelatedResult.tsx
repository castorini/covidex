import React from 'react';
import styled from 'styled-components';

import { RelatedArticle } from '../../../shared/Models';
import BaseArticleResult from '../../common/BaseArticleResult';
import { BodySmall } from '../../../shared/Styles';

interface RelatedResultProps {
  article: RelatedArticle;
  position: number;
}

const RelatedResult: React.FC<RelatedResultProps> = ({ article, position }) => {
  console.log(article);
  return (
    <RelatedResultWrapper>
      <BaseArticleResult article={article} position={position} />
      {/* Display abstract */}
      {article.abstract && (
        <>
          <AbstractTitle className="hideCollapsed">Abstract</AbstractTitle>
          <Paragraph>
            {article.abstract}
          </Paragraph>
        </>
      )}
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