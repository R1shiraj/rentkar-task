// src/components/assignments/AssignmentDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { IAssignment, IAssignmentMetrics } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AssignmentDashboard() {
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [metrics, setMetrics] = useState<IAssignmentMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  console.log("assignments = ", assignments)

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/assignments');
      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      setAssignments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load assignments');
      console.error(err);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/assignments/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError('Failed to load metrics');
      console.error(err);
    }
  };

  const runAssignment = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/assignments', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to run assignment');
      }
      
      const result = await response.json();
      
      toast({
        title: "Success",
        description: `Assignment process completed: ${result.assignments.length} orders processed`,
      });
      
      // Refresh data
      await Promise.all([fetchAssignments(), fetchMetrics()]);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to run assignment process",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchAssignments(), fetchMetrics()]);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Total Assignments"
            value={metrics.totalAssigned}
          />
          <MetricsCard
            title="Success Rate"
            value={`${metrics?.successRate?.toFixed(1)}%`}
          />
          <MetricsCard
            title="Average Time"
            value={`${(metrics?.averageTime / 1000).toFixed(1)}s`}
          />
          <MetricsCard
            title="Failed Assignments"
            value={metrics.failureReasons.reduce((acc, curr) => acc + curr.count, 0)}
          />
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recent Assignments</h2>
        <Button 
          onClick={runAssignment} 
          disabled={isProcessing}
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Run Assignment Process
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No assignments found
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((assignment) => (
                  <TableRow key={assignment._id}>
                    <TableCell className="font-medium">
                      {assignment?.orderId.orderNumber}
                    </TableCell>
                    <TableCell>
                      {assignment?.partnerId ? assignment.partnerId.name : 'None'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={assignment.status === 'success' ? 'default' : 'destructive'}
                        className={assignment.status === 'success' ? "capitalize bg-green-100 text-green-800" : "capitalize bg-red-100 text-red-800"}
                      >
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(assignment.timestamp), { addSuffix: true })}
                    </TableCell>
                    <TableCell>{assignment.reason || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricsCardProps {
  title: string;
  value: string | number;
}

function MetricsCard({ title, value }: MetricsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}