'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { FaBox, FaClipboardList, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/account/orders');
      return;
    }

    // Fetch orders if authenticated
    const fetchOrders = async () => {
      try {
        setPageLoading(true);
        
        // For demo purposes, we'll create mock orders
        // In a real app, you would fetch orders from your API
        const mockOrders = [
          {
            _id: '682009d162cd32c2443bb6e9',
            orderNumber: 'ORD-123456',
            totalPrice: 79.99,
            status: 'processing',
            createdAt: new Date().toISOString(),
            items: [
              { name: 'Product 1', quantity: 2, price: 29.99 },
              { name: 'Product 2', quantity: 1, price: 19.99 }
            ]
          },
          {
            _id: '682009d162cd32c2443bb6e8',
            orderNumber: 'ORD-123455',
            totalPrice: 129.99,
            status: 'shipped',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            items: [
              { name: 'Product 3', quantity: 1, price: 99.99 },
              { name: 'Product 4', quantity: 2, price: 14.99 }
            ]
          }
        ];
        
        setOrders(mockOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setPageLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, loading, router]);

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link 
            href="/account" 
            className="text-purple-400 hover:text-purple-300 inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Account
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">My Orders</h1>
          <p className="text-gray-400 mt-2">
            View and track all your orders
          </p>
        </div>

        {error ? (
          <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg flex items-center">
            <FaExclamationTriangle className="mr-3 flex-shrink-0" />
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <FaClipboardList className="text-gray-600 text-5xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Orders Yet</h2>
            <p className="text-gray-400 mb-6">
              You haven't placed any orders yet.
            </p>
            <Link 
              href="/products" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg inline-block transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-700 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <span className="text-gray-400 text-sm">Order #</span>
                    <h3 className="text-white font-medium">{order.orderNumber}</h3>
                  </div>
                  <div className="mt-2 md:mt-0 flex flex-wrap gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">Date</span>
                      <p className="text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Total</span>
                      <p className="text-white">€{order.totalPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Status</span>
                      <p className={`font-medium capitalize ${
                        order.status === 'delivered' ? 'text-green-400' :
                        order.status === 'shipped' ? 'text-blue-400' :
                        order.status === 'processing' ? 'text-yellow-400' :
                        order.status === 'cancelled' ? 'text-red-400' :
                        'text-purple-400'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="text-white font-medium mb-3">Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-gray-700 h-10 w-10 rounded flex items-center justify-center mr-3">
                            <FaBox className="text-gray-500" />
                          </div>
                          <div>
                            <p className="text-white">{item.name}</p>
                            <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-white">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-700 p-4 flex justify-end">
                  <Link 
                    href={`/account/orders/${order._id}`}
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    View Order Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
