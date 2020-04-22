/** @jsx jsx */
import { jsx } from '@emotion/core';
import Theme, { RootGrid } from './Theme';
import JobsContext from './JobsContext';
import JobsList from './JobsList';
import DropZone from './DropZone';
import Header from './Header';

export default () => {
  return (
    <Theme>
      <JobsContext>
        <RootGrid>
          <Header />
          <DropZone />
          <JobsList />
        </RootGrid>
      </JobsContext>
    </Theme>
  );
};
