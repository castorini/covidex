import React from 'react';
import styled from 'styled-components';

import NYU from '../../img/nyu.png';
import UWaterloo from '../../img/uwaterloo.png';

import { Link } from '../../shared/Styles';

const Footer = () => {
  return (
    <FooterWrapper>
      <div>
        This site uses the&nbsp;
        <Link href="https://pages.semanticscholar.org/coronavirus-research" target="_blank" rel="noopener noreferrer">
          COVID-19 Open Research Dataset (CORD-19)
        </Link>
        &nbsp;provided by&nbsp;
        <Link href="https://www.semanticscholar.org" target="_blank" rel="noopener noreferrer">
          Semantic Scholar
        </Link>.
        &nbsp;Last updated on March 27th, 2020.
      </div>
      <Images>
        <Link href="https://uwaterloo.ca/" target="_blank" rel="noopener noreferrer">
          <SchoolImage src={UWaterloo} height="32px" alt="University of Waterloo Logo" />
        </Link>
        <Link href="https://www.nyu.edu/" target="_blank" rel="noopener noreferrer">
          <SchoolImage src={NYU} height="32px" alt="NYU Logo" />
        </Link>
      </Images>
    </FooterWrapper>
  );
}

export default Footer;

const FooterWrapper = styled.div`
  padding: 24px 48px;
  display: flex;
  position: relative;
  flex-direction: column;
`;

const Images = styled.div`
  margin-top: 16px;
  display: flex;
  position: relative;
`;

const SchoolImage = styled.img`
  height: 24px;
  width: auto;
  margin-right: 24px;
`;