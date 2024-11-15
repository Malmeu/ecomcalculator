export async function fetchBlackMarketRate() {
  try {
    // Récupération des données depuis forexalgerie.com
    const response = await fetch('http://www.forexalgerie.com');
    const html = await response.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Chercher spécifiquement le taux de vente de l'Euro
    // Note: Il faudrait adapter le sélecteur selon la structure exacte du site
    const euroSellRate = doc.querySelector('table tr:contains("Euro") td:nth-child(3)')?.textContent;
    
    if (!euroSellRate) {
      console.warn('Taux de vente non trouvé sur forexalgerie.com');
      return 252.00; // Valeur par défaut pour la vente
    }
    
    // Convertir le taux en nombre
    const rate = parseFloat(euroSellRate.replace(/[^0-9.,]/g, '').replace(',', '.'));
    return rate || 252.00;
    
  } catch (error) {
    console.error('Erreur lors de la récupération du taux de vente sur forexalgerie.com:', error);
    return 252.00; // Valeur par défaut en cas d'erreur
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