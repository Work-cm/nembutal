'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe, useElements, PaymentElement, AddressElement } from '@stripe/react-stripe-js';
import { FaLock, FaSpinner } from 'react-icons/fa';
import { useCart } from '@/components/cart/CartProvider';

export default function CheckoutForm({ orderDetails }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { cart } = useCart();
  
  const [errorMessage, setErrorMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }
    
    setProcessing(true);
    setErrorMessage('');
    
    try {
      // Create the order in your database first
      console.log('Submitting order with cart items:', cart);
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billingDetails,
          orderTotal: orderDetails.total,
          cartItems: cart // Include cart items in the request
        }),
      });
      
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) {
        throw new Error(orderData.message || 'Failed to create order');
      }
      
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?order_id=${orderData._id}`,
        },
        redirect: 'if_required',
      });
      
      if (error) {
        throw new Error(error.message || 'Payment failed');
      }
      
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful without redirect
        // Update the order status
        await fetch(`/api/orders/${orderData._id}/update-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'processing',
            paymentIntentId: paymentIntent.id
          }),
        });
        
        // Clear the cart
        await fetch('/api/cart/clear', {
          method: 'POST',
        });
        
        // Redirect to success page
        router.push(`/checkout/success?order_id=${orderData._id}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'An error occurred during payment processing');
    } finally {
      setProcessing(false);
    }
  };

  const handleAddressChange = (event) => {
    setBillingDetails({
      ...billingDetails,
      address: event.value.address,
      name: event.value.name
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && (
        <div className="bg-amber-wash border border-amber/30 text-amber-dark px-4 py-3 rounded-editorial mb-6 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-ink font-serif text-lg font-medium mb-4">Billing Information</h3>
        <AddressElement
          options={{
            mode: 'billing',
            allowedCountries: ['US', 'CA', 'GB', 'AU'],
            fields: {
              phone: 'always',
            },
            validation: {
              phone: {
                required: 'always',
              },
            },
          }}
          onChange={handleAddressChange}
          className="mb-4"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-ink font-serif text-lg font-medium mb-4">Payment Method</h3>
        <PaymentElement
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                name: billingDetails.name,
              },
            },
          }}
        />
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Processing…
            </>
          ) : (
            <>
              <FaLock className="mr-2" />
              Pay €{orderDetails.total.toFixed(2)}
            </>
          )}
        </button>

        <p className="text-ink-muted text-xs mt-4 text-center">
          Your payment information is encrypted and secure. We never store your full credit card details.
        </p>
      </div>
    </form>
  );
}
