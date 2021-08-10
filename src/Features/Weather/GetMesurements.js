import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';
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

const client = new ApolloClient({
  uri: 'https://react.eogresources.com/graphql',
  cache: new InMemoryCache(),
});
const query = gql`
  query ($inputMeasurement: MeasurementQuery!) {
    getMeasurements(input:$inputMeasurement) {
      metric,
      at,
      value,
      unit
    }
  }
`;

const GetMeasurements = (metricProp) => {
  const metricProperty = metricProp;
  const inputMeasurement = {
    metricName: metricProperty.name.selectedMetric,
    after: (Math.floor(new Date().getTime() / 1000.0) * 1000) - (30 * 60 * 1000),
    before: Math.floor(new Date().getTime() / 1000.0) * 1000,
  };
  const { loading, error, data } = useQuery(query, {
    variables: {
      inputMeasurement,
    },
  });
  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Chip label="data not found" />;
  const metrics = data.getMeasurements;
  const reFormatedMetrics = metrics.slice().sort((a, b) => a - b);
  const formatXAxis = (tickItem) => new Date(tickItem).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={reFormatedMetrics}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="at" tickFormatter={formatXAxis} />
        <YAxis dataKey="value" />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default (selectedMetric) => (
  <ApolloProvider client={client}>
    <GetMeasurements name={selectedMetric} />
  </ApolloProvider>
);
