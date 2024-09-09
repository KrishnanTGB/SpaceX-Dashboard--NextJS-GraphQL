import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Launches from '../pages/launches/index';
import { ALL_LAUNCHES_QUERY } from '../queries/launchQueries';

// Mocked data
const mocks = [
  {
    request: {
      query: ALL_LAUNCHES_QUERY,
    },
    result: {
      data: {
        launchesPast: [
          {
            id: '1',
            mission_name: 'Mission One',
            launch_date_utc: '2024-01-01T00:00:00Z',
            rocket: {
              rocket_name: 'Falcon 9',
            },
          },
          {
            id: '2',
            mission_name: 'Mission Two',
            launch_date_utc: '2024-02-01T00:00:00Z',
            rocket: {
              rocket_name: 'Falcon Heavy',
            },
          },
        ],
      },
    },
  },
];

describe('Launches Component', () => {
  test('renders loading state', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Launches />
      </MockedProvider>
    );
    expect(screen.getByText(/Loading launches.../i)).toBeInTheDocument();
  });

  test('renders error state', async () => {
    const errorMocks = [
      {
        request: {
          query: ALL_LAUNCHES_QUERY,
        },
        error: new Error('An error occurred'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <Launches />
      </MockedProvider>
    );

    expect(await screen.findByText(/An error occurred: An error occurred/i)).toBeInTheDocument();
  });

  test('renders launches data', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Launches />
      </MockedProvider>
    );

    expect(await screen.findByText(/Mission One/i)).toBeInTheDocument();
    expect(await screen.findByText(/Mission Two/i)).toBeInTheDocument();
    expect(screen.getByText(/Rocket Name: Falcon 9/i)).toBeInTheDocument();
    expect(screen.getByText(/Rocket Name: Falcon Heavy/i)).toBeInTheDocument();
  });

  test('filters launches based on search input', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Launches />
      </MockedProvider>
    );

    const searchInput = await screen.findByPlaceholderText(/Search by Rocket Name/i);
    fireEvent.change(searchInput, { target: { value: 'Falcon 9' } });

    expect(await screen.findByText(/Mission One/i)).toBeInTheDocument();
    expect(screen.queryByText(/Mission Two/i)).toBeNull();
  });

  test('displays no results message when no launches match search', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Launches />
      </MockedProvider>
    );

    const searchInput = await screen.findByPlaceholderText(/Search by Rocket Name/i);
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Rocket' } });

    expect(await screen.findByText(/No results found/i)).toBeInTheDocument();
  });

  test('renders back to dashboard link', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Launches />
      </MockedProvider>
    );

    expect(await screen.findByText(/Back to Dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Dashboard/i })).toHaveAttribute('href', '/');
  });
});
