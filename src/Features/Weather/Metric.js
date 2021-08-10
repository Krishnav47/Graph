import React from 'react';
import {
  ApolloClient,
  ApolloProvider,
  useQuery,
  gql,
  InMemoryCache,
} from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '../../components/Chip';
import GetMesurements from './GetMesurements';
import GetLastKnownMeasurement from './GetLastKnownMeasurement';

const client = new ApolloClient({
  uri: 'https://react.eogresources.com/graphql',
  cache: new InMemoryCache(),
});

const query = gql`
  query {
     getMetrics
  }
`;
const useStyles = makeStyles({
  chartSection: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  sideSection: {
    display: 'flex',
    flexDirection: 'row',
  },
  cardsSection: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selectSection: {
    margin: '10px',
    borderRadius: '5px',
    padding: '15px',
  },
});
const GetMetrics = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(query);
  const [selectedValueState, setSelectedValueState] = React.useState({
    value: 'oilTemp',
  });
  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Chip label="data not found" />;

  function handleChange(event) {
    setSelectedValueState({
      value: event.target.value,
    });
  }
  const metrics = data.getMetrics;
  return (
    <>
      <div className={classes.sideSection}>
        <div className='selectMetric'>
          <form>
            <select
              className={classes.selectSection}
              value={selectedValueState.value}
              onChange={handleChange}
            >
              {metrics.map((metric, index) => {
                const metricName = metric;
                const key = index;
                return (
                  <option key={key} value={metricName}>{metricName}</option>
                );
              })}
            </select>
          </form>
        </div>
        <div className={classes.cardsSection} id='cardItems'>
          <GetLastKnownMeasurement metricName={selectedValueState.value} />
        </div>
      </div>
      <div className={classes.chartSection}>
        <GetMesurements selectedMetric={selectedValueState.value} />
      </div>
    </>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <GetMetrics />
  </ApolloProvider>
);
