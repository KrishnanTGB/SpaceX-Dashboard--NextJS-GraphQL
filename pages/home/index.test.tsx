import { render, screen } from '@testing-library/react';
import Home from './index';

describe('Home Component', () => {
  test('renders the main heading', () => {
    render(<Home />);
    // Check if the heading with text "SpaceX Dashboard" is present
    const headingElement = screen.getByText(/SpaceX Dashboard/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the View Launches button with correct link', () => {
    render(<Home />);
    // Check if the "View Launches" button is present
    const linkElement = screen.getByRole('link', { name: /View Launches/i });
    expect(linkElement).toBeInTheDocument();
    // Check if the button has the correct href
    expect(linkElement).toHaveAttribute('href', '/launches');
  });
});
