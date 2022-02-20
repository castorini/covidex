import React from 'react';
import styled from 'styled-components';
import { Link, Paragraph, Bold } from '../../../shared/Styles';

const HomeText = () => {
  return (
    <HomeTextWrapper>
      <Paragraph>
        <Bold>GWFDex</Bold> applies state-of-the-art neural network models and artificial
        intelligence (AI) techniques to searching scholarly literature in the {' '}
        <Link
          href="https://uwaterloo.ca/global-water-futures/"
          target="_blank"
          rel="noopener noreferrer"
        >
            Global Water Futures Research Community.
        </Link>
      </Paragraph>
    </HomeTextWrapper>
  );
};

export default HomeText;

const HomeTextWrapper = styled.div`
  margin-top: 16px;
`;
