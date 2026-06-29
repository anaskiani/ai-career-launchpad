import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { SkillsInput } from './SkillsInput';

describe('SkillsInput', () => {
  it('renders existing skills as badges', () => {
    render(<SkillsInput skills={['React', 'Node.js', 'Python']} onChange={vi.fn()} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('renders an empty input when no skills exist', () => {
    render(<SkillsInput skills={[]} onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onChange with updated skills when a skill is removed', () => {
    const onChange = vi.fn();
    render(<SkillsInput skills={['React', 'Vue']} onChange={onChange} />);

    // Click the remove button (×) on the first skill
    const removeButtons = screen.getAllByRole('button');
    fireEvent.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalled();
  });
});
