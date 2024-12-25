// src/app/partners/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IDeliveryPartner } from '@/types/partner';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AddPartnerDialog from './AddPartnerDialog';

export default function PartnersPage() {
  const [partners, setPartners] = useState<IDeliveryPartner[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPartners(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/partners/${id}`);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Delivery Partners</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Add New Partner
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Current Load</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner._id}>
              <TableCell>{partner.name}</TableCell>
              <TableCell>{partner.email}</TableCell>
              <TableCell>{partner.phone}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  partner.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {partner.status}
                </span>
              </TableCell>
              <TableCell>{partner.currentLoad}/3</TableCell>
              <TableCell>{partner.metrics.rating.toFixed(1)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(partner._id!)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddPartnerDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={fetchPartners}
      />
    </div>
  );
}