import React from 'react';
import styled from 'styled-components';

import NYU from '../../img/nyu.png';
import UWaterloo from '../../img/uwaterloo.png';

import { Link, PageContent } from '../../shared/Styles';
import { TABLET_BREAKPOINT } from '../../shared/Constants';

const Footer = () => {
  return (
    <FooterWrapper>
      <PageContent>
        <div>
          This site builds on top of the&nbsp;
          <Link href="https://pages.semanticscholar.org/coronavirus-research" target="_blank" rel="noopener noreferrer">
            COVID-19 Open Research Dataset (CORD-19)
          </Link>
          &nbsp;provided by&nbsp;
          <Link href="https://allenai.org" target="_blank" rel="noopener noreferrer">
            Allen AI
          </Link>.
        </div>
        <Images>
          <Link href="https://uwaterloo.ca/" target="_blank" rel="noopener noreferrer">
            <SchoolImage src={UWaterloo} height="32px" alt="University of Waterloo Logo" />
          </Link>
          <Link href="https://www.nyu.edu/" target="_blank" rel="noopener noreferrer">
            <SchoolImage src={NYU} height="32px" alt="NYU Logo" />
          </Link>
        </Images>
      </PageContent>
    </FooterWrapper>
  );
}

export default Footer;

const FooterWrapper = styled.div`
  padding: 24px 48px;
  display: flex;
  position: relative;
  flex-direction: column;

  @media only screen and (max-width: ${TABLET_BREAKPOINT}px) {
    padding: 24px;
  }
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