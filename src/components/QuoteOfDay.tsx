import { useState, useEffect } from 'react';

const quotes = [
  { text: "Le succès n'est pas final, l'échec n'est pas fatal. C'est le courage de continuer qui compte.", author: "Winston Churchill" },
  { text: "Le meilleur moyen de prédire l'avenir est de le créer.", author: "Peter Drucker" },
  { text: "Les obstacles sont ces choses effrayantes que vous voyez lorsque vous détournez les yeux de votre objectif.", author: "Henry Ford" },
  // Ajoutez plus de citations...
];

export function QuoteOfDay() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Change la citation chaque jour
    const today = new Date().toDateString();
    const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % quotes.length;
    setQuote(quotes[index]);
  }, []);

  return (
    <div className="p-6 mb-8 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm">
      <p className="text-lg italic text-gray-200">"{quote.text}"</p>
      <p className="mt-2 text-sm text-gray-400">- {quote.author}</p>
    </div>
  );
} 