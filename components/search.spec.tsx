import Search from './search';
import { render, screen } from '@testing-library/react';

const setup = () => {
  return render(<Search />);
};

describe('Search', () => {
  it('should render Search component', () => {
    setup();

    expect(screen.getByTestId('search-tid')).toBeInTheDocument();
  });
});
