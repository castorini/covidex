import React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';

import GithubImg from '../../img/github.png';

import { TABLET_BREAKPOINT, HOME_ROUTE } from '../../shared/Constants';
import { PageContent, Heading1, Link } from '../../shared/Styles';

const Navbar = ({ history }: RouteComponentProps) => {
  return (
    <NavbarWrapper>
      <PageContent>
        <Row>
          <NavbarLogo onClick={() => history.push(HOME_ROUTE)}>Neural Covidex</NavbarLogo>
          <Link
            href="https://github.com/castorini/covidex"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubLogo src={GithubImg} alt="Github logo" />
          </Link>
        </Row>
      </PageContent>
    </NavbarWrapper>
  );
};

export default withRouter(Navbar);

const NavbarWrapper = styled.div`
  padding: 24px 48px;
  display: flex;
  justify-content: space-between;
  position: relative;
  background: linear-gradient(90deg, ${({ theme }) => `${theme.primary}, ${theme.secondary}`});

  @media only screen and (max-width: ${TABLET_BREAKPOINT}px) {
    padding: 24px 16px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavbarLogo = styled.div`
  display: flex;
  ${Heading1}
  position: relative;
  font-weight: 800;
  cursor: pointer;
  color: ${({ theme }) => theme.white};
  max-width: fit-content;
`;

const GithubLogo = styled.img`
  display: flex;
  height: 28px;
  width: 28px;
  cursor: pointer;

  &:hover {
    filter: brightness(85%);
  }
`;
