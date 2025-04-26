// PrivacyPolicy.jsx
"use client";

export default function PrivacyPolicy() {
  return (
    <div className="px-8 py-8 max-w-4xl mx-auto mb-34">
      <h1 className="text-3xl font-serif mb-6">Privacy Policy</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-medium mb-2">Data Collection</h2>
          <p className="text-gray-600">
            We collect information you provide when creating an account...
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">Data Usage</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Order processing</li>
            <li>Service improvement</li>
          </ul>
        </section>
      </div>
    </div>
  );
}