import React from 'react';
import styled from 'styled-components';
import { Paragraph, Bold } from '../../../shared/Styles';

const HomeText = () => {
  return (
    <HomeTextWrapper>
      <Paragraph>
        <Bold>Cydex</Bold> applies state-of-the-art neural network models and artificial
        intelligence (AI) techniques to searching scholarly literature.
      </Paragraph>
    </HomeTextWrapper>
  );
};

export default HomeText;

const HomeTextWrapper = styled.div`
  margin-top: 16px;
`;
