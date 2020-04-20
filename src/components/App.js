/** @jsx jsx */
import { jsx } from '@emotion/core';
import Theme from './Theme';
import JobsContext from './JobsContext';
import JobsList from './JobsList';
import PlaceToDropFiles from './PlaceToDropFiles';

const App = () => {
  return (
    <Theme>
      <JobsContext>
        <PlaceToDropFiles />
        <JobsList />
      </JobsContext>
    </Theme>
  );
};

export default App;
