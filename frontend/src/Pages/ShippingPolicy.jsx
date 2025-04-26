// ShippingPolicy.jsx
"use client";

export default function ShippingPolicy() {
  return (
    <div className="px-8 py-8 max-w-4xl mx-auto mb-34.5">
      <h1 className="text-3xl font-serif mb-6">Shipping Policy</h1>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          We aim to process and ship all orders within 2-3 business days. Shipping times may vary based on your location.
        </p>

        <div className="border-t pt-4">
          <h2 className="text-xl font-medium mb-2">Domestic Shipping</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Standard Shipping: 5-7 business days</li>
            <li>Express Shipping: 2-3 business days</li>
          </ul>
        </div>

        {/* Add more sections as needed */}
      </div>
    </div>
  );
}