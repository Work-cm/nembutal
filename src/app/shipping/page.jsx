import Link from 'next/link';
import { FaShippingFast, FaBox, FaGlobeAmericas, FaClock, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { SITE_NAME, SITE_URL, SITE_WHATSAPP, SITE_TELEGRAM } from '@/lib/constants/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `Shipping & Delivery Policy | ${SITE_NAME}`,
  description: 'Learn about our shipping methods, delivery times, international shipping, and tracking information.',
  alternates: {
    canonical: '/shipping',
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-bone pt-24 pb-16">
      <div className="container-editorial max-w-4xl">
        <header className="mb-8">
          <p className="eyebrow mb-2">Legal</p>
          <h1 className="text-4xl font-serif font-medium text-ink mb-4 flex items-center">
            <FaShippingFast className="mr-4 text-amber" />
            Shipping & Delivery Policy
          </h1>
          <p className="text-ink-muted">Last Updated: December 3, 2025</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: FaShippingFast, title: 'Fast Shipping', body: 'Orders processed within 24 hours' },
            { icon: FaShieldAlt, title: 'Discreet Packaging', body: 'Unmarked, secure packaging' },
            { icon: FaGlobeAmericas, title: 'USA & Europe', body: 'Delivery across the USA and Europe' },
          ].map((card) => (
            <div key={card.title} className="bg-bone-light border border-ink/10 rounded-editorial p-6 text-center shadow-editorial">
              <card.icon className="text-3xl text-amber mx-auto mb-3" />
              <h3 className="text-ink font-semibold mb-2 text-sm">{card.title}</h3>
              <p className="text-ink-muted text-sm">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="bg-bone-light border border-ink/10 rounded-editorial shadow-editorial p-8 text-ink-muted space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-ink mb-4 flex items-center">
              <FaClock className="mr-3 text-amber-dark" />
              1. Order Processing Time
            </h2>
            <p className="mb-4">All orders are carefully processed and prepared for shipment by our team:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Standard Processing:</strong> 24-48 hours (Monday-Friday)</li>
              <li><strong>Weekend Orders:</strong> Processed on the next business day</li>
              <li><strong>Holiday Orders:</strong> May experience delays during major holidays</li>
              <li><strong>Verification Required:</strong> Orders requiring additional verification may take 2-3 business days</li>
            </ul>
            <div className="bg-bone-deep border border-ink/10 rounded-editorial p-4 mt-4">
              <p className="text-ink-soft text-sm">
                <strong>Tip:</strong> Orders placed before 2:00 PM (CET) Monday-Friday are typically processed the same day.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mb-4 flex items-center">
              <FaBox className="mr-3 text-amber-dark" />
              2. Shipping Methods & Delivery Times
            </h2>
            <h3 className="text-xl font-semibold text-amber-dark mb-3">2.1 Domestic Shipping (Within Country)</h3>
            <div className="space-y-4 mb-6">
              {[
                { name: 'Standard Shipping', price: '$25.00', time: '2-5 business days', note: 'Reliable and cost-effective option for most orders' },
                { name: 'Express Shipping', price: '$45.00', time: '1-3 business days', note: 'Priority handling and expedited delivery' },
              ].map((method) => (
                <div key={method.name} className="bg-bone border border-ink/10 rounded-editorial p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-ink font-semibold text-sm">{method.name}</h4>
                    <span className="text-amber-dark font-bold text-sm">{method.price}</span>
                  </div>
                  <p className="text-xs text-ink-faint mb-2">Delivery: {method.time}</p>
                  <p className="text-sm text-ink-muted">{method.note}</p>
                </div>
              ))}

              <div className="bg-green-50 border border-green-200 rounded-editorial p-4">
                <div className="flex items-center mb-2">
                  <FaCheckCircle className="text-green-700 mr-2" />
                  <h4 className="text-ink font-semibold text-sm">FREE Standard Shipping</h4>
                </div>
                <p className="text-sm text-ink-muted">On orders over $150.00</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-amber-dark mb-3">2.2 International Shipping</h3>
            <div className="space-y-4">
              {[
                { name: 'Europe (EU)', price: '$30.00', time: '3-7 business days', note: 'Standard shipping within the European Union' },
                { name: 'North America', price: '$45.00', time: '5-12 business days', note: 'USA, Canada, and Mexico' },
                { name: 'Rest of World', price: '$60.00', time: '10-21 business days', note: 'Australia, Asia, South America, and other regions' },
              ].map((method) => (
                <div key={method.name} className="bg-bone border border-ink/10 rounded-editorial p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-ink font-semibold text-sm">{method.name}</h4>
                    <span className="text-amber-dark font-bold text-sm">{method.price}</span>
                  </div>
                  <p className="text-xs text-ink-faint mb-2">Delivery: {method.time}</p>
                  <p className="text-sm text-ink-muted">{method.note}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-wash border border-amber/20 rounded-editorial p-4 mt-4">
              <p className="text-amber-dark text-sm">
                <strong>Note:</strong> Delivery times are estimates and may vary due to customs processing, weather conditions, or carrier delays. We are not responsible for delays beyond our control.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mb-4 flex items-center">
              <FaShieldAlt className="mr-3 text-amber-dark" />
              3. Discreet & Secure Packaging
            </h2>
            <p className="mb-4">We understand the importance of privacy. All orders are shipped with the utmost discretion:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Unmarked Packaging:</strong> Plain, neutral boxes or envelopes with no branding</li>
              <li><strong>Generic Sender Name:</strong> No mention of our store name on the package</li>
              <li><strong>Secure Sealing:</strong> Tamper-evident packaging to ensure product integrity</li>
              <li><strong>Proper Cushioning:</strong> Products are carefully packed to prevent damage</li>
              <li><strong>Confidential Labels:</strong> No product descriptions on shipping labels</li>
            </ul>
            <div className="bg-bone-deep border border-ink/10 rounded-editorial p-4 mt-4">
              <p className="text-ink-soft text-sm">
                <strong>Privacy Guarantee:</strong> Your order details remain completely confidential. We never share shipping information with third parties except as required for delivery.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mb-4">4. Order Tracking</h2>
            <h3 className="text-xl font-semibold text-amber-dark mb-3">4.1 Tracking Information</h3>
            <p className="mb-4">Once your order ships, you will receive:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li><strong>Shipping Confirmation:</strong> Sent within 24 hours of shipment</li>
              <li><strong>Tracking Number:</strong> Unique tracking code for your order</li>
              <li><strong>Carrier Information:</strong> Name of the shipping carrier</li>
              <li><strong>Estimated Delivery Date:</strong> Expected delivery timeframe</li>
            </ul>

            <h3 className="text-xl font-semibold text-amber-dark mb-3">4.2 How to Track Your Order</h3>
            <div className="bg-bone border border-ink/10 rounded-editorial p-6">
              <ol className="list-decimal list-inside space-y-3">
                <li className="mb-2">
                  <strong className="text-ink">Check Your Messages:</strong>
                  <p className="ml-6 mt-1 text-sm text-ink-muted">Look for the shipping confirmation we send you once your order dispatches</p>
                </li>
                <li className="mb-2">
                  <strong className="text-ink">Visit Carrier Website:</strong>
                  <p className="ml-6 mt-1 text-sm text-ink-muted">Click the tracking link or visit the carrier's website directly</p>
                </li>
                <li className="mb-2">
                  <strong className="text-ink">Enter Tracking Number:</strong>
                  <p className="ml-6 mt-1 text-sm text-ink-muted">Input your unique tracking number to see real-time updates</p>
                </li>
                <li>
                  <strong className="text-ink">Monitor Progress:</strong>
                  <p className="ml-6 mt-1 text-sm text-ink-muted">Check regularly for status updates until delivery</p>
                </li>
              </ol>
            </div>

            <div className="bg-bone-deep border border-ink/10 rounded-editorial p-4 mt-4">
              <p className="text-ink-soft text-sm">
                <strong>Tip:</strong> Tracking information may take 24-48 hours to become active after shipment. If you don't see updates, please wait before contacting us.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mb-4 flex items-center">
              <FaGlobeAmericas className="mr-3 text-amber-dark" />
              5. International Shipping Information
            </h2>
            <h3 className="text-xl font-semibold text-amber-dark mb-3">5.1 Customs & Duties</h3>
            <p className="mb-4">For international orders, please be aware:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li><strong>Customs Fees:</strong> You are responsible for all customs duties, taxes, and fees</li>
              <li><strong>Import Regulations:</strong> Ensure products are legal to import in your country</li>
              <li><strong>Customs Delays:</strong> Packages may be held for inspection, causing delays</li>
              <li><strong>Refused Shipments:</strong> We cannot refund orders refused due to customs issues</li>
              <li><strong>Declaration Value:</strong> We declare the actual product value on customs forms</li>
            </ul>

            <h3 className="text-xl font-semibold text-amber-dark mb-3">5.2 Restricted Countries</h3>
            <p className="mb-4">We currently do not ship to the following countries due to legal restrictions:</p>
            <div className="bg-red-50 border border-red-200 rounded-editorial p-4">
              <p className="text-red-700 mb-2 text-sm">
                <strong>Shipping Restrictions:</strong>
              </p>
              <p className="text-sm text-ink-muted">
                Please contact us on <a href={SITE_WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-amber-dark hover:text-ink link-underline">WhatsApp</a> to verify if we can ship to your country before placing an order.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-amber-dark mb-3 mt-6">5.3 Address Requirements</h3>
            <p className="mb-4">To ensure successful international delivery:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide complete and accurate address including postal code</li>
              <li>Include phone number for customs clearance</li>
              <li>Use English characters for address (if applicable)</li>
              <li>Specify any special delivery instructions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mb-4">6. Delivery Issues</h2>
            <h3 className="text-xl font-semibold text-amber-dark mb-3">6.1 Lost or Stolen Packages</h3>
            <p className="mb-4">If your package is marked as delivered but you haven't received it:</p>
            <ol className="list-decimal list-inside space-y-2 mb-4 ml-4">
              <li>Check with neighbors, building management, or household members</li>
              <li>Look for delivery notices or alternative drop-off locations</li>
              <li>Wait 24 hours as carriers sometimes mark packages delivered early</li>
              <li>Contact the shipping carrier directly with your tracking number</li>
              <li>If still missing after 48 hours, contact us on <a href={SITE_WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-amber-dark hover:text-ink link-underline">WhatsApp</a></li>
            </ol>
            <p className="text-amber-dark text-sm">
              <strong>Note:</strong> We are not responsible for packages stolen after delivery confirmation. Consider using a secure delivery location.
            </p>

            <h3 className="text-xl font-semibold text-amber-dark mb-3 mt-6">6.2 Damaged Packages</h3>
            <p className="mb-4">If your package arrives damaged:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li><strong>Do Not Open:</strong> Keep the package sealed if possible</li>
              <li><strong>Take Photos:</strong> Document all damage to packaging and contents</li>
              <li><strong>Contact Us Immediately:</strong> Send photos via WhatsApp within 24 hours</li>
              <li><strong>File Carrier Claim:</strong> We will assist with filing a claim</li>
            </ul>

            <h3 className="text-xl font-semibold text-amber-dark mb-3">6.3 Wrong or Missing Items</h3>
            <p className="mb-4">If you receive the wrong item or items are missing:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Contact us within 48 hours of delivery</li>
              <li>Provide your order number and photos of received items</li>
              <li>We will arrange for replacement or refund</li>
              <li>Return shipping will be covered by us for our errors</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mb-4">7. Shipping Restrictions</h2>
            <p className="mb-4">Due to the nature of our products, certain restrictions apply:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Responsible Use:</strong> Products must be used responsibly as intended and directed</li>
              <li><strong>Legal Compliance:</strong> You are responsible for ensuring products are legal in your location</li>
              <li><strong>Age Verification:</strong> Must be 18+ to receive shipments</li>
              <li><strong>Signature Required:</strong> Some orders may require signature upon delivery</li>
              <li><strong>PO Boxes:</strong> We do not ship to PO boxes for security reasons</li>
              <li><strong>Freight Forwarders:</strong> Use of freight forwarding services is prohibited</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink mb-4">8. Shipping Support</h2>
            <p className="mb-4">Need help with your shipment? We're here to assist:</p>
            <div className="bg-bone border border-ink/10 rounded-editorial p-6">
              <p className="mb-3 text-sm"><strong className="text-ink">WhatsApp:</strong> <a href={SITE_WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-amber-dark hover:text-ink link-underline">Chat with us</a></p>
              <p className="mb-3 text-sm"><strong className="text-ink">Telegram:</strong> <a href={SITE_TELEGRAM} target="_blank" rel="noopener noreferrer" className="text-amber-dark hover:text-ink link-underline">Message us</a></p>
              <p className="mb-3 text-sm"><strong className="text-ink">Response Time:</strong> Within 24 hours</p>
              <p className="text-sm text-ink-muted mt-4">
                Please include your order number and tracking information when contacting us about shipping issues.
              </p>
            </div>
          </section>

          <section className="bg-ink text-bone-light rounded-editorial p-6">
            <h2 className="text-2xl font-semibold text-bone-light mb-4">Shipping Tips</h2>
            <ul className="space-y-2 text-sm">
              {[
                'Double-check your shipping address before completing checkout',
                'Provide a phone number for delivery notifications',
                'Choose a secure delivery location to prevent theft',
                'Track your package regularly for updates',
                'Contact us immediately if you notice any issues',
              ].map((tip) => (
                <li key={tip} className="flex items-start">
                  <FaCheckCircle className="text-amber mr-2 mt-1 flex-shrink-0" />
                  <span className="text-bone-deep">{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-8 flex justify-between">
          <Link
            href="/privacy"
            className="btn-secondary"
          >
            ← Privacy Policy
          </Link>
          <Link
            href="/"
            className="btn-primary"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
