import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { Helmet } from 'react-helmet';

import Navbar from './components/navigation/Navbar';
import Footer from './components/navigation/Footer';
import HomePage from './components/pages/HomePage/HomePage';
import RelatedPage from './components/pages/RelatedPage/RelatedPage';
import NotFoundPage from './components/pages/NotFoundPage';

import { HOME_ROUTE, RELATED_ROUTE } from './shared/Constants';
import Theme from './shared/Theme';
import Configuration, { METADATA } from './Configuration';

const App = () => {
  return (
    <ThemeProvider theme={Theme}>
      {/* Dynamically load metadata for HTML header */}
      <Helmet>
        <meta charSet="utf-8" />
        <title>{Configuration[METADATA]['title']}</title>
        <meta name="description" content={Configuration[METADATA]['description']} />
        <link rel="icon" href={`/${Configuration[METADATA]['favicon']}`} />
      </Helmet>
      <Router>
        <AppContainer>
          <Navbar />
          <Switch>
            <Route exact path={HOME_ROUTE}>
              <HomePage />
            </Route>
            <Route path={`${RELATED_ROUTE}/:articleId`}>
              <RelatedPage />
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
};

export default App;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
