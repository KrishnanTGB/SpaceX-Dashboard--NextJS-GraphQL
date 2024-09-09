import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { ALL_LAUNCHES_QUERY } from '../../queries/launchQueries';
import './index.scss';

const Launches = () => {
    const [launches, setLaunches] = useState<any[]>([]); // All launches
    const [visibleCount, setVisibleCount] = useState(20); // Number of launches to display
    const [search, setSearch] = useState(''); // Search input value
    const [filteredLaunches, setFilteredLaunches] = useState<any[]>([]); // Filtered launches
    const [hasMore, setHasMore] = useState(true); // Flag - if there are more launches to load

    // Fetch all launches
    const { data, loading, error } = useQuery(ALL_LAUNCHES_QUERY, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (data) => {
            if (data && data.launchesPast) {
                setLaunches(data.launchesPast);
                setHasMore(data.launchesPast.length > visibleCount);
            }
        },
    });

    // Load more launches when the user scrolls to the bottom of the page
    const loadMore = useCallback(() => {
        if (!hasMore || loading) return;
        setVisibleCount((prevCount) => prevCount + 20); // Increase the number of visible launches
    }, [hasMore, loading]);

    // Add an event listener to handle scrolling
    useEffect(() => {
        const handleScroll = () => {
            const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
            if (bottom) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore]);

    // Update the filtered launches when the search input changes
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rocketName = event.target.value;
        setSearch(rocketName);

        const filtered = launches.filter((launch: any) =>
            launch.rocket.rocket_name.toLowerCase().includes(rocketName.toLowerCase())
        );
        setFilteredLaunches(filtered);
    };

    // Sort launches by date in descending order
    const sortLaunchesByDate = (launches: any[]) => {
        return [...launches].sort((a, b) => new Date(b.launch_date_utc).getTime() - new Date(a.launch_date_utc).getTime());
    };

    const sortedLaunches = sortLaunchesByDate(launches);
    const sortedFilteredLaunches = sortLaunchesByDate(filteredLaunches);
    const launchesToDisplay = search ? sortedFilteredLaunches.slice(0, visibleCount) : sortedLaunches.slice(0, visibleCount);

    // Display loading message when fetching launches
    if (loading && launches.length === 0) return <p className="loading">Loading launches...</p>;

    // Display error message if there is an error fetching launches
    if (error) return <p className="error">An error occurred: {error.message}</p>;

    return (
        <div className="container">
            <div className="header-wrapper">
                <h1 className="header">Search SpaceX Launches</h1>
                <Link href="/" className="back-to-home">
                    Back to Dashboard
                </Link>
            </div>
            <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by Rocket Name"
                className="searchInput"
            />
            <ul className="launchList">
                {
                    // Display a message if there are no launches to display
                    launchesToDisplay.length === 0 ? (
                        <p className="noResults">No results found</p>
                    ) : (
                        // Display launches
                        launchesToDisplay.map((launch: any) => (
                            <li key={launch.id} className="launchItem">
                                <Link href={`/launchdetails/${launch.id}`}>
                                    <h2 className="missionName">{launch.mission_name}</h2>
                                    <p className="date">Launch Date: {new Date(launch.launch_date_utc).toLocaleDateString()}</p>
                                    <p className="rocketName">Rocket Name: {launch.rocket.rocket_name}</p>
                                </Link>
                            </li>
                        ))
                    )}
            </ul>
            {loading && !search && launches.length > 0 && <p className="loading">Loading more launches...</p>}
        </div>
    );
};

export default Launches;
