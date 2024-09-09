import { gql } from '@apollo/client';

export const ALL_LAUNCHES_QUERY = gql`
  query {
    launchesPast(limit: 200) {
      id
      mission_name
      launch_date_utc
      rocket {
        rocket_name
      }
    }
  }
`;

export const GET_LAUNCH_DETAILS = gql`
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
