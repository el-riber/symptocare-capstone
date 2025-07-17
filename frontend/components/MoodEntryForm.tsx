'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";

export default function MoodEntryForm() {
  const [mood, setMood] = useState<number>(3);
  const [emoji, setEmoji] = useState('🙂');
  const [reflection, setReflection] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;
    if (!user_id) return;

    const { error } = await supabase.from('mood_entries').insert({
      user_id,
      mood,
      emoji,
      reflection,
    });

    if (!error) {
      setSuccess(true);
      setMood(3);
      setEmoji('🙂');
      setReflection('');
    }
  };

  return (
    <div className="bg-white border shadow-lg p-6 rounded-xl max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={`w-10 h-10 rounded-full text-xl ${mood === n ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setMood(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={emoji}
        onChange={(e) => setEmoji(e.target.value)}
        className="w-full border px-3 py-2 mb-4 rounded"
        placeholder="Emoji (e.g. 😊)"
      />
      <Textarea
        rows={4}
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="Write about your day..."
        className="mb-4"
      />
      <Button onClick={handleSubmit} className="w-full">
        Save Entry
      </Button>
      {success && <p className="text-green-600 mt-4">✅ Entry saved!</p>}
    </div>
  );
}
