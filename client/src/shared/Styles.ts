import styled, { css } from 'styled-components';

import { TABLET_BREAKPOINT, CONTENT_WIDTH } from './Constants';

export const ROBOTO_FONT = css`
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
`;

export const ROBOTO_SLAB_FONT = css`
  font-family: 'Roboto Slab', serif;
`;

export const Heading1 = css`
  ${ROBOTO_SLAB_FONT}
  font-size: 32px;
  font-weight: 700;
`;

export const Heading2 = css`
  ${ROBOTO_SLAB_FONT}
  font-size: 20px;
  font-weight: 700;
`;

export const Heading3 = css`
  ${ROBOTO_FONT}
  font-size: 20px;
  font-weight: 400;
`;

export const Body = css`
  ${ROBOTO_FONT}
  font-size: 16px;
  font-weight: 400;
`;

export const BodySmall = css`
  ${ROBOTO_FONT}
  font-size: 14px;
  font-weight: 400;
`;

export const LinkStyle = css`
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.primary};

  &:hover {
    color: ${({ theme }) => theme.secondary};
    text-decoration: underline;  
  }
`;

export const Link = styled.a`
  ${LinkStyle}
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
