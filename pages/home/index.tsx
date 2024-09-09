import Link from 'next/link';
import './index.scss';

export const metadata = {
  title: "SpaceX Dashboard",
};

export default function home() {
  return (
    <>
      <h1 className="main-heading">SpaceX Dashboard</h1>
      <div className="button-container">
        <Link href="/launches" className="launches-button">
          View Launches
        </Link>
      </div>
    </>
  );
}
