// src/lib/seed.ts
import connectDB from './dbConnect';
import Partner from '@/models/Partner';
import Order from '@/models/Order';

const samplePartners = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    status: "active",
    currentLoad: 0,
    areas: ["Downtown", "Midtown", "Uptown"],
    shift: {
      start: "09:00",
      end: "17:00"
    },
    metrics: {
      rating: 4.8,
      completedOrders: 150,
      cancelledOrders: 3
    }
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "123-456-7891",
    status: "active",
    currentLoad: 1,
    areas: ["Westside", "Downtown", "Harbor"],
    shift: {
      start: "10:00",
      end: "18:00"
    },
    metrics: {
      rating: 4.9,
      completedOrders: 200,
      cancelledOrders: 2
    }
  },
  // Add more sample partners as needed
];

const sampleOrders = [
  {
    orderNumber: "ORD-001",
    customer: {
      name: "Alice Johnson",
      phone: "555-0001",
      address: "123 Main St, Downtown"
    },
    area: "Downtown",
    items: [
      {
        name: "Item 1",
        quantity: 2,
        price: 25.00
      }
    ],
    status: "pending",
    scheduledFor: "14:00",
    totalAmount: 50.00,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    orderNumber: "ORD-002",
    customer: {
      name: "Bob Wilson",
      phone: "555-0002",
      address: "456 Oak St, Midtown"
    },
    area: "Midtown",
    items: [
      {
        name: "Item 2",
        quantity: 1,
        price: 30.00
      }
    ],
    status: "pending",
    scheduledFor: "15:00",
    totalAmount: 30.00,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Add more sample orders as needed
];

export async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    await Partner.deleteMany({});
    await Order.deleteMany({});

    // Insert sample data
    await Partner.insertMany(samplePartners);
    await Order.insertMany(sampleOrders);

    console.log('Database seeded successfully');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
}