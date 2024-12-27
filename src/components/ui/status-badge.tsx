// src/components/ui/status-badge.tsx
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  assigned: "bg-blue-100 text-blue-800",
  picked: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={`${statusColors[status]} border-none`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}