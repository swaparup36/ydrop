"use client";

import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0817] to-[#1A1033] text-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="space-y-8"
        >
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">YouTube Data Access</h2>
            <p className="text-gray-300">
              Our platform requires access to specific YouTube account information to verify your eligibility for creator airdrops. Here&apos;s what we access and why:
            </p>
            
            <div className="space-y-4 ml-4">
              <div>
                <h3 className="text-xl font-semibold">Channel Membership Data</h3>
                <p className="text-gray-300">
                  We access information about your channel memberships, including:
                  - Current membership status
                  - Membership level
                  - Membership duration
                  This helps us verify your eligibility for creator-specific airdrops based on membership criteria.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">YouTube Account Information</h3>
                <p className="text-gray-300">
                  We access basic YouTube account details to:
                  - Verify your identity
                  - Confirm channel subscriptions
                  - Track engagement duration
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">How We Use Your Data</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Verify eligibility for creator airdrops</li>
              <li>Confirm membership status and duration</li>
              <li>Validate subscription status to creators</li>
              <li>Ensure fair distribution of rewards</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">Data Protection</h2>
            <p className="text-gray-300">
              We take your privacy seriously. Your data is:
              - Encrypted during transmission and storage
              - Never shared with third parties
              - Only used for airdrop verification purposes
              - Stored securely and deleted when no longer needed
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">Your Rights</h2>
            <p className="text-gray-300">
              You have the right to:
              - Request access to your data
              - Request deletion of your data
              - Revoke YouTube permissions at any time
              - Opt-out of the platform
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about our privacy policy or data practices, please contact us at:
              swaparup36@gmail.com
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}