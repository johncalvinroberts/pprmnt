/** @jsx jsx */
import { StrictMode } from 'react';
import { jsx } from '@emotion/core';
import Theme from './Theme';
import GridRoot from './GridRoot';
import JobsContext from './JobsContext';
import JobsList from './JobsList';
import DropZone from './DropZone';
import Header from './Header';
import Footer from './Footer';

export default () => {
  return (
    <StrictMode>
      <Theme>
        <JobsContext>
          <GridRoot>
            <Header />
            <DropZone>
              <JobsList />
            </DropZone>
            <Footer />
          </GridRoot>
        </JobsContext>
      </Theme>
    </StrictMode>
  );
};
