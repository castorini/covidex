import React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';

import { TABLET_BREAKPOINT, HOME_ROUTE } from '../../shared/Constants';
import { PageContent } from '../../shared/Styles';

const Navbar = ({ history }: RouteComponentProps) => {
  return (
    <NavbarWrapper>
      <PageContent>
        <NavbarLogo onClick={() => history.push(HOME_ROUTE)}>
          COVID-19 Search &nbsp;
        </NavbarLogo>
      </PageContent>
    </NavbarWrapper>
  );
}

export default withRouter(Navbar);

const NavbarWrapper = styled.div`
  padding: 24px 48px;
  display: flex;
  justify-content: space-between;
  position: relative;

  @media only screen and (max-width: ${TABLET_BREAKPOINT}px) {
    padding: 24px;
  }
`;

const NavbarLogo = styled.div`
  position: relative;
  font-size: 24px;
  font-weight: 800;
  cursor: pointer;

  &:after {
    position: absolute;
    content: '';
    height: 4px;
    bottom: -8px; 

    left: 0;
    width: 25%;
    background: ${({ theme }) => theme.primary};
  }
`;