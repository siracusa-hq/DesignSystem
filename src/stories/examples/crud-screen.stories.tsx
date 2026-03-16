import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../../components/data-table';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../components/dialog';
import {
  FormLayout,
  FormSection,
  FormActions,
} from '../../components/form-layout';
import {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '../../components/form-field';
import { Input } from '../../components/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/select';
import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { Toaster } from '../../components/toast';
import { useToast } from '../../components/toast';

const meta: Meta = {
  title: 'Examples/CRUD Screen',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'inactive';
}

const sampleData: Employee[] = [
  { id: '1', name: 'Tanaka Taro', email: 'tanaka@example.com', department: 'Engineering', status: 'active' },
  { id: '2', name: 'Suzuki Hanako', email: 'suzuki@example.com', department: 'Design', status: 'active' },
  { id: '3', name: 'Sato Ichiro', email: 'sato@example.com', department: 'Marketing', status: 'inactive' },
  { id: '4', name: 'Yamada Yuki', email: 'yamada@example.com', department: 'Engineering', status: 'active' },
  { id: '5', name: 'Takahashi Mai', email: 'takahashi@example.com', department: 'Sales', status: 'active' },
  { id: '6', name: 'Ito Kenji', email: 'ito@example.com', department: 'Engineering', status: 'active' },
  { id: '7', name: 'Watanabe Rina', email: 'watanabe@example.com', department: 'Design', status: 'inactive' },
  { id: '8', name: 'Nakamura Daisuke', email: 'nakamura@example.com', department: 'Marketing', status: 'active' },
];

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'active' ? 'success' : 'outline'}>
          {status}
        </Badge>
      );
    },
  },
];

function CrudScreen() {
  const [data] = useState<Employee[]>(sampleData);
  const { toast } = useToast();

  const handleCreate = () => {
    toast({ title: 'Employee created', description: 'New employee has been added.' });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[--color-on-surface]">Employees</h1>
          <p className="text-sm text-[--color-on-surface-muted]">Manage your team members</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Employee</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Fill in the details to add a new team member.</DialogDescription>
            </DialogHeader>

            <FormLayout layout="vertical">
              <FormSection title="Basic Information">
                <FormField required>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Tanaka Taro" />
                  </FormControl>
                  <FormMessage />
                </FormField>

                <FormField required>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tanaka@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormField>

                <FormField>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormField>
              </FormSection>
            </FormLayout>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleCreate}>Create</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={data}
        enableSorting
        enablePagination
        enableRowSelection
        pageSize={5}
        aria-label="Employee list"
      />

      <Toaster />
    </div>
  );
}

export const Default: Story = {
  render: () => <CrudScreen />,
};
