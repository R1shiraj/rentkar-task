// src/app/assignments/page.tsx
import { Suspense } from 'react';
import AssignmentDashboard from '@/components/assignments/AssignmentDashboard';
import { DashboardSkeleton } from '@/components/assignments/loading';

export default function AssignmentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Assignment Dashboard</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <AssignmentDashboard />
      </Suspense>
    </div>
  );
}