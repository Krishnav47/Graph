import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Metric from '../Features/Weather/Metric';

const useStyles = makeStyles({
  appBody: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
});

export default () => {
  const classes = useStyles();
  return (
    <>
      <main className={classes.appBody}>
        <Metric className={classes.metricForm} />
      </main>
    </>
  );
};
