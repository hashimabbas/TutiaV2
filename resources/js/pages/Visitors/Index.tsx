import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, MapPin, Globe, Clock, FileText } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

interface Visitor {
  id: number;
  ip: string;
  page_name: string;
  countryName: string | null;
  countryCode: string | null;
  regionName: string | null;
  cityName: string | null;
  created_at: string;
}

interface Props {
  visitors: {
    data: Visitor[];
    links: any[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Visitors', href: '/visitors' },
];

export default function Index({ visitors }: Props) {
  const deleteVisitor = (id: number) => {
    if (confirm('Are you sure you want to delete this visitor record?')) {
      router.delete(route('visitors.destroy', id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Visitor Management" />

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Visitor Management</h1>
        </div>

        <div className="rounded-md border bg-white dark:bg-gray-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">IP Address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Page Visited</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.data.length > 0 ? (
                visitors.data.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-mono text-xs">
                      {visitor.ip}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Globe className="h-3 w-3 text-muted-foreground" />
                          {visitor.countryName || 'Unknown'} {visitor.countryCode ? `(${visitor.countryCode})` : ''}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {visitor.cityName || 'N/A'}, {visitor.regionName || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-[200px]" title={visitor.page_name}>
                          {visitor.page_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {new Date(visitor.created_at).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => deleteVisitor(visitor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No visitor records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {visitors.last_page > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                {visitors.prev_page_url && (
                  <PaginationItem>
                    <PaginationPrevious href={visitors.prev_page_url} />
                  </PaginationItem>
                )}

                {Array.from({ length: Math.min(5, visitors.last_page) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={`/visitors?page=${page}`}
                        isActive={visitors.current_page === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {visitors.last_page > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {visitors.next_page_url && (
                  <PaginationItem>
                    <PaginationNext href={visitors.next_page_url} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
