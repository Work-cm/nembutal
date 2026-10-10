'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { use } from 'react';
import { FaArrowLeft, FaEdit, FaSave, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

function OrderDetailContent({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const orderId = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editableOrder, setEditableOrder] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  // Fetch order data
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`);
        
        if (!res.ok) {
          throw new Error(`Error fetching order: ${res.status}`);
        }
        
        const data = await res.json();
        setOrder(data);
        setEditableOrder(data); // Initialize editable state with fetched data
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        setError(error.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  // Handle form input changes
  const handleInputChange = (field, value) => {
    setEditableOrder(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle shipping address changes
  const handleAddressChange = (field, value) => {
    setEditableOrder(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }));
  };
  
  // Save changes
  const saveChanges = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editableOrder.status,
          isPaid: editableOrder.isPaid,
          isDelivered: editableOrder.isDelivered,
          notes: editableOrder.notes,
          shippingAddress: editableOrder.shippingAddress
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update order');
      }
      
      const updatedOrder = await res.json();
      setOrder(updatedOrder);
      setEditableOrder(updatedOrder);
      
      // Exit edit mode
      router.push(`/admin/orders/${orderId}`);
    } catch (error) {
      console.error('Error saving order changes:', error);
      setSaveError(error.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
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

  const selectClass = "w-full bg-bone border border-ink/15 text-ink px-3 py-2 rounded-editorial focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors text-sm";
  const inputClass = "w-full bg-bone border border-ink/15 text-ink px-3 py-2 rounded-editorial focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors text-sm";
  const labelClass = "block text-ink-muted text-sm mb-1";
  const cardClass = "bg-bone-light border border-ink/10 rounded-editorial p-6";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-2 border-amber border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-amber-wash border border-amber/30 text-amber-dark p-4 rounded-editorial">
        <div className="flex items-center mb-2">
          <FaExclamationTriangle className="mr-2" />
          <h2 className="text-xl font-serif font-medium">Error</h2>
        </div>
        <p>{error}</p>
        <button
          onClick={() => router.push('/admin/orders')}
          className="mt-4 bg-ink text-bone-light px-4 py-2 rounded-editorial flex items-center hover:bg-ink-soft transition-colors text-sm"
        >
          <FaArrowLeft className="mr-2" /> Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-bone-light border border-ink/10 p-8 rounded-editorial text-center">
        <p className="text-ink-muted mb-4">Order not found.</p>
        <Link
          href="/admin/orders"
          className="btn-primary"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Link
            href="/admin/orders"
            className="mr-4 text-ink-muted hover:text-ink transition-colors"
          >
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <p className="eyebrow mb-1">Order #{orderId.slice(-6)}</p>
            <h1 className="text-2xl font-serif font-medium text-ink">Order Details</h1>
          </div>
          <span className={`ml-4 px-3 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div>
          {isEditMode ? (
            <div className="flex space-x-2">
              <button
                onClick={saveChanges}
                disabled={isSaving}
                className="bg-ink text-bone-light px-4 py-2 rounded-editorial flex items-center hover:bg-ink-soft transition-colors disabled:opacity-60 text-sm"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-bone-light border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving…
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Changes
                  </>
                )}
              </button>
              <button
                onClick={() => router.push(`/admin/orders/${orderId}`)}
                className="bg-bone border border-ink/15 text-ink-soft px-4 py-2 rounded-editorial flex items-center hover:border-ink/30 hover:text-ink transition-colors text-sm"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push(`/admin/orders/${orderId}?edit=true`)}
              className="bg-ink text-bone-light px-4 py-2 rounded-editorial flex items-center hover:bg-ink-soft transition-colors text-sm"
            >
              <FaEdit className="mr-2" /> Edit Order
            </button>
          )}
        </div>
      </div>

      {saveError && (
        <div className="bg-amber-wash border border-amber/30 text-amber-dark p-4 rounded-editorial mb-6 text-sm">
          <div className="flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <p>{saveError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <div className={cardClass}>
            <h2 className="text-xl font-serif font-medium text-ink mb-6">Order Summary</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className={labelClass}>Order ID</p>
                <p className="font-medium text-ink-soft text-sm">{order._id}</p>
              </div>

              <div>
                <p className={labelClass}>Order Date</p>
                <p className="font-medium text-ink-soft text-sm">{formatDate(order.createdAt)}</p>
              </div>

              <div>
                <p className={labelClass}>Payment Status</p>
                {isEditMode ? (
                  <select
                    value={editableOrder.isPaid ? 'paid' : 'unpaid'}
                    onChange={(e) => handleInputChange('isPaid', e.target.value === 'paid')}
                    className={selectClass}
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Not Paid</option>
                  </select>
                ) : (
                  <div className="flex items-center text-sm">
                    <span className={order.isPaid ? 'text-green-700' : 'text-amber-dark'}>
                      {order.isPaid ? 'Paid' : 'Not Paid'}
                    </span>
                    {order.isPaid && order.paidAt && (
                      <span className="text-ink-muted ml-2">({formatDate(order.paidAt)})</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <p className={labelClass}>Delivery Status</p>
                {isEditMode ? (
                  <select
                    value={editableOrder.isDelivered ? 'delivered' : 'not-delivered'}
                    onChange={(e) => handleInputChange('isDelivered', e.target.value === 'delivered')}
                    className={selectClass}
                  >
                    <option value="delivered">Delivered</option>
                    <option value="not-delivered">Not Delivered</option>
                  </select>
                ) : (
                  <div className="flex items-center text-sm">
                    <span className={order.isDelivered ? 'text-green-700' : 'text-amber-dark'}>
                      {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                    </span>
                    {order.isDelivered && order.deliveredAt && (
                      <span className="text-ink-muted ml-2">({formatDate(order.deliveredAt)})</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <p className={labelClass}>Order Status</p>
                {isEditMode ? (
                  <select
                    value={editableOrder.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className={selectClass}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <span className={`px-2.5 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                )}
              </div>

              <div>
                <p className={labelClass}>Payment Method</p>
                <p className="font-medium text-ink-soft text-sm">{order.paymentMethod || 'Stripe'}</p>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6 pt-6 border-t border-ink/10">
              <p className={labelClass}>Admin Notes</p>
              {isEditMode ? (
                <textarea
                  value={editableOrder.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className={`${inputClass} min-h-[100px]`}
                  placeholder="Add notes about this order..."
                />
              ) : (
                <p className="bg-bone border border-ink/10 p-3 rounded-editorial text-ink-soft text-sm min-h-[60px]">{order.notes || 'No notes'}</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className={cardClass}>
            <h2 className="text-xl font-serif font-medium text-ink mb-6">Order Items</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-muted border-b border-ink/10">
                    <th className="pb-3 font-normal">Product</th>
                    <th className="pb-3 font-normal">Price</th>
                    <th className="pb-3 font-normal">Qty</th>
                    <th className="pb-3 font-normal text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item) => (
                    <tr key={item._id} className="border-b border-ink/5 last:border-0">
                      <td className="py-4">
                        <div className="flex items-center">
                          {item.product?.images?.[0] && (
                            <div className="w-12 h-12 relative mr-3 bg-bone-deep rounded-editorial overflow-hidden">
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-ink-soft">{item.product?.name || 'Product Unavailable'}</p>
                            {item.variant && <p className="text-xs text-ink-muted">{item.variant}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-ink-muted">€{item.price?.toFixed(2) || '0.00'}</td>
                      <td className="py-4 text-ink-muted">{item.quantity}</td>
                      <td className="py-4 text-right font-medium text-ink-soft">
                        €{((item.price || 0) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="text-sm">
                  <tr>
                    <td colSpan="3" className="pt-4 text-right font-medium text-ink-muted">Subtotal:</td>
                    <td className="pt-4 text-right font-medium text-ink-soft">€{order.itemsPrice?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="pt-2 text-right font-medium text-ink-muted">Shipping:</td>
                    <td className="pt-2 text-right font-medium text-ink-soft">€{order.shippingPrice?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="pt-2 text-right font-medium text-ink-muted">Tax:</td>
                    <td className="pt-2 text-right font-medium text-ink-soft">€{order.taxPrice?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="pt-4 text-right font-serif text-lg font-medium text-ink">Total:</td>
                    <td className="pt-4 text-right font-serif text-lg font-medium text-ink">€{order.totalPrice?.toFixed(2) || '0.00'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className={cardClass}>
            <h2 className="text-xl font-serif font-medium text-ink mb-4">Customer Information</h2>

            {order.user ? (
              <div className="text-sm">
                <p className="font-medium text-ink-soft">{order.user.name}</p>
                <p className="text-ink-muted">{order.user.email}</p>
              </div>
            ) : (
              <p className="text-ink-muted text-sm">Guest checkout</p>
            )}
          </div>

          {/* Shipping Address */}
          <div className={cardClass}>
            <h2 className="text-xl font-serif font-medium text-ink mb-4">Shipping Address</h2>

            {isEditMode ? (
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    type="text"
                    value={editableOrder.shippingAddress?.name || ''}
                    onChange={(e) => handleAddressChange('name', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Address</label>
                  <input
                    type="text"
                    value={editableOrder.shippingAddress?.address || ''}
                    onChange={(e) => handleAddressChange('address', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    value={editableOrder.shippingAddress?.city || ''}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Postal Code</label>
                  <input
                    type="text"
                    value={editableOrder.shippingAddress?.postalCode || ''}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Country</label>
                  <input
                    type="text"
                    value={editableOrder.shippingAddress?.country || ''}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="text"
                    value={editableOrder.shippingAddress?.phone || ''}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1 text-sm">
                <p className="font-medium text-ink-soft">{order.shippingAddress?.name}</p>
                <p className="text-ink-muted">{order.shippingAddress?.address}</p>
                <p className="text-ink-muted">
                  {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                </p>
                <p className="text-ink-muted">{order.shippingAddress?.country}</p>
                {order.shippingAddress?.phone && (
                  <p className="pt-2 text-ink-muted">
                    <span className="font-medium text-ink-soft">Phone: </span>
                    {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Payment Info */}
          {order.paymentResult && (
            <div className={cardClass}>
              <h2 className="text-xl font-serif font-medium text-ink mb-4">Payment Information</h2>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-ink-muted">Payment ID: </span>
                  <span className="text-ink-soft">{order.paymentResult.id}</span>
                </div>

                <div>
                  <span className="text-ink-muted">Status: </span>
                  <span className={order.paymentResult.status === 'succeeded' ? 'text-green-700' : 'text-amber-dark'}>
                    {order.paymentResult.status}
                  </span>
                </div>

                <div>
                  <span className="text-ink-muted">Date: </span>
                  <span className="text-ink-soft">{formatDate(order.paymentResult.update_time || order.paidAt)}</span>
                </div>

                <div>
                  <span className="text-ink-muted">Email: </span>
                  <span className="text-ink-soft">{order.paymentResult.email_address}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetail({ params }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OrderDetailContent params={params} />
    </Suspense>
  );
}
