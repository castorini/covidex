import React from 'react';
import styled from 'styled-components';
import { Body, Link } from '../../../shared/Styles';

const HomeText = () => {
  return (
    <HomeTextWrapper>
      <Paragraph>
        <Bold>Neural Covidex</Bold> applies state-of-the-art neural network models and artificial
        intelligence (AI) techniques to answer questions using the{' '}
        <Link
          href="https://pages.semanticscholar.org/coronavirus-research"
          target="_blank"
          rel="noopener noreferrer"
        >
          COVID-19 Open Research Dataset (CORD-19)
        </Link>{' '}
        provided by the{' '}
        <Link href="https://allenai.org/" target="_blank" rel="noopener noreferrer">
          Allen Institute for AI
        </Link>{' '}
        (data release of April 24, 2020), which currently contains over 47,000 scholarly articles,
        including over 36,000 with full text, about COVID-19 and coronavirus-related research, drawn
        from a variety of sources including PubMed, a curated list of articles from the WHO, as well
        as preprints from bioRxiv and medRxiv. In addition, we also support search on 100+
        randomized controlled trials (published and ongoing) related to COVID-19 provided by{' '}
        <Link
          href="https://trialstreamer.robotreviewer.net/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Trialstreamer
        </Link>
        .
      </Paragraph>
      <Paragraph>
        We hope that our service can contribute to the fight against this global pandemic by helping
        policy makers and clinicians make better-informed decisions and by helping researchers
        generate new insights.
      </Paragraph>
      <Paragraph>
        To properly calibrate expectations, our system relies on inference using
        computationally-expensive neural models at search time, and thus the interface is not as
        responsive as we'd like. We're working hard on making the system more robust and faster, so
        please be patient! In terms of answer quality, the results are better than keyword search
        overall (at least in our opinion), but as is often the case with neural networks, sometimes
        the output can leave users scratching their heads. We're also working hard on improving the
        answers!
      </Paragraph>
      <Paragraph>
        For more details about how the Neural Covidex works, please refer to this{' '}
        <Link href="https://arxiv.org/abs/2004.05125" target="_blank" rel="noopener noreferrer">
          system description
        </Link>{' '}
        and our{' '}
        <Link href="https://arxiv.org/abs/2004.11339" target="_blank" rel="noopener noreferrer">
          initial question answering experiments
        </Link>
        .
      </Paragraph>
      <Paragraph>Beyond the search application above, our efforts include the following:</Paragraph>
      <List>
        <ListItem>
          A{' '}
          <Link href="https://basic.covidex.ai" target="_blank" rel="noopener noreferrer">
            baseline keyword search interface
          </Link>{' '}
          that provides keyword search and faceted browsing capabilities. Under the covers, the
          interface is powered by{' '}
          <Link href="https://projectblacklight.org" target="_blank" rel="noopener noreferrer">
            Blacklight
          </Link>
          ,{' '}
          <Link href="https://lucene.apache.org/solr" target="_blank" rel="noopener noreferrer">
            Solr
          </Link>
          , and the{' '}
          <Link href="http://anserini.io/" target="_blank" rel="noopener noreferrer">
            Anserini
          </Link>{' '}
          IR toolkit (via Solrini, which is Anserini's Solr adaptor).
        </ListItem>
        <ListItem>
          Backend components (code as well as pre-built indexes) for directly searching and
          manipulating the collection via{' '}
          <Link href="http://pyserini.io/" target="_blank" rel="noopener noreferrer">
            Pyserini
          </Link>{' '}
          (Python bindings for Anserini), along with sample integration of search with{' '}
          <Link
            href="https://huggingface.co/transformers"
            target="_blank"
            rel="noopener noreferrer"
          >
            HuggingFace's neural models
          </Link>
          . Example Python notebooks and other resources for getting started can be found{' '}
          <Link
            href="https://github.com/castorini/anserini/blob/master/docs/experiments-covid.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </Link>
          .
        </ListItem>
        <ListItem>
          The entire software stack behind the Neural Covidex is available open-source on{' '}
          <Link
            href="https://github.com/castorini/covidex"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </Link>{' '}
          which means that in addition to using our search application on the web above, individual
          components such as the searcher, neural reranker, and passage highlighter can be reused
          elsewhere as well. We'd love other researchers to build on these components!
        </ListItem>
      </List>
      <Paragraph>
        This project is led by{' '}
        <Link href="https://cs.uwaterloo.ca/~jimmylin/" target="_blank" rel="noopener noreferrer">
          Jimmy Lin
        </Link>{' '}
        from the University of Waterloo and{' '}
        <Link href="http://www.kyunghyuncho.me/" target="_blank" rel="noopener noreferrer">
          Kyunghyun Cho
        </Link>{' '}
        from NYU, with a small team of wonderful students:{' '}
        <Link href="https://github.com/edwinzhng" target="_blank" rel="noopener noreferrer">
          Edwin Zhang
        </Link>
        ,{' '}
        <Link href="https://github.com/x65han" target="_blank" rel="noopener noreferrer">
          Johnson Han
        </Link>
        ,{' '}
        <Link href="https://github.com/nikhilro" target="_blank" rel="noopener noreferrer">
          Nikhil Gupta
        </Link>{' '}
        and{' '}
        <Link href="http://ralphtang.com" target="_blank" rel="noopener noreferrer">
          Ralph Tang
        </Link>
        . Special thanks to{' '}
        <Link href="https://colinraffel.com/" target="_blank" rel="noopener noreferrer">
          Colin Raffel
        </Link>{' '}
        for his help in pretraining T5 models for the biomedical domain and to{' '}
        <Link href="https://www.cifar.ca/" target="_blank" rel="noopener noreferrer">
          CIFAR
        </Link>{' '}
        for their AI and COVID-19 Catalyst Grants.
      </Paragraph>
    </HomeTextWrapper>
  );
};

export default HomeText;

const HomeTextWrapper = styled.div`
  margin-top: 16px;
`;

const List = styled.ul`
  ${Body}
`;

const ListItem = styled.li`
  ${Body}
`;

const Paragraph = styled.div`
  ${Body}
  margin-bottom: 24px;
`;

const Bold = styled.span`
  ${Body}
  font-weight: 600;
`;
