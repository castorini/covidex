import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import styled, { ThemeProvider } from 'styled-components';

import Navbar from './components/navigation/Navbar';
import Footer from './components/navigation/Footer';
import HomePage from './components/pages/HomePage';
import NotFoundPage from './components/pages/NotFoundPage';

import { HOME_ROUTE } from './shared/Constants';
import Theme from './shared/Theme';


const App = () => {
  return (
    <ThemeProvider theme={Theme}>
      <Router>
        <AppContainer>
          <Navbar />
          <Switch>
            <Route exact path={HOME_ROUTE}>
              <HomePage />
            </Route>
            <Route>
              <NotFoundPage />
            </Route>
          </Switch>
          <Footer />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;