import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Performance Optimization portal acceptance criteria', () => {
  it('renders the primary performance workspace clearly', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /performance optimization/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /performance summary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add initiative/i })).toBeInTheDocument();
  });

  it('shows a helpful empty state when search returns no results', async () => {
    render(<App />);
    await userEvent.type(screen.getByRole('textbox', { name: /search initiatives/i }), 'nothing matches this');
    expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('shows a loading indicator during asynchronous work', async () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /run optimization for reduce api response latency/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/processing your request/i);
    await vi.advanceTimersByTimeAsync(850);
    expect(screen.getByText(/optimization run started/i)).toBeInTheDocument();
  });

  it('blocks invalid form submission and marks required fields', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /add initiative/i }));
    expect(screen.getByText(/enter an optimization title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/initiative name/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/baseline/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText(/optimization initiative added successfully/i)).not.toBeInTheDocument();
  });

  it('creates an initiative from valid structured input', async () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.change(screen.getByLabelText(/initiative name/i), { target: { value: 'Improve checkout' } });
    fireEvent.change(screen.getByLabelText(/success metric/i), { target: { value: 'Load time' } });
    fireEvent.change(screen.getByLabelText(/baseline/i), { target: { value: '4.2' } });
    fireEvent.change(screen.getByLabelText(/target/i), { target: { value: '2.0' } });
    fireEvent.click(screen.getByRole('button', { name: /add initiative/i }));
    await vi.advanceTimersByTimeAsync(700);
    expect(screen.getByText('Improve checkout')).toBeInTheDocument();
    expect(screen.getByText(/optimization initiative added successfully/i)).toBeInTheDocument();
  });

  it('sanitizes text entered by the user before rendering it', async () => {
    render(<App />);
    const title = screen.getByLabelText(/initiative name/i);
    fireEvent.change(title, { target: { value: '<img src=x onerror=alert(1)>Safe title' } });
    expect(title).toHaveValue('Safe title');
  });

  it('logs an analytics ping when a primary action completes', async () => {
    vi.useFakeTimers();
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /run optimization for reduce api response latency/i }));
    await vi.advanceTimersByTimeAsync(850);
    expect(info).toHaveBeenCalledWith(expect.stringContaining('[Analytics] User interacted with Performance Optimization'));
  });

  it('provides accessible names for interactive controls', () => {
    render(<App />);
    expect(screen.getByRole('textbox', { name: /search initiatives/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /filter by category/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open help and support/i })).toBeInTheDocument();
  });
});
