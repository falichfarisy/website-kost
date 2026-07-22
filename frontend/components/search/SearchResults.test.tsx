import { render, screen, fireEvent } from '@testing-library/react';
import { SearchResults, ResultCard } from '@/components/search/SearchResults';

interface MockKos {
  id: number;
  name: string;
  kos_type: string;
  address: string;
  price: number;
  price_type: string;
  area: number;
  capacity: number;
  available_rooms: number;
  rating: number;
  review_count: number;
  images: Array<{ url: string; is_primary: boolean }>;
  facilities: Array<{ id: number; name: string; icon: string }>;
  location: { province: string; city: string; district: string };
}

const mockKos: MockKos[] = [
  {
    id: 1,
    name: 'Test Kos 1',
    kos_type: 'putra',
    address: 'Jalan Test 1',
    price: 1000000,
    price_type: 'bulan',
    area: 12,
    capacity: 10,
    available_rooms: 5,
    rating: 4.5,
    review_count: 10,
    images: [{ url: 'https://example.com/image1.jpg', is_primary: true }],
    facilities: [{ id: 1, name: 'WiFi', icon: 'wifi' }, { id: 2, name: 'AC', icon: 'ac' }],
    location: { province: 'DKI Jakarta', city: 'Jakarta Pusat', district: 'Menteng' },
  },
  {
    id: 2,
    name: 'Test Kos 2',
    kos_type: 'putri',
    address: 'Jalan Test 2',
    price: 1500000,
    price_type: 'bulan',
    area: 15,
    capacity: 8,
    available_rooms: 3,
    rating: 4.0,
    review_count: 5,
    images: [],
    facilities: [{ id: 1, name: 'WiFi', icon: 'wifi' }],
    location: { province: 'DKI Jakarta', city: 'Jakarta Selatan', district: 'Kebayoran Baru' },
  },
];

describe('SearchResults', () => {
  const defaultProps = {
    kosData: mockKos,
    isLoading: false,
    error: null,
    totalCount: 2,
    totalPages: 1,
    currentPage: 1,
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders result cards for each kos', () => {
    render(<SearchResults {...defaultProps} />);
    expect(screen.getByText('Test Kos 1')).toBeInTheDocument();
    expect(screen.getByText('Test Kos 2')).toBeInTheDocument();
  });

  it('shows total results count', () => {
    render(<SearchResults {...defaultProps} />);
    expect(screen.getByText('Test Kos 1')).toBeInTheDocument();
    expect(screen.getByText('Test Kos 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const loadingProps = { ...defaultProps, isLoading: true };
    render(<SearchResults {...loadingProps} />);
    // Loading state shows 6 skeleton cards in a grid
    const grid = screen.getByTestId('skeleton-grid');
    expect(grid).toBeInTheDocument();
    const skeletonCards = grid.querySelectorAll('.animate-pulse');
    expect(skeletonCards).toHaveLength(6);
  });

  it('shows empty state when no results', () => {
    const emptyProps = { ...defaultProps, kosData: [], totalCount: 0 };
    render(<SearchResults {...emptyProps} />);
    expect(screen.getByText('Tidak Ada Hasil')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const errorProps = { ...defaultProps, error: 'Failed to load' };
    render(<SearchResults {...errorProps} />);
    expect(screen.getByText('Gagal Memuat Data')).toBeInTheDocument();
  });

  it('shows pagination when multiple pages', () => {
    const paginationProps = { ...defaultProps, totalPages: 3 };
    render(<SearchResults {...paginationProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onPageChange when page clicked', () => {
    const paginationProps = { ...defaultProps, totalPages: 3 };
    render(<SearchResults {...paginationProps} />);
    const page2 = screen.getByText('2');
    fireEvent.click(page2);
    expect(paginationProps.onPageChange).toHaveBeenCalledWith(2);
  });
});

describe('ResultCard', () => {
  const kos = mockKos[0];

  it('renders kos name', () => {
    render(<ResultCard kos={kos} />);
    expect(screen.getByText('Test Kos 1')).toBeInTheDocument();
  });

  it('renders kos type badge', () => {
    render(<ResultCard kos={kos} />);
    expect(screen.getByText('Putra')).toBeInTheDocument();
  });

  it('renders price', () => {
    render(<ResultCard kos={kos} />);
    expect(screen.getByText('Rp1.000.000')).toBeInTheDocument();
  });

  it('renders rating and review count', () => {
    render(<ResultCard kos={kos} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('renders address', () => {
    render(<ResultCard kos={kos} />);
    expect(screen.getByText('MENTENG')).toBeInTheDocument();
  });

  it('renders facilities', () => {
    render(<ResultCard kos={kos} />);
    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('AC')).toBeInTheDocument();
  });
});