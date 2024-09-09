import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { GET_LAUNCH_DETAILS } from '../../queries/launchQueries';
import './index.scss';

const LaunchDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_LAUNCH_DETAILS, {
    variables: { id },
    skip: !id, // Skip query if no id is present
  });

  if (loading) return <p className="loading">Loading details...</p>;
  if (error) return <p className="error">Error: {error.message}</p>;

  // Check if data and data.launch are defined
  if (!data || !data.launch) return <p className="error">No launch details available.</p>;

  const { mission_name, launch_date_utc, rocket, details } = data.launch;

  return (
    <div className='container'>
      <div className="header-wrapper">
        <h1 className='mission-name'>{mission_name}</h1>
        <button className='back-button' onClick={() => router.back()}>Back to Launches</button>
      </div>

      <p className='launch-details'>{details || 'No details available for this launch.'}</p>
      <p className='launch-details'>Rocket: {rocket?.rocket_name || 'No rocket information available.'}</p>
      <p className='launch-details'>Launch Date: {new Date(launch_date_utc).toLocaleDateString() || 'No launch date available.'}</p>

    </div>
  );
};

export default LaunchDetails;