import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import {
  Timeline,
  TimelineItem,
  TimelineIcon,
  TimelineConnector,
  TimelineContent,
  TimelineTime,
} from './timeline';

describe('Timeline', () => {
  it('renders as an ol element', () => {
    render(<Timeline data-testid="timeline" />);
    const el = screen.getByTestId('timeline');
    expect(el.tagName).toBe('OL');
  });

  it('renders items', () => {
    render(
      <Timeline>
        <TimelineItem data-testid="item">Item 1</TimelineItem>
      </Timeline>,
    );
    expect(screen.getByTestId('item').tagName).toBe('LI');
  });

  it('renders icon with default variant classes', () => {
    render(
      <Timeline>
        <TimelineItem>
          <TimelineIcon data-testid="icon">!</TimelineIcon>
        </TimelineItem>
      </Timeline>,
    );
    const icon = screen.getByTestId('icon');
    expect(icon.className).toContain('rounded-full');
    expect(icon.className).toContain('bg-neutral-100');
  });

  it('renders icon with success variant classes', () => {
    render(
      <Timeline>
        <TimelineItem>
          <TimelineIcon data-testid="icon" variant="success">
            OK
          </TimelineIcon>
        </TimelineItem>
      </Timeline>,
    );
    const icon = screen.getByTestId('icon');
    expect(icon.className).toContain('bg-success-100');
  });

  it('renders connector with aria-hidden', () => {
    render(
      <Timeline>
        <TimelineItem>
          <TimelineConnector data-testid="connector" />
        </TimelineItem>
      </Timeline>,
    );
    const connector = screen.getByTestId('connector');
    expect(connector.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders content', () => {
    render(
      <Timeline>
        <TimelineItem>
          <TimelineContent>Some content</TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    expect(screen.getByText('Some content')).toBeInTheDocument();
  });

  it('renders time element', () => {
    render(
      <Timeline>
        <TimelineItem>
          <TimelineTime dateTime="2024-01-01">Jan 1</TimelineTime>
        </TimelineItem>
      </Timeline>,
    );
    const time = screen.getByText('Jan 1');
    expect(time.tagName).toBe('TIME');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineIcon>1</TimelineIcon>
          <TimelineConnector />
          <TimelineContent>
            <p>Event description</p>
            <TimelineTime dateTime="2024-01-01">Jan 1</TimelineTime>
          </TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
