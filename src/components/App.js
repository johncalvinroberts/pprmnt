/** @jsx jsx */
import { StrictMode } from 'react';
import { jsx } from '@emotion/core';
import { Route } from 'wouter';
import Theme from './Theme';
import GridRoot from './GridRoot';
import JobsContext from './JobsContext';
import Encoder from './Encoder';
import Header from './Header';
import Footer from './Footer';
import Privacy from './Privacy';
import About from './About';

export default () => {
  return (
    <StrictMode>
      <Theme>
        <JobsContext>
          <GridRoot>
            <Header />
            <Route path="/">
              <Encoder />
            </Route>
            <Route path="/privacy">
              <Privacy />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Footer />
          </GridRoot>
        </JobsContext>
      </Theme>
    </StrictMode>
  );
};
