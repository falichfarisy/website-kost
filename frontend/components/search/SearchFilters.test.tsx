import { render, screen, fireEvent } from '@testing-library/react';
import { SearchFilters } from '@/components/search/SearchFilters';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('SearchFilters', () => {
  const defaultProps = {
    filters: {
      search: '',
      minPrice: 0,
      maxPrice: 0,
      type: '',
      facilities: [],
      rating: 0,
      sortBy: 'rating',
    },
    onFilterChange: vi.fn(),
    onSearch: vi.fn(),
    onClearFilters: vi.fn(),
    isLoading: false,
    totalCount: 0,
    error: null,
    totalPages: 1,
    currentPage: 1,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders filter panel title', () => {
    render(<SearchFilters {...defaultProps} />);
    expect(screen.getByText('Filter Pencarian')).toBeInTheDocument();
  });

  it('renders type filter section', () => {
    render(<SearchFilters {...defaultProps} />);
    expect(screen.getByText('Tipe Kos')).toBeInTheDocument();
    expect(screen.getByText('Semua Tipe')).toBeInTheDocument();
    expect(screen.getByText('Putra')).toBeInTheDocument();
    expect(screen.getByText('Putri')).toBeInTheDocument();
    expect(screen.getByText('Campur')).toBeInTheDocument();
  });

  it('renders location filter section', () => {
    render(<SearchFilters {...defaultProps} />);
    expect(screen.getByText('Lokasi')).toBeInTheDocument();
    expect(screen.getByText('Semua Kecamatan')).toBeInTheDocument();
  });

  it('renders price filter section', () => {
    render(<SearchFilters {...defaultProps} />);
    expect(screen.getByText('Harga Bulanan')).toBeInTheDocument();
    expect(screen.getByText('Semua Harga')).toBeInTheDocument();
    expect(screen.getByText('< 1.000.000')).toBeInTheDocument();
  });

  it('renders rating filter section', () => {
    render(<SearchFilters {...defaultProps} />);
    expect(screen.getByText('Rating Minimum')).toBeInTheDocument();
  });

  it('renders facilities filter section', () => {
    render(<SearchFilters {...defaultProps} />);
    expect(screen.getByText('Fasilitas')).toBeInTheDocument();
  });

  it('calls onFilterChange when type radio changes', () => {
    render(<SearchFilters {...defaultProps} />);
    const putraRadio = screen.getByLabelText('Putra');
    fireEvent.click(putraRadio);
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith('type', 'Putra');
  });

  it('calls onFilterChange when location select changes', () => {
    render(<SearchFilters {...defaultProps} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Coblong' } });
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith('kecamatan', 'Coblong');
  });

  it('calls onFilterChange when price radio changes', () => {
    render(<SearchFilters {...defaultProps} />);
    const priceRadio = screen.getByLabelText('< 1.000.000');
    fireEvent.click(priceRadio);
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith('price_min', 0);
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith('price_max', 1000000);
  });

  it('calls onSearch when apply filter button clicked', () => {
    render(<SearchFilters {...defaultProps} />);
    const button = screen.getByRole('button', { name: /terapkan filter/i });
    fireEvent.click(button);
    expect(defaultProps.onSearch).toHaveBeenCalled();
  });

  it('shows clear filters button when facilities selected', () => {
    const propsWithFacilities = {
      ...defaultProps,
      filters: { ...defaultProps.filters, facilities: ['WiFi', 'AC'] },
    };
    render(<SearchFilters {...propsWithFacilities} />);
    expect(screen.getByText('Hapus Semua')).toBeInTheDocument();
  });

  it('calls onClearFilters when clear button clicked', () => {
    const propsWithFacilities = {
      ...defaultProps,
      filters: { ...defaultProps.filters, facilities: ['WiFi', 'AC'] },
    };
    render(<SearchFilters {...propsWithFacilities} />);
    const button = screen.getByText('Hapus Semua');
    fireEvent.click(button);
    expect(defaultProps.onClearFilters).toHaveBeenCalled();
  });

  it('shows error state when error prop provided', () => {
    const propsWithError = {
      ...defaultProps,
      error: 'Network error',
    };
    render(<SearchFilters {...propsWithError} />);
    expect(screen.getByText('Gagal Memuat Data')).toBeInTheDocument();
  });

  it('shows total count when provided', () => {
    const propsWithCount = {
      ...defaultProps,
      totalCount: 42,
      isLoading: false,
      error: null,
    };
    render(<SearchFilters {...propsWithCount} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});