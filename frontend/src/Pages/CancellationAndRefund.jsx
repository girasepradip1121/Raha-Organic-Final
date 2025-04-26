"use client";

export default function CancellationRefund() {
  return (
    <div className="px-8 py-8 max-w-4xl mx-auto  mb-36">
      <h1 className="text-3xl font-serif mb-6">Cancellation & Refund Policy</h1>

      <div className="space-y-4">
        <section>
          <h2 className="text-xl font-medium mb-2">Order Cancellation</h2>
          <p className="text-gray-600">
            Orders can be cancelled within 24 hours of placement...
          </p>
        </section>
        <section>
          <h2 className="text-xl font-medium mb-2">Refund Process</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Processing time: 5-7 business days</li>
            <li>Refund methods</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
