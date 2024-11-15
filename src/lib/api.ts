export async function fetchBlackMarketRate() {
  try {
    const response = await fetch('/api/exchange-rate');
    const data = await response.json();
    return data.rate;
  } catch (error) {
    console.error('Erreur lors de la récupération du taux:', error);
    return 252.00;
  }
}

// Fonction alternative utilisant une API de backup en cas d'échec
export async function fetchBlackMarketRateBackup() {
  try {
    const response = await fetch('https://api.exchangerate.host/convert?from=EUR&to=DZD');
    const data = await response.json();
    
    // Applique un multiplicateur plus élevé pour le taux de vente du marché noir
    const blackMarketSellMultiplier = 1.37; // Légèrement plus élevé que le taux d'achat
    const officialRate = data.result;
    const blackMarketSellRate = officialRate * blackMarketSellMultiplier;
    
    return Math.round(blackMarketSellRate * 100) / 100;
  } catch (error) {
    console.error('Erreur lors de la récupération du taux de backup:', error);
    return 252.00;
  }
}

export async function getBlackMarketRate() {
  try {
    // Essayer d'abord forexalgerie.com
    const rate = await fetchBlackMarketRate();
    if (rate !== 252.00) return rate;
    
    // Si ça échoue, utiliser le backup
    return await fetchBlackMarketRateBackup();
  } catch (error) {
    console.error('Toutes les tentatives ont échoué:', error);
    return 252.00;
  }
} 