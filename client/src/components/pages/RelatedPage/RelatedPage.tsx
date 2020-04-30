import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router';
import styled from 'styled-components';
import ErrorBoundary from 'react-error-boundary';

import { Heading2, PageContent, PageWrapper, Link } from '../../../shared/Styles';
import { RelatedArticle } from '../../../shared/Models';
import { API_BASE, RELATED_ENDPOINT } from '../../../shared/Constants';
import Loading from '../../common/Loading';
import RelatedResult from './RelatedResult';

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
          <RelatedContent>
            {loading && <Loading />}
            {notFound && <NotFoundComponent />}
            {originalArticle && relatedArticles && (
              <>
                <Title>
                  Articles related to:{' '}
                  <Link
                    tabIndex={0}
                    href={originalArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {originalArticle.title}
                  </Link>
                </Title>
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

const NotFound = styled.div`
  ${Heading2}
  display: flex;
  margin-top: 16px;
  padding-bottom: 24px;
  color: ${({ theme }) => theme.darkGrey};
`;

const Title = styled.div`
  ${Heading2}
  margin-top: 16px;
  border-bottom: 1px dotted ${({ theme }) => theme.lightGrey};
  padding-bottom: 32px;
`;
