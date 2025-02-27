export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-300 mb-4">
          Your privacy is important to us. This Privacy Policy explains how we
          collect, use, and protect your information.
        </p>

        <h2 className="text-2xl font-semibold mt-6">
          1. Information We Collect
        </h2>
        <p className="text-gray-300 mt-2">
          We may collect personal information, including but not limited to your
          name, email address, and usage data when you interact with our
          website.
        </p>

        <h2 className="text-2xl font-semibold mt-6">
          2. How We Use Your Information
        </h2>
        <p className="text-gray-300 mt-2">
          We use your data to provide, improve, and personalize our services. We
          do not sell or share your information with third parties for marketing
          purposes.
        </p>

        <h2 className="text-2xl font-semibold mt-6">3. Cookies and Tracking</h2>
        <p className="text-gray-300 mt-2">
          Our website may use cookies to improve user experience. You can
          control cookie settings through your browser.
        </p>

        <h2 className="text-2xl font-semibold mt-6">4. Security</h2>
        <p className="text-gray-300 mt-2">
          We take appropriate security measures to protect your personal
          information. However, no method of transmission over the internet is
          100% secure.
        </p>

        <h2 className="text-2xl font-semibold mt-6">5. Contact Us</h2>
        <p className="text-gray-300 mt-2">
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
          <a
            href="mailto:support@example.com"
            className="text-blue-400 hover:underline"
          >
            support@example.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
