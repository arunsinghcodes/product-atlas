import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { Product } from '../types/product';

const mockProduct: Product = {
  id: 1,
  title: 'Test Leather Backpack',
  price: 89.99,
  description: 'A rugged and stylish leather backpack.',
  category: "men's clothing",
  image: 'https://example.com/backpack.png',
  rating: {
    rate: 4.8,
    count: 140,
  },
};

describe('ProductCard Component', () => {
  it('renders product title, price, and category badge', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} badge="Top Rated" badgeColor="amber" />
      </BrowserRouter>,
    );

    expect(screen.getByText('Test Leather Backpack')).toBeInTheDocument();
    expect(screen.getByText('$89.99')).toBeInTheDocument();
    expect(screen.getByText("men's clothing")).toBeInTheDocument();
    expect(screen.getByText('Top Rated')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });
});
