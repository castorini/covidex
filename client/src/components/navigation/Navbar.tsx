import React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';

import GithubImg from '../../img/github.png';

import { TABLET_BREAKPOINT, HOME_ROUTE } from '../../shared/Constants';
import { PageContent, Heading1, Link } from '../../shared/Styles';
import Configuration, { METADATA } from '../../Configuration';

const Navbar = ({ history }: RouteComponentProps) => {
  return (
    <NavbarWrapper>
      <PageContent>
        <Row>
          <NavbarLogo tabIndex={0} onClick={() => history.push(HOME_ROUTE)}>
            {Configuration[METADATA]['title']}
          </NavbarLogo>
          <NavbarLinks>
            <Link
              href="https://github.com/castorini/covidex"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubLogo src={GithubImg} alt="Github logo" />
            </Link>
          </NavbarLinks>
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
  background: ${({ theme }) => theme.greenblue}; !important; 

  @media only screen and (max-width: ${TABLET_BREAKPOINT}px) {
    padding: 24px 16px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavbarLogo = styled.a`
  display: flex;
  ${Heading1}
  position: relative;
  font-weight: 800;
  cursor: pointer;
  color: ${({ theme }) => theme.white};
  max-width: fit-content;
`;

const NavbarLinks = styled.div`
  display: flex;
  align-items: center;

  a {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.white};

    &:hover {
      color: ${({ theme }) => theme.white};
      filter: brightness(85%);
    }
  }
`;

const GithubLogo = styled.img`
  display: flex;
  height: 24px;
  width: 24px;
  cursor: pointer;
  margin-right: 24px;

  &:hover {
    filter: brightness(85%);
  }
`;
