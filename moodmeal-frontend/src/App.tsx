import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import MoodForm from './components/MoodForm';

type Suggestion = {
  name: string;
  benefits: string;
  ingredients: (string | { name: string; quantity?: string })[];
  preparation: string;
  prepTime?: string;
  difficulty?: string;
};

type RequestPayload = {
  mood: string;
  cycle: string;
  preference: string;
};

function App() {
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<RequestPayload | null>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (suggestion && suggestionRef.current) {
      setTimeout(() => {
        suggestionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [suggestion]);

  const handleSubmit = async (data: RequestPayload) => {
    setLoading(true);
    setError(null);
    setSuggestion(null);
    setLastPayload(data);

    try {
      const response = await axios.post('http://localhost:8080/api/suggest', data);
      const apiData = response.data;

      // Mapper les clés françaises/anglaises vers notre type Suggestion
      const cleanedData: Suggestion = {
        name: apiData.name || apiData.nom || apiData.remede || 'Sans nom',
        benefits: apiData.benefits || apiData.benefices || apiData.avantages || 'Aucun bénéfice spécifié',
        ingredients: (apiData.ingredients || apiData.ingrédients || []).map((ing: any) => {
          if (typeof ing === 'string') return ing;
          return {
            name: ing.name || ing.nom || '',
            quantity: ing.quantity || ing.quantité || ing.quantite
          };
        }),
        preparation: apiData.preparation || apiData.préparation || 'Aucune instruction',
        prepTime: apiData.prepTime || apiData.tempsPreparation || apiData.durée_de_préparation || '5 min',
        difficulty: apiData.difficulty || apiData.difficulté || apiData.niveau_de_difficulté || 'Facile'
      };

      setSuggestion(cleanedData);
    } catch (err) {
      console.error(err);
      setError('Impossible de générer la suggestion. Réessaie plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => lastPayload && handleSubmit(lastPayload);
  const handleNewChoice = () => {
    setSuggestion(null);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const formatBenefits = (benefits: string) => 
    benefits.split(/[.!]\s*/).filter(s => s).map(s => s.trim() + (s.endsWith('.') ? '' : '.'));

  const formatIngredient = (ing: string | { name: string; quantity?: string }) => {
    if (typeof ing === 'string') return ing;
    const name = ing.name || '';
    const quantity = ing.quantity || '';
    return quantity ? `${name} (${quantity})` : name;
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>
      <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
        <div className="text-center mb-3">
          <h1 className="text-6xl font-rounded font-bold text-rose-300 leading-none -mt-4">Mood</h1>
          <h1 className="text-6xl italic font-rounded font-extralight text-rose-400 mb-4 -mt-8">Meal</h1>
          <p className="text-gray-500 text-sm font-normal">Suggestions personnalisées selon ton humeur et ton cycle menstruel</p>
        </div>

        <div ref={formRef}>
          <MoodForm onSubmit={handleSubmit} />
        </div>

        {loading && (
          <div className="mt-8 flex flex-col items-center">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="mt-4 text-gray-500 text-sm">Génération en cours...</p>
          </div>
        )}
        {error && <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded text-center">{error}</div>}

        {suggestion && (
  <div ref={suggestionRef} className="mt-12 p-10 bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-2xl">
    <h2 className="text-3xl font-normal text-gray-800 tracking-wide mb-6">{suggestion.name}</h2>
    
    <div className="mb-6">
      <strong className="text-sm uppercase tracking-widest text-gray-400 block mb-3">Bienfaits</strong>
      <ul className="space-y-2 text-gray-600">
        {formatBenefits(suggestion.benefits).map((b,i)=> (
          <li key={i} className="flex items-start">
            <span className="text-rose-400 mr-2">•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
    
    <div className="mb-6">
      <strong className="text-sm uppercase tracking-widest text-gray-400 block mb-3">Ingrédients</strong>
      <ul className="space-y-2 text-gray-600">
        {suggestion.ingredients.map((ing,i)=> (
          <li key={i} className="flex items-start">
            <span className="text-rose-400 mr-2">•</span>
            <span>{formatIngredient(ing)}</span>
          </li>
        ))}
      </ul>
          </div>
          
          <div className="mb-6">
            <strong className="text-sm uppercase tracking-widest text-gray-400 block mb-3">Préparation</strong>
            <p className="text-gray-600 leading-relaxed">{suggestion.preparation}</p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
            <span>⏱ {suggestion.prepTime}</span>
            <span>•</span>
            <span>Difficulté: {suggestion.difficulty}</span>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleRetry}
              className="flex-1 py-3 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-all duration-200 text-sm font-normal tracking-wide"
            >
              ✨ Autre suggestion
            </button>
            <button 
              onClick={handleNewChoice}
              className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-full hover:border-rose-300 hover:text-rose-500 transition-all duration-200 text-sm font-normal tracking-wide"
            >
              Nouveau choix
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
