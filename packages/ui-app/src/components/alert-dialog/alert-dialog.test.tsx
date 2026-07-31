import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './alert-dialog';

function renderAlertDialog(props?: { onAction?: () => void }) {
  return render(
    <AlertDialog>
      <AlertDialogTrigger>Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={props?.onAction}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>,
  );
}

describe('AlertDialog', () => {
  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    renderAlertDialog();

    await user.click(screen.getByText('Delete'));
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('renders as alertdialog role', async () => {
    const user = userEvent.setup();
    renderAlertDialog();

    await user.click(screen.getByText('Delete'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('closes on Cancel click', async () => {
    const user = userEvent.setup();
    renderAlertDialog();

    await user.click(screen.getByText('Delete'));
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();

    await user.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('closes on Action click and calls handler', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    renderAlertDialog({ onAction });

    await user.click(screen.getByText('Delete'));
    await user.click(screen.getByText('Continue'));

    expect(onAction).toHaveBeenCalledOnce();
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    renderAlertDialog();

    await user.click(screen.getByText('Delete'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('renders title as heading', async () => {
    const user = userEvent.setup();
    renderAlertDialog();

    await user.click(screen.getByText('Delete'));
    expect(screen.getByRole('heading', { name: 'Are you sure?' })).toBeInTheDocument();
  });

  it('renders Action with default button styles', async () => {
    const user = userEvent.setup();
    renderAlertDialog();

    await user.click(screen.getByText('Delete'));
    const action = screen.getByText('Continue');
    expect(action.className).toContain('bg-primary');
  });

  it('renders Cancel with outline button styles', async () => {
    const user = userEvent.setup();
    renderAlertDialog();

    await user.click(screen.getByText('Delete'));
    const cancel = screen.getByText('Cancel');
    expect(cancel.className).toContain('border');
  });

  it('merges custom className on content', async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent className="custom-alert-dialog">
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Desc</AlertDialogDescription>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>,
    );

    await user.click(screen.getByText('Open'));
    expect(screen.getByRole('alertdialog').className).toContain('custom-alert-dialog');
  });

  it('passes axe accessibility check', async () => {
    const user = userEvent.setup();
    const { container } = renderAlertDialog();

    await user.click(screen.getByText('Delete'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
