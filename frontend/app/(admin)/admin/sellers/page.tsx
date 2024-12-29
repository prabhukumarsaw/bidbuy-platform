'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';
import { DataTable } from '@/components/ui/data-table/table';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

const columns = [
  {
    accessorKey: 'businessName',
    header: 'Business Name',
  },
  {
    accessorKey: 'user.email',
    header: 'Email',
  },
  {
    accessorKey: 'verified',
    header: 'Status',
    cell: ({ row }) => (
      <span
        className={row.original.verified ? 'text-green-600' : 'text-yellow-600'}
      >
        {row.original.verified ? 'Verified' : 'Pending'}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button
        variant={row.original.verified ? 'destructive' : 'default'}
        onClick={() =>
          handleVerification(row.original.id, !row.original.verified)
        }
      >
        {row.original.verified ? 'Revoke' : 'Verify'}
      </Button>
    ),
  },
];

export default function AdminSellersPage() {
  const { data: sellers, isLoading } = useQuery({
    queryKey: ['seller-applications'],
    queryFn: () => adminApi.getSellerApplications(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Seller Applications</h1>
      <DataTable columns={columns} data={sellers || []} />
    </div>
  );
}
