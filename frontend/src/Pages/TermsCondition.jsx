// TermsConditions.jsx
"use client";

export default function TermsConditions() {
  return (
    <div className="px-8 py-8 max-w-4xl mx-auto mb-34">
      <h1 className="text-3xl font-serif mb-6">Terms & Conditions</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-medium mb-2">Introduction</h2>
          <p className="text-gray-600">
            By using our website, you agree to these terms and conditions...
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">User Responsibilities</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Accurate account information</li>
            <li>Proper use of services</li>
            {/* Add more points */}
          </ul>
        </section>

        {/* Add more sections */}
      </div>
    </div>
  );
}