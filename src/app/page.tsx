"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Package, TrendingUp, 
  Clock, CheckCircle
} from 'lucide-react';
import { IDeliveryPartner } from '@/types/partner';
import { IOrder } from '@/types/order';

const Dashboard = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [partners, setPartners] = useState<IDeliveryPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders and partners data
    const fetchData = async () => {
      try {
        const [ordersRes, partnersRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/partners')
        ]);
        
        const ordersData = await ordersRes.json();
        const partnersData = await partnersRes.json();
        
        setOrders(ordersData);
        setPartners(partnersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics
  const metrics = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(order => order?.status === 'pending').length,
    activePartners: partners.filter(partner => partner?.status === 'active').length,
    deliveredOrders: orders.filter(order => order?.status === 'delivered').length,
  };

  // Status color mapping
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    picked: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800'
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <Package className="h-10 w-10 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">{metrics?.totalOrders}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <Clock className="h-10 w-10 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <h3 className="text-2xl font-bold">{metrics?.pendingOrders}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <Users className="h-10 w-10 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Active Partners</p>
              <h3 className="text-2xl font-bold">{metrics?.activePartners}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <CheckCircle className="h-10 w-10 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Delivered Orders</p>
              <h3 className="text-2xl font-bold">{metrics?.deliveredOrders}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Order Number</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Area</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order?._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{order?.orderNumber}</td>
                    <td className="p-4">{order?.customer.name}</td>
                    <td className="p-4">{order?.area}</td>
                    <td className="p-4">
                      <Badge 
                        className={statusColors[order?.status]}
                      >
                        {order?.status}
                      </Badge>
                    </td>
                    <td className="p-4">${order?.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Active Partners */}
      <Card>
        <CardHeader>
          <CardTitle>Active Partners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Current Load</th>
                  <th className="text-left p-4">Areas</th>
                  <th className="text-left p-4">Rating</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {partners
                  .filter(partner => partner?.status === 'active')
                  .slice(0, 5)
                  .map((partner) => (
                    <tr key={partner?._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{partner?.name}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 rounded-full h-2"
                              style={{ width: `${(partner?.currentLoad / 3) * 100}%` }}
                            />
                          </div>
                          <span className="ml-2">{partner?.currentLoad}/3</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {partner?.areas?.slice(0, 2).map((area, index) => (
                            <Badge key={index} className="bg-gray-100 text-gray-800">
                              {area}
                            </Badge>
                          ))}
                          {partner?.areas?.length > 2 && (
                            <Badge className="bg-gray-100 text-gray-800">
                              +{partner?.areas?.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          {partner?.metrics?.rating.toFixed(1)}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;