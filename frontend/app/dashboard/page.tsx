'use client';

import MoodEntryForm from '@/components/MoodEntryForm';
import MoodChart from '@/components/MoodChart';

export default function DashboardPage() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">SymptoCare Dashboard</h1>
        <p className="text-gray-600">
          Track your moods and monitor your emotional trends over time.
        </p>
      </div>

      <div className="space-y-10">
        <MoodEntryForm />
        <MoodChart />
      </div>
    </section>
  );
}
