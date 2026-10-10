'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const data = await res.json();
        setStats({
          totalProducts: data.totalProducts || 0,
          totalOrders: data.totalOrders || 0,
          totalUsers: data.totalUsers || 0,
          totalRevenue: data.totalRevenue || 0,
          recentOrders: data.recentOrders || []
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-2 border-amber border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statusBadge = (status = 'pending') => {
    const classes = {
      completed: 'bg-ink/5 text-ink',
      processing: 'bg-amber-wash text-amber-dark',
      pending: 'bg-bone-deep text-ink-muted',
      shipped: 'bg-amber-wash text-amber-dark',
      delivered: 'bg-green-50 text-green-700',
      cancelled: 'bg-red-50 text-red-700',
    };
    return classes[status] || classes.pending;
  };

  const StatCard = ({ icon: Icon, label, value, href, linkText }) => (
    <div className="bg-bone-light border border-ink/10 rounded-editorial p-6 transition-all duration-300 hover:border-ink/25 hover:shadow-editorial">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-bone-deep p-3 rounded-editorial">
          <Icon className="text-amber text-xl" />
        </div>
        <span className="eyebrow">{label}</span>
      </div>
      <p className="text-3xl font-serif text-ink mb-1">{value}</p>
      {href ? (
        <Link href={href} className="text-ink-muted hover:text-ink text-sm link-underline">
          {linkText} →
        </Link>
      ) : (
        <span className="text-ink-muted text-sm">{linkText}</span>
      )}
    </div>
  );

  return (
    <div>
      <header className="mb-10">
        <p className="eyebrow mb-2">Overview</p>
        <h1 className="text-3xl font-serif font-medium text-ink">Dashboard</h1>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          icon={FaBox}
          label="Products"
          value={stats.totalProducts}
          href="/admin/products"
          linkText="Manage products"
        />
        <StatCard
          icon={FaShoppingCart}
          label="Orders"
          value={stats.totalOrders}
          href="/admin/orders"
          linkText="View all orders"
        />
        <StatCard
          icon={FaUsers}
          label="Users"
          value={stats.totalUsers}
          href="/admin/users"
          linkText="Manage users"
        />
        <StatCard
          icon={FaDollarSign}
          label="Revenue"
          value={`€${typeof stats.totalRevenue === 'number' ? stats.totalRevenue.toFixed(2) : '0.00'}`}
          linkText="Total sales"
        />
      </div>

      {/* Recent Orders */}
      <section className="bg-bone-light border border-ink/10 rounded-editorial p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="eyebrow mb-1">Latest</p>
            <h2 className="text-xl font-serif font-medium text-ink">Recent Orders</h2>
          </div>
          <Link href="/admin/orders" className="text-sm text-ink-muted hover:text-ink link-underline">
            View all orders →
          </Link>
        </div>

        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-muted border-b border-ink/10">
                  <th className="pb-3 pr-4 font-normal">Order ID</th>
                  <th className="pb-3 pr-4 font-normal">Customer</th>
                  <th className="pb-3 pr-4 font-normal">Date</th>
                  <th className="pb-3 pr-4 font-normal">Amount</th>
                  <th className="pb-3 pr-4 font-normal">Status</th>
                  <th className="pb-3 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-ink/5 last:border-0 hover:bg-bone/50 transition-colors">
                    <td className="py-3 pr-4 text-ink-soft font-medium">#{order._id.slice(-6)}</td>
                    <td className="py-3 pr-4 text-ink-soft">{order.user?.name || 'Guest User'}</td>
                    <td className="py-3 pr-4 text-ink-muted">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="py-3 pr-4 text-ink-soft font-medium">€{(order.total || order.totalPrice || 0).toFixed(2)}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs ${statusBadge(order.status)}`}>
                        {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link href={`/admin/orders/${order._id}`} className="text-amber-dark hover:text-ink link-underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-ink-muted py-4">No recent orders found.</p>
        )}
      </section>
    </div>
  );
}
