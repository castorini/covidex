import React from 'react';
import styled from 'styled-components';
import { Body, Link } from '../shared/Styles';

const HomeText = () => {
  return (
    <div>
      <Paragraph>
        Covidex represents an effort to build natural language processing
        and information retrieval components for exploring the&nbsp;
        <Link href="https://pages.semanticscholar.org/coronavirus-research" target="_blank" rel="noopener noreferrer">
          COVID-19 Open Research Dataset (CORD-19)
        </Link>
        &nbsp;provided by the&nbsp;
        <Link href="https://allenai.org/" target="_blank" rel="noopener noreferrer">
          Allen Institute for AI
        </Link>.
      </Paragraph>
      <Paragraph>
        We hope that these tools can help researchers generate
        new insights in support of the fight against the disease.
      </Paragraph>
      <Paragraph>Presently, our efforts include:</Paragraph>
      <ul>
        <ListItem>
          The above search interface, which integrates neural ranking components in a multi-stage
          search reranking pipeline using the&nbsp;
          <Link href="https://github.com/google-research/text-to-text-transfer-transformer" target="_blank" rel="noopener noreferrer">
            T5
          </Link> model on top of an Anserini index.
        </ListItem>
        <ListItem>
          Our basic keyword search interface at&nbsp;
          <Link href="https://covidex.io/" target="_blank" rel="noopener noreferrer">
            covidex.io
          </Link>,
          which provides faceted browsing capabilities on the CORD-19 dataset (title and abstracts only).
          Under the covers, the interface is powered by&nbsp;
          <Link href="https://projectblacklight.org/" target="_blank" rel="noopener noreferrer">
            Blacklight
          </Link>,&nbsp;
          <Link href="https://lucene.apache.org/solr/" target="_blank" rel="noopener noreferrer">
            Solr
          </Link>, and the&nbsp;
          <Link href="http://anserini.io/" target="_blank" rel="noopener noreferrer">
            Anserini
          </Link>
          &nbsp;IR toolkit and (Solrini, which is Anserini's Solr adaptor).
        </ListItem>
        <ListItem>Backend components (code as well as pre-built indexes) for
          directly searching and manipulating the collection via&nbsp;
          <Link href="http://pyserini.io/" target="_blank" rel="noopener noreferrer">
            Pyserini
          </Link>
          &nbsp;(Python bindings for Anserini), along with sample integration of search with&nbsp;
          <Link href="https://huggingface.co/transformers/" target="_blank" rel="noopener noreferrer">
            HuggingFace's neural models
          </Link>.
          &nbsp;Example Python notebooks and other resources for getting started can be found&nbsp;
          <Link href="https://github.com/castorini/anserini/blob/master/docs/experiments-covid.md" target="_blank" rel="noopener noreferrer">
            here
          </Link>.
        </ListItem>
      </ul>
      <Paragraph>
        This project is led by&nbsp;
        <Link href="https://cs.uwaterloo.ca/~jimmylin/">Jimmy Lin</Link>
        &nbsp;from the University of Waterloo and&nbsp;
        <Link href="http://www.kyunghyuncho.me/">Kyunghyun Cho</Link>
        &nbsp;from NYU, with a small team of wonderful students:&nbsp;
        <Link href="https://github.com/edwinzhng">Edwin Zhang</Link>
        &nbsp;and&nbsp;
        <Link href="https://github.com/nikhilro">Nikhil Gupta</Link>.
      </Paragraph>
    </div>
  );
}

export default HomeText;

const Paragraph = styled.p`
  ${Body}
`;

const ListItem = styled.li`
  ${Body}
  margin-bottom: 8px;
`;