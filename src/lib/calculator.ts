import { FormData } from './types';

export const calculateFinalPrice = (formData: FormData) => {
  // Prix de base
  let finalPrice = formData.basePrice;

  // Ajout du coût créatif divisé par la quantité
  finalPrice += formData.creative / formData.quantity;

  // Calcul des coûts publicitaires selon le type de conversion et conversion EUR vers DZD
  const adsMultiplier = formData.adsConversionType === 'message' ? 6 : 3;
  const adsInDzd = formData.ads * formData.eurToDzdRate;
  finalPrice += adsInDzd * adsMultiplier;

  // Ajout des retours (montant fixe + pourcentage du prix de base)
  finalPrice += formData.returns;
  finalPrice += (formData.basePrice * formData.returnsPercentage / 100);

  // Ajout de la marge de risque (pourcentage du prix de base)
  finalPrice += (formData.basePrice * formData.risk / 100);

  // Ajout des autres coûts
  finalPrice += formData.logistics;
  finalPrice += formData.operational;
  finalPrice += formData.profit;

  return finalPrice;
};