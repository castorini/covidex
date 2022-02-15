import React from 'react';
import styled from 'styled-components';
import { Link, Paragraph, Bold } from '../../../shared/Styles';

const HomeText = () => {
  return (
    <HomeTextWrapper>
      <Paragraph>
        <Bold>Covidex</Bold> applies state-of-the-art neural network models and artificial
        intelligence (AI) techniques to answer questions using the {' '}
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
        </Link>
        , which is curated dataset of scientific articles about COVID-19 and coronavirus-related
        research drawn from a variety of sources including PubMed, a curated list of articles from
        the WHO, as well as preprints from bioRxiv and medRxiv. We hope that our technologies can
        contribute to the fight against this global pandemic by helping policy makers and clinicians
        make better-informed decisions and by helping researchers generate new insights.
      </Paragraph>
      <Paragraph>
        Our system has been evaluated in the{' '}
        <Link href="https://ir.nist.gov/covidSubmit/" target="_blank" rel="noopener noreferrer">
          TREC-COVID
        </Link>{' '}
        challenge organized by the National Institute of Standards and Technology (NIST).
        Submissions based on Covidex components were the highest-scoring "automatic" runs in rounds
        4 and 5 of the evaluation. We provide here as a working prototype a simplified version of
        complete architecture described in the following paper:
      </Paragraph>
      <blockquote>
        Edwin Zhang, Nikhil Gupta, Raphael Tang, Xiao Han, Ronak Pradeep, Kuang Lu, Yue Zhang,
        Rodrigo Nogueira, Kyunghyun Cho, Hui Fang, and Jimmy Lin.{' '}
        <Link
          href="https://www.aclweb.org/anthology/2020.sdp-1.5/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Covidex: Neural Ranking Models and Keyword Search Infrastructure for the COVID-19 Open
          Research Dataset.
        </Link>{' '}
        <i>Proceedings of the 1st Workshop on Scholarly Document Processing</i>, pages 31-41,
        November 2020.
      </blockquote>
      <Paragraph>
        Since the conclusion of the TREC-COVID challenge in August 2020, our team has not had
        sufficient resources to fully keep pace with releases of the CORD-19 dataset. The prototype
        here still uses the CORD-19 version used in round 5 of the TREC-COVID challenge, dating from
        July 16, 2020 (and we have no intention of updating it). As a result, the system returns
        results that are outdated and thus should <b>not</b> be used for making medical, public
        health, and other decisions.
      </Paragraph>
      <Paragraph>
        This project is led by{' '}
        <Link href="https://cs.uwaterloo.ca/~jimmylin/" target="_blank" rel="noopener noreferrer">
          Jimmy Lin
        </Link>{' '}
        from the University of Waterloo and{' '}
        <Link href="http://www.kyunghyuncho.me/" target="_blank" rel="noopener noreferrer">
          Kyunghyun Cho
        </Link>{' '}
        from NYU, with a small team of wonderful collaborators and students:{' '}
        <Link href="https://edwinzhang.me" target="_blank" rel="noopener noreferrer">
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
        ,{' '}
        <Link href="http://ralphtang.com" target="_blank" rel="noopener noreferrer">
          Ralph Tang
        </Link>
        ,{' '}
        <Link
          href="https://scholar.google.com/citations?user=xD32wZ8AAAAJ&hl=en"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rodrigo Nogueira
        </Link>
        , and{' '}
        <Link href="https://github.com/ronakice" target="_blank" rel="noopener noreferrer">
          Ronak Pradeep
        </Link>
        . Special thanks to{' '}
        <Link href="https://colinraffel.com/" target="_blank" rel="noopener noreferrer">
          Colin Raffel
        </Link>{' '}
        for his help in pretraining T5 models for the biomedical domain. We are grateful for support
        from{' '}
        <Link href="https://www.cifar.ca/" target="_blank" rel="noopener noreferrer">
          CIFAR
        </Link>{' '}
        for an{' '}
        <Link
          href="https://cifar.ca/action-on-covid-19/ai-and-covid-19-catalyst-grants/"
          target="_blank"
          rel="noopener noreferrer"
        >
          AI and COVID-19 Catalyst Grants
        </Link>
        , Microsoft for an{' '}
        <Link
          href="https://blogs.microsoft.com/on-the-issues/2020/04/09/ai-for-health-covid-19/"
          target="_blank"
          rel="noopener noreferrer"
        >
          AI for Good COVID-19 Grant
        </Link>
        , and{' '}
        <Link href="https://www.computecanada.ca/" target="_blank" rel="noopener noreferrer">
          Compute Canada
        </Link>{' '}
        for computational resources that are sustaining this prototype.
      </Paragraph>
    </HomeTextWrapper>
  );
};

export default HomeText;

const HomeTextWrapper = styled.div`
  margin-top: 16px;
`;
