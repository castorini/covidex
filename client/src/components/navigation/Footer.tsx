import React from 'react';
import styled from 'styled-components';
import GitHubButton from 'react-github-btn';

import NYU from '../../img/nyu.png';
import UWaterloo from '../../img/uwaterloo.png';

import { Link, PageContent } from '../../shared/Styles';
import { TABLET_BREAKPOINT, LARGE_MOBILE_BREAKPOINT } from '../../shared/Constants';

const Footer = () => {
  return (
    <FooterWrapper>
      <PageContent>
        <Row>
          <GithubWrapper>
            <GitHubButton
              href="https://github.com/castorini/covidex"
              data-color-scheme="no-preference: light; light: light; dark: light;"
              data-icon="octicon-star"
              data-size="large"
              data-show-count={true}
              aria-label="Star castorini/covidex on GitHub"
            >
              Star
            </GitHubButton>
            <GitHubButton
              href="https://github.com/castorini/covidex/fork"
              data-color-scheme="no-preference: light; light: light; dark: light;"
              data-icon="octicon-repo-forked"
              data-size="large"
              data-show-count={true}
              aria-label="Fork castorini/covidex on GitHub"
            >
              Fork
            </GitHubButton>
          </GithubWrapper>
          <Images>
            <Link href="https://uwaterloo.ca/" target="_blank" rel="noopener noreferrer">
              <SchoolImage src={UWaterloo} alt="University of Waterloo Logo" />
            </Link>
            <Link href="https://www.nyu.edu/" target="_blank" rel="noopener noreferrer">
              <SchoolImage src={NYU} alt="NYU Logo" />
            </Link>
          </Images>
        </Row>
      </PageContent>
    </FooterWrapper>
  );
};

export default Footer;

const FooterWrapper = styled.div`
  padding: 24px 48px;
  display: flex;
  position: relative;
  flex-direction: column;
  margin-top: 16px;

  @media only screen and (max-width: ${TABLET_BREAKPOINT}px) {
    padding: 24px 16px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;

  @media only screen and (max-width: ${LARGE_MOBILE_BREAKPOINT}px) {
    display: block;
  }
`;

const Images = styled.div`
  display: flex;
  position: relative;
  justify-content: flex-end;

  @media only screen and (max-width: ${LARGE_MOBILE_BREAKPOINT}px) {
    margin-top: 24px;
    justify-content: flex-start;
  }
`;

const SchoolImage = styled.img`
  height: 28px;
  width: auto;
  margin-right: 24px;
`;

const GithubWrapper = styled.div`
  display: flex;
  flex: 1;

  & > span:last-child {
    margin-left: 8px;
  }
`;
