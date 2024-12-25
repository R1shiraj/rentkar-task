'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddPartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddPartnerDialog({ 
  open, 
  onOpenChange,
  onSuccess 
}: AddPartnerDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'inactive',
    areas: [] as string[],
    shift: {
      start: '09:00',
      end: '17:00'
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          currentLoad: 0,
          metrics: {
            rating: 0,
            completedOrders: 0,
            cancelledOrders: 0
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to create partner');
      
      onSuccess();
      onOpenChange(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'inactive',
        areas: [],
        shift: {
          start: '09:00',
          end: '17:00'
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Partner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}
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
                value={formData.shift.start}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  shift: { ...prev.shift, start: e.target.value }
                }))}
              />
              <Input
                type="time"
                value={formData.shift.end}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  shift: { ...prev.shift, end: e.target.value }
                }))}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Partner
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}