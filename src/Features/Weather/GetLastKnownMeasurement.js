import React from 'react';
import {
  ApolloClient,
  ApolloProvider,
  useQuery,
  gql,
  InMemoryCache,
} from '@apollo/client';
import { Typography } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '../../components/Chip';
import Card from '../../components/Card';

const client = new ApolloClient({
  uri: 'https://react.eogresources.com/graphql',
  cache: new InMemoryCache(),
});

const GetLastKnownMeasurements = (metricProp) => {
  const metricProperty = metricProp;
  const name = metricProperty.name.metricName;
  const query = gql`
  query {
    getLastKnownMeasurement(metricName:"${name}") {
      metric,
      at,
      value,
      unit
    }
  }
`;
  const { loading, error, data } = useQuery(query);
  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Chip label="data not found" />;
  const metrics = data.getLastKnownMeasurement;
  return (
    <Card metricName={metrics.metric} metricValue={metrics.value} />
  );
};

export default (metricName) => (
  <ApolloProvider client={client}>
    <GetLastKnownMeasurements name={metricName} />
  </ApolloProvider>
);
