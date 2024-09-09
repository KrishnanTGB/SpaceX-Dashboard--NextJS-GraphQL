import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../../styles/Launches.module.scss';

const GET_LAUNCHES = gql`
  query GetLaunches {
    launchesPast(limit: 10) {
      id
      mission_name
      launch_date_utc
      rocket {
        rocket_name
      }
    }
  }
`;

const Launches = () => {
  const { loading, error, data } = useQuery(GET_LAUNCHES);
  const [search, setSearch] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredLaunches = data.launchesPast.filter((launch: any) =>
    launch.rocket.rocket_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1>Recent Launches</h1>
      <input
        type="text"
        placeholder="Search by Rocket Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className='list-of-launches'>
        {filteredLaunches.map((launch: any) => (
          <li className='launch-detail' key={launch.id}>
            <Link href={`/launch/${launch.id}`} className='link-to-launch'>
                {launch.mission_name} - {launch.rocket.rocket_name} - {new Date(launch.launch_date_utc).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Launches;
