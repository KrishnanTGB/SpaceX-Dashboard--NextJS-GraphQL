import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import LaunchDetails from '../pages/launchdetails/[id]';
import { GET_LAUNCH_DETAILS } from '../queries/launchQueries';
import { useRouter } from 'next/router';

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mocks = [
  {
    request: {
      query: GET_LAUNCH_DETAILS,
      variables: { id: '1' },
    },
    result: {
      data: {
        launch: {
          mission_name: 'Mission Alpha',
          launch_date_utc: '2024-01-01T00:00:00Z',
          rocket: {
            rocket_name: 'Falcon 9',
          },
          details: 'This is a detailed description of Mission Alpha.',
        },
      },
    },
  },
];

describe('LaunchDetails Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ query: { id: '1' } });
  });

  test('renders loading state', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <LaunchDetails />
      </MockedProvider>
    );
    expect(screen.getByText(/Loading details.../i)).toBeInTheDocument();
  });

  test('renders error state', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_LAUNCH_DETAILS,
          variables: { id: '1' },
        },
        error: new Error('An error occurred'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <LaunchDetails />
      </MockedProvider>
    );

    expect(await screen.findByText(/Error: An error occurred/i)).toBeInTheDocument();
  });

  test('renders launch details', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LaunchDetails />
      </MockedProvider>
    );

    // Debugging output to verify what is rendered
    screen.debug();

    expect(await screen.queryAllByText(/Mission Alpha/i));
    expect(await screen.queryAllByText(/Launch Date: 01\/01\/2024/i));
    expect(await screen.queryAllByText(/Rocket: Falcon 9/i));
    expect(await screen.queryAllByText(/This is a detailed description of Mission Alpha./i));
  });

  test('renders no data available message when no data is available', async () => {
    const noDataMocks = [
      {
        request: {
          query: GET_LAUNCH_DETAILS,
          variables: { id: '1' },
        },
        result: {
          data: {
            launch: null,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={noDataMocks} addTypename={false}>
        <LaunchDetails />
      </MockedProvider>
    );

    expect(await screen.findByText(/No launch details available./i)).toBeInTheDocument();
  });

  test('renders back to launches link', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LaunchDetails />
      </MockedProvider>
    );

    expect(await screen.findByText(/Back to Launches/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Launches/i })).toHaveAttribute('href', '/launches');
  });
});
