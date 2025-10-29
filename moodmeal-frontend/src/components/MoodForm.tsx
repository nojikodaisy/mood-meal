import { useState } from 'react';

type MoodFormProps = {
  onSubmit: (data: { mood: string; cycle: string; preference: string }) => void;
};

export default function MoodForm({ onSubmit }: MoodFormProps) {
  const [mood, setMood] = useState('');
  const [cycle, setCycle] = useState('');
  const [preference, setPreference] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mood && cycle && preference) {
      onSubmit({ mood, cycle, preference });
    }
  };

  const moods = [
    { value: 'happy', label: '😊 Joyeuse', color: 'bg-yellow-400 hover:bg-yellow-500' },
    { value: 'sad', label: '😢 Triste', color: 'bg-blue-400 hover:bg-blue-500' },
    { value: 'stressed', label: '😰 Stressée', color: 'bg-red-400 hover:bg-red-500' },
    { value: 'tired', label: '😴 Fatiguée', color: 'bg-purple-400 hover:bg-purple-500' },
    { value: 'energetic', label: '⚡ Énergique', color: 'bg-green-400 hover:bg-green-500' }
  ];

  const cycles = [
    { value: 'menstrual', label: '🩸 Menstruelle', desc: 'Jours 1-5' },
    { value: 'follicular', label: '🌱 Folliculaire', desc: 'Jours 6-13' },
    { value: 'ovulation', label: '🌟 Ovulation', desc: 'Jours 14-16' },
    { value: 'luteal', label: '🌙 Lutéale', desc: 'Jours 17-28' }
  ];

  const preferences = [
    { value: 'warm', label: '☕ Chaud' },
    { value: 'cold', label: '🧊 Froid' },
    { value: 'herbal', label: '🌿 Infusion' },
    { value: 'sweet', label: '🍯 Sucré' },
    { value: 'any', label: '✨ Peu importe' }
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-10 border-t-4 border-rose-300 border-r border-l border-b border-gray-200 rounded-s-lg shadow-sm">
      {/* Humeur */}
      <div className="mb-10">
        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 bg-rose-100 text-rose-600 rounded-full text-xs">1</span>
          Comment te sens-tu ?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {moods.map(m => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(mood === m.value ? '' : m.value)}
              className={`p-4 border rounded-full transition-all duration-300 text-sm transform hover:-translate-y-1 hover:shadow-md ${
                mood === m.value
                  ? 'border-rose-300 bg-rose-50 text-gray-700 font-medium'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cycle */}
      <div className="mb-10">
        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 bg-rose-100 text-rose-600 rounded-full text-xs">2</span>
          Phase du cycle
        </label>
        <div className="grid grid-cols-2 gap-3">
          {cycles.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCycle(cycle === c.value ? '' : c.value)}
              className={`p-4 border rounded-full transition-all duration-300 text-left text-sm transform hover:-translate-y-1 hover:shadow-md ${
                cycle === c.value
                  ? 'border-rose-300 bg-rose-50 text-gray-700 font-medium'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <div>{c.label}</div>
              <div className="text-xs text-gray-400 mt-1">{c.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Préférence */}
      <div className="mb-10">
        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-4 font-medium flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 bg-rose-100 text-rose-600 rounded-full text-xs">3</span>
          Type de boisson
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {preferences.map(p => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPreference(preference === p.value ? '' : p.value)}
              className={`p-4 border rounded-full transition-all duration-300 text-sm transform hover:-translate-y-1 hover:shadow-md ${
                preference === p.value
                  ? 'border-rose-300 bg-rose-50 text-gray-700 font-medium'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bouton submit */}
      <button
        type="submit"
        disabled={!mood || !cycle || !preference}
        className={`w-full py-4 rounded-full text-sm font-normal tracking-wide transition-all duration-200 ${
          mood && cycle && preference
            ? 'bg-rose-400 text-white hover:bg-rose-500 cursor-pointer'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
        }`}
      >
        ✨ Générer ma suggestion personnalisée
      </button>
    </form>
  );
}