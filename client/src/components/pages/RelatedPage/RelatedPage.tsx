import React from 'react';
import { useRouteMatch } from 'react-router';

const RelatedPage = () => {
  const { params } = useRouteMatch<any>();

  return <div>{params.articleId}</div>;
};

export default RelatedPage;
