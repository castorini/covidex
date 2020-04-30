import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router';
import styled from 'styled-components';
import ErrorBoundary from 'react-error-boundary';

import {
  Heading2,
  Heading3,
  PageContent,
  PageWrapper,
  Link,
  Body,
  BodySmall,
  LinkStyle,
} from '../../../shared/Styles';
import { RelatedArticle } from '../../../shared/Models';
import { API_BASE, RELATED_ENDPOINT, HOME_ROUTE } from '../../../shared/Constants';
import Loading from '../../common/Loading';
import RelatedResult from './RelatedResult';
import { FileText, Search } from 'react-feather';
import BaseArticleResult from '../../common/BaseArticleResult';
import { parseAbstract } from '../../../shared/Util';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundComponent = () => <NotFound>Article not found</NotFound>;

const RelatedPage = () => {
  const {
    params: { articleId },
  } = useRouteMatch<any>();

  const [loading, setLoading] = useState<Boolean>(false);
  const [notFound, setNotFound] = useState<Boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [queryId, setQueryId] = useState<string>('');

  const [originalArticle, setOriginalArticle] = useState<RelatedArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (articleId === undefined || articleId === null || articleId === '') {
        setLoading(false);
        setNotFound(true);
        return;
      }

      try {
        setLoading(true);
        setRelatedArticles(null);

        let response = await fetch(
          `${API_BASE}${RELATED_ENDPOINT}/${articleId.toLowerCase()}?page_number=${page}`,
        );
        setLoading(false);

        let data = await response.json();
        const { query_id, response: responseArticles } = data;
        const originalArticle = responseArticles
          ? responseArticles.find((a: RelatedArticle) => a.id === articleId)
          : null;

        setQueryId(query_id);
        setOriginalArticle(originalArticle);
        setRelatedArticles(responseArticles.filter((a: RelatedArticle) => a.id !== articleId));
      } catch {
        setLoading(false);
        setNotFound(true);
      }
    };

    fetchData();
  }, [articleId, page]);

  return (
    <PageWrapper>
      <PageContent>
        <ErrorBoundary FallbackComponent={NotFoundComponent}>
          <Row>
            <RelatedTitle>
              Related Articles <FileText size={28} style={{ marginLeft: '8px' }} />
            </RelatedTitle>
            <SearchLink to={HOME_ROUTE}>
              Search All Articles
              <Search size={16} style={{ marginLeft: '4px' }} />
            </SearchLink>
          </Row>
          <RelatedContent>
            {loading && <Loading />}
            {notFound && <NotFoundComponent />}
            {originalArticle && relatedArticles && (
              <>
                <OriginalArticle>
                  <SmallTitle>Showing articles related to:</SmallTitle>
                  <BaseArticleResult article={originalArticle} boldTitle />
                  {originalArticle.abstract && (
                    <>
                      <AbstractTitle className="hideCollapsed">Abstract</AbstractTitle>
                      <Paragraph>{parseAbstract(originalArticle.abstract)}</Paragraph>
                    </>
                  )}
                </OriginalArticle>
                {relatedArticles.map((article, idx) => (
                  <RelatedResult key={article.id} article={article} position={idx} />
                ))}
                {relatedArticles.length === 0 && <NotFound>No related articles found</NotFound>}
              </>
            )}
          </RelatedContent>
        </ErrorBoundary>
      </PageContent>
    </PageWrapper>
  );
};

export default RelatedPage;

const RelatedContent = styled.div`
  width: 100%;
  margin-right: auto;
  display: flex;
  flex-direction: column;
`;

const RelatedTitle = styled.div`
  ${Heading2}
  font-weight: 700;
  font-size: 28px;
  display: flex;
  align-items: center;
`;

const NotFound = styled.div`
  ${Heading3}
  display: flex;
  margin-top: 32px;
  padding-bottom: 24px;
  color: ${({ theme }) => theme.darkGrey};
`;

const SmallTitle = styled.div`
  ${Body}
  padding-bottom: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.darkGrey};
`;

const Paragraph = styled.div`
  ${BodySmall}
  margin-bottom: 8px;
`;

const AbstractTitle = styled.div`
  ${BodySmall}
  font-weight: 700;
`;

const OriginalArticle = styled.div`
  margin: 32px 0 24px 0;
  border: 1px solid ${({ theme }) => theme.yellow};
  border-bottom: 1px solid ${({ theme }) => theme.yellow};
  padding: 12px 12px 4px 12px;
  border-radius: 4px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
`;

const SearchLink = styled(RouterLink)`
  ${LinkStyle}
  display: flex;
  align-items: center;
`;
