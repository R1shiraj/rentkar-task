// src/app/partners/[id]/page.tsx
'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IDeliveryPartner } from '@/types/partner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditPartnerPage({ 
  params, 
}: { 
  params: Promise<{ id: string }> 
}) {
  const [partner, setPartner] = useState<IDeliveryPartner | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = use(params)
  useEffect(() => {
    fetchPartner();
  }, [id]);

  const fetchPartner = async () => {
    try {
      const response = await fetch(`/api/partners/${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPartner(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/partners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partner),
      });

      if (!response.ok) throw new Error('Failed to update partner');
      router.push('/partners');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading || !partner) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Partner</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={partner.name}
              onChange={(e) => setPartner(prev => ({...prev!, name: e.target.value}))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={partner.email}
              onChange={(e) => setPartner(prev => ({...prev!, email: e.target.value}))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={partner.phone}
              onChange={(e) => setPartner(prev => ({...prev!, phone: e.target.value}))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={partner.status}
              onValueChange={(value) => setPartner(prev => ({...prev!, status: value as 'active' | 'inactive'}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Shift Timing</Label>
            <div className="flex gap-2">
              <Input
                type="time"
                value={partner.shift.start}
                onChange={(e) => setPartner(prev => ({
                  ...prev!,
                  shift: { ...prev!.shift, start: e.target.value }
                }))}
              />
              <Input
                type="time"
                value={partner.shift.end}
                onChange={(e) => setPartner(prev => ({
                  ...prev!,
                  shift: { ...prev!.shift, end: e.target.value }
                }))}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit">
              Save Changes
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/partners')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}