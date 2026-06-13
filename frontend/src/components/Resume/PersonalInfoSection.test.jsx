import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { PersonalInfoSection } from './PersonalInfoSection';

const emptyPersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  summary: '',
};

describe('PersonalInfoSection', () => {
  it('renders existing personal information', () => {
    render(
      <PersonalInfoSection
        data={{ ...emptyPersonalInfo, fullName: 'Muhammad Anas', email: 'anas@example.com' }}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue('Muhammad Anas')).toBeInTheDocument();
    expect(screen.getByDisplayValue('anas@example.com')).toBeInTheDocument();
  });

  it('emits nested resume field updates when a user edits data', () => {
    const onChange = vi.fn();

    render(<PersonalInfoSection data={emptyPersonalInfo} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Anas' } });
    fireEvent.change(screen.getByLabelText(/professional summary/i), {
      target: { value: 'Career focused student' },
    });

    expect(onChange).toHaveBeenCalledWith('personalInfo.fullName', 'Anas');
    expect(onChange).toHaveBeenLastCalledWith('personalInfo.summary', 'Career focused student');
  });
});
