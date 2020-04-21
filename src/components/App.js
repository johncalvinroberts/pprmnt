/** @jsx jsx */
import { jsx } from '@emotion/core';
import Theme, { RootGrid } from './Theme';
import JobsContext from './JobsContext';
import JobsList from './JobsList';
import PlaceToDropFiles from './PlaceToDropFiles';
import Header from './Header';

export default () => {
  return (
    <Theme>
      <JobsContext>
        <RootGrid>
          <Header />
          <PlaceToDropFiles />
          <JobsList />
        </RootGrid>
      </JobsContext>
    </Theme>
  );
};
