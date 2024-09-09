import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import styles from '../../styles/LaunchDetails.module.scss';

const GET_LAUNCH_DETAILS = gql`
  query GetLaunchDetails($id: ID!) {
    launch(id: $id) {
      mission_name
      launch_date_utc
      rocket {
        rocket_name
      }
      details
    }
  }
`;

const LaunchDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_LAUNCH_DETAILS, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.container}>
      <h1 className='mission-name'>{data.launch.mission_name}</h1>
      <p className='launch-details'>{data.launch.details}</p>
      <p className='launch-details'>Rocket: {data.launch.rocket.rocket_name}</p>
      <p className='launch-details'>Launch Date: {new Date(data.launch.launch_date_utc).toLocaleDateString()}</p>
    </div>
  );
};

export default LaunchDetails;