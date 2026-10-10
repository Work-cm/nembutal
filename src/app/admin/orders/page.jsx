'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async (page = 1, search = '', status = 'all') => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        search: search || '',
        status: status !== 'all' ? status : ''
      }).toString();
      
      const res = await fetch(`/api/admin/orders?${queryParams}`);
      
      if (!res.ok) {
        throw new Error(`Error fetching orders: ${res.status}`);
      }
      
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, searchTerm, statusFilter);
  }, [currentPage, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders(1, searchTerm, statusFilter);
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    
    try {
      const res = await fetch(`/api/admin/orders/${orderToDelete._id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        // Show success message
        alert('Order deleted successfully');
        
        // Update the orders list
        setOrders(orders.filter(o => o._id !== orderToDelete._id));
        setShowDeleteModal(false);
        setOrderToDelete(null);
      } else {
        const error = await res.json();
        console.error('Failed to delete order:', error.message || 'Unknown error');
        alert(`Failed to delete order: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert(`Error deleting order: ${error.message || 'Unknown error'}`);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        // Update the order in the local state
        const data = await res.json();
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus, ...data.order } : order
        ));
      } else {
        const error = await res.json();
        console.error('Failed to update order status:', error.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-bone-deep text-ink-muted';
      case 'processing':
      case 'shipped':
        return 'bg-amber-wash text-amber-dark';
      case 'delivered':
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'cancelled':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-bone-deep text-ink-muted';
    }
  };

  return (
    <div>
      <header className="mb-8">
        <p className="eyebrow mb-1">Fulfillment</p>
        <h1 className="text-3xl font-serif font-medium text-ink">Orders</h1>
      </header>

      {/* Search and Filters */}
      <div className="bg-bone-light border border-ink/10 rounded-editorial p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full bg-bone border border-ink/15 text-ink px-4 py-2.5 pl-10 rounded-editorial focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-muted" />
            </div>
            <button
              type="submit"
              className="ml-2 bg-ink text-bone-light px-5 py-2.5 rounded-editorial hover:bg-ink-soft transition-colors text-sm font-medium"
            >
              Search
            </button>
          </form>

          <div className="flex items-center space-x-2">
            <span className="text-ink-soft text-sm">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-bone border border-ink/15 text-ink px-3 py-2 rounded-editorial focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors text-sm"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-2 border-amber border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {filteredOrders.length > 0 ? (
            <div className="bg-bone-light border border-ink/10 rounded-editorial overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-ink-muted border-b border-ink/10 bg-bone/50">
                      <th className="p-4 font-normal">Order ID</th>
                      <th className="p-4 font-normal">Customer</th>
                      <th className="p-4 font-normal">Date</th>
                      <th className="p-4 font-normal">Total</th>
                      <th className="p-4 font-normal">Status</th>
                      <th className="p-4 font-normal">Payment</th>
                      <th className="p-4 font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="border-b border-ink/5 last:border-0 hover:bg-bone/50 transition-colors">
                        <td className="p-4 font-medium text-ink-soft">#{order._id.slice(-6)}</td>
                        <td className="p-4">
                          {order.user ? (
                            <div>
                              <div className="font-medium text-ink-soft">{order.user.name}</div>
                              <div className="text-ink-muted text-xs">{order.user.email}</div>
                            </div>
                          ) : (
                            <span className="text-ink-muted">Unknown</span>
                          )}
                        </td>
                        <td className="p-4 text-ink-muted">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-medium text-ink-soft">€{order.totalPrice.toFixed(2)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="bg-bone border border-ink/15 text-ink text-xs px-2 py-1 rounded-editorial focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                        <td className="p-4">
                          {order.isPaid ? (
                            <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs">
                              Paid
                            </span>
                          ) : (
                            <span className="bg-amber-wash text-amber-dark px-2.5 py-1 rounded-full text-xs">
                              Not Paid
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/admin/orders/${order._id}`}
                              className="text-ink-muted hover:text-ink p-1.5 hover:bg-bone-deep rounded-editorial transition-colors"
                              title="View Order Details"
                            >
                              <FaEye />
                            </Link>
                            <button
                              onClick={() => router.push(`/admin/orders/${order._id}?edit=true`)}
                              className="text-ink-muted hover:text-ink p-1.5 hover:bg-bone-deep rounded-editorial transition-colors"
                              title="Edit Order"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(order)}
                              className="text-ink-muted hover:text-red-700 p-1.5 hover:bg-bone-deep rounded-editorial transition-colors"
                              title="Delete Order"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 flex justify-center border-t border-ink/10">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-editorial bg-bone border border-ink/10 text-ink-soft hover:bg-bone-deep disabled:opacity-40 text-sm transition-colors"
                    >
                      Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1.5 rounded-editorial text-sm ${
                          currentPage === i + 1
                            ? 'bg-ink text-bone-light'
                            : 'bg-bone border border-ink/10 text-ink-soft hover:bg-bone-deep'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-editorial bg-bone border border-ink/10 text-ink-soft hover:bg-bone-deep disabled:opacity-40 text-sm transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-bone-light border border-ink/10 p-8 rounded-editorial text-center">
              <p className="text-ink-muted">No orders found.</p>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bone-light border border-ink/10 rounded-editorial max-w-md w-full p-6 shadow-editorial-lg">
            <h3 className="text-xl font-serif font-medium text-ink mb-4">Confirm Delete</h3>
            <p className="text-ink-muted mb-8">
              Are you sure you want to delete order <span className="font-medium text-ink-soft">#{orderToDelete?._id.slice(-6)}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-bone border border-ink/15 text-ink-soft rounded-editorial hover:border-ink/30 hover:text-ink transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-700 text-bone-light rounded-editorial hover:bg-red-800 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
