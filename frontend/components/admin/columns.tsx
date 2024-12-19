import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/lib/api/admin';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <Badge variant={row.original.role === 'ADMIN' ? 'default' : 'secondary'}>
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: 'emailVerified',
    header: 'Verified',
    cell: ({ row }) => (
      <Badge variant={row.original.emailVerified ? 'success' : 'destructive'}>
        {row.original.emailVerified ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => format(new Date(row.original.createdAt), 'PP'),
  },
];