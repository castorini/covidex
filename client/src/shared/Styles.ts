import styled, { css } from 'styled-components';

import { TABLET_BREAKPOINT, CONTENT_WIDTH } from './Constants';

export const INTER_FONT = css`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
`;

export const Heading1 = css`
  font-size: 24px;
  font-weight: 600;
`;

export const Heading2 = css`
  font-size: 18px;
  font-weight: 600;
`;

export const Body = css`
  ${INTER_FONT}
  font-size: 14px;
  font-weight: 400;
`;

export const Link = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
  
  &:hover {
    filter: brightness(80%);     
  }
`;

export const PageWrapper = styled.div`
  height: 100%;
  width: 100%;
  margin: auto;
  margin-top: 32px;
  padding: 24px 48px;

  @media only screen and (max-width: ${TABLET_BREAKPOINT}px) {
    padding: 24px;
  }
`;

export const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  width: ${CONTENT_WIDTH}px;
  margin: auto;
`;
