import React from 'react';
import styled from 'styled-components';
import { Body, Link } from '../shared/Styles';

const HomeText = () => {
  return (
    <div>
      <Paragraph>
        <Bold>Covidex</Bold> represents an effort to build natural language processing and
        information retrieval components for exploring the&nbsp;
        <Link href="https://pages.semanticscholar.org/coronavirus-research">
          COVID-19 Open Research Dataset (CORD-19)
        </Link>
        &nbsp;provided by the <Link href="https://allenai.org/">Allen Institute for AI</Link>. We
        hope that these tools can help researchers generate new insights in support of the fight
        against the disease.
      </Paragraph>
      <Paragraph>
        The <Bold>Neural Covidex</Bold> applies state-of-the-art neural network models to improve
        the output of our&nbsp;
        <Link href="http://covidex.io/" target="_blank" rel="noopener noreferrer">
          basic search interface
        </Link>
        &nbsp;that relies on keyword matching. The entire software stack is available open-source
        on&nbsp;
        <Link href="https://github.com/castorini/covidex" target="_blank" rel="noopener noreferrer">
          Github
        </Link>
        , which means that in addition to using this search application on the web, individual
        components such as the searcher, neural reranker, and passage highlighter can be reused
        elsewhere as well. We'd love other researchers to build on these components!
      </Paragraph>
      <Paragraph>
        To properly calibrate expectations, our system relies on inference using
        computational-expensive neural models at search time, and thus the interface is not as
        responsive as we'd like. We're working hard on making the system more robust and faster, so
        please be patient! In terms of search quality, results are much better than keyword-only
        search overall (at least in our opinion), but as is often the case with neural networks,
        sometimes the output can leave users scratching their heads.
      </Paragraph>
      <Paragraph>
        This project is led by&nbsp;
        <Link href="https://cs.uwaterloo.ca/~jimmylin/" target="_blank" rel="noopener noreferrer">
          Jimmy Lin
        </Link>
        &nbsp;from the University of Waterloo and&nbsp;
        <Link href="http://www.kyunghyuncho.me/" target="_blank" rel="noopener noreferrer">
          Kyunghyun Cho
        </Link>
        &nbsp;from NYU, with a small team of wonderful students:&nbsp;
        <Link href="https://github.com/edwinzhng" target="_blank" rel="noopener noreferrer">
          Edwin Zhang
        </Link>
        &nbsp;and&nbsp;
        <Link href="https://github.com/nikhilro" target="_blank" rel="noopener noreferrer">
          Nikhil Gupta
        </Link>
        .
      </Paragraph>
    </div>
  );
};

export default HomeText;

const Paragraph = styled.p`
  ${Body}
`;

const Bold = styled.span`
  ${Body}
  font-weight: 600;
`;
