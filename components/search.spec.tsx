import Search from './search';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInterface } from './types';

const setup = (overrides?: Partial<SearchInterface>) => {
  const props: SearchInterface = {
    doSearch: () => {},
  };
  const user = userEvent.setup();
  const renderResult = render(<Search {...props} {...overrides} />);
  const searchInput = screen.getByRole('searchbox');
  const form = screen.getByRole('form');

  return {
    user,
    searchInput,
    form,
    ...renderResult,
  };
};

describe('Search', () => {
  it('should render Search component', () => {
    setup();

    expect(screen.getByTestId('search-tid')).toBeInTheDocument();
  });

  it('should render an input type equals search', () => {
    setup();

    expect(screen.getByRole('searchbox')).toHaveProperty('type', 'search');
  });

  it('should render a form', () => {
    setup();

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('should call props.doSearch() when form is submited', () => {
    const doSearch = jest.fn();
    setup({ doSearch });

    const form = screen.getByRole('form');

    fireEvent.submit(form);

    expect(doSearch).toHaveBeenCalledTimes(1);
  });

  it('should call props.doSearch() with the user input', async () => {
    const searchTerm = 'Relógio bonito';
    const doSearch = jest.fn();
    const { user, searchInput, form } = setup({ doSearch });

    await user.type(searchInput, searchTerm);
    fireEvent.submit(form);

    expect(doSearch).toHaveBeenCalledTimes(1);
    expect((searchInput as HTMLInputElement).value).toBe(searchTerm);
    expect(doSearch).toHaveBeenCalledWith(searchTerm);
  });
});
