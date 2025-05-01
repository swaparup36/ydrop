"use client";

import { motion } from 'framer-motion';

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing and using our platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">2. YouTube Integration</h2>
            <p className="text-gray-300">
              Our service requires integration with YouTube to verify channel memberships and subscriptions. By using our platform, you:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Authorize us to access your YouTube account information</li>
              <li>Confirm you have the right to grant such access</li>
              <li>Agree to YouTube&apos;s Terms of Service</li>
              <li>Understand that access can be revoked at any time</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">3. Airdrop Rules</h2>
            <p className="text-gray-300">
              Users must comply with the following rules:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Meet all eligibility criteria set by creators</li>
              <li>Maintain valid memberships/subscriptions during claim periods</li>
              <li>Not use automated systems or bots</li>
              <li>Not create multiple accounts to claim airdrops</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">4. Creator Obligations</h2>
            <p className="text-gray-300">
              Creators using our platform agree to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Provide accurate information about airdrops</li>
              <li>Have sufficient funds to cover promised rewards</li>
              <li>Not discriminate unfairly among eligible participants</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">5. Platform Rights</h2>
            <p className="text-gray-300">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Modify or terminate services at any time</li>
              <li>Remove users who violate these terms</li>
              <li>Change fees or payment methods</li>
              <li>Update these terms with notice to users</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">6. Limitation of Liability</h2>
            <p className="text-gray-300">
              Our platform is provided &quot;as is&quot; without warranties. We are not responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Actions of creators or users</li>
              <li>Technical issues with YouTube integration</li>
              <li>Cryptocurrency market fluctuations</li>
              <li>Loss of funds due to user error</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-400">7. Contact</h2>
            <p className="text-gray-300">
              For questions about these terms, contact us at: swaparup36@gmail.com
            </p>
          </section>

          <p className="text-sm text-gray-400 pt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </div>
    </div>
  );
}