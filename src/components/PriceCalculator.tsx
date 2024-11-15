import { useState, useEffect } from 'react';
import { Calculator, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Language, TranslationKey, getTranslation } from '@/lib/i18n';
import { FormData } from '@/lib/types';
import { calculateFinalPrice } from '@/lib/calculator';
import { NumberInput } from '@/components/ui/NumberInput';
import { LanguageSelector } from '@/components/LanguageSelector';
import { PriceDisplay } from '@/components/PriceDisplay';
import { fetchBlackMarketRate } from '@/lib/api';

export function PriceCalculator() {
  const [lang, setLang] = useState<Language>('en');
  const [formData, setFormData] = useState<FormData>({
    basePrice: 0,
    quantity: 1,
    creative: 0,
    ads: 0,
    adsConversionType: 'message',
    eurToDzdRate: 250.00,
    logistics: 0,
    returns: 0,
    returnsPercentage: 0,
    operational: 0,
    risk: 0,
    profit: 0
  });
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  const t = (key: TranslationKey) => getTranslation(lang, key);
  const isRTL = lang === 'ar';

  const handleInputChange = (field: keyof FormData, value: string | 'message' | 'call') => {
    if (field === 'adsConversionType') {
      setFormData((prev) => ({
        ...prev,
        adsConversionType: value as 'message' | 'call'
      }));
    } else {
      const numValue = value === '' ? 0 : Math.max(0, parseFloat(value as string));
      setFormData((prev) => ({
        ...prev,
        [field]: numValue,
      }));
    }
  };

  const updateExchangeRate = async () => {
    setIsLoadingRate(true);
    try {
      const rate = await fetchBlackMarketRate();
      setFormData(prev => ({
        ...prev,
        eurToDzdRate: rate
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du taux:', error);
    } finally {
      setIsLoadingRate(false);
    }
  };

  useEffect(() => {
    updateExchangeRate();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <Card className={`max-w-2xl mx-auto p-6 sm:p-8 space-y-8 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
          </div>
          <LanguageSelector value={lang} onChange={setLang} />
        </div>

        <div className="grid gap-6">
          <NumberInput
            label={t('basePrice')}
            value={formData.basePrice}
            onChange={(value) => handleInputChange('basePrice', value)}
            placeholder="0.00 DZD"
            required
          />

          <NumberInput
            label={t('quantity')}
            value={formData.quantity}
            onChange={(value) => handleInputChange('quantity', value)}
            placeholder="1"
            min={1}
            step="1"
          />

          <div className="space-y-4">
            <NumberInput
              label={t('creative')}
              value={formData.creative}
              onChange={(value) => handleInputChange('creative', value)}
              placeholder="0.00 DZD"
              helperText="Ce coût sera divisé par la quantité de produits"
            />
          </div>

          <div className="space-y-4">
            <NumberInput
              label={t('ads') + " (EUR)"}
              value={formData.ads}
              onChange={(value) => handleInputChange('ads', value)}
              placeholder="0.00 EUR"
              min={0}
            />
            <div className="flex gap-2 items-end">
              <NumberInput
                label="Taux de change EUR/DZD (Marché noir)"
                value={formData.eurToDzdRate}
                onChange={(value) => handleInputChange('eurToDzdRate', value)}
                placeholder="250.00"
                min={0}
                step="0.01"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={updateExchangeRate}
                disabled={isLoadingRate}
              >
                <RefreshCcw className={`h-4 w-4 ${isLoadingRate ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            {isLoadingRate && (
              <div className="text-sm text-muted-foreground">
                Chargement du taux en cours...
              </div>
            )}
            <select 
              className="w-full p-2 border rounded"
              value={formData.adsConversionType}
              onChange={(e) => handleInputChange('adsConversionType', e.target.value as 'message' | 'call')}
            >
              <option value="message">Conversion par message (×6)</option>
              <option value="call">Conversion par appel (×3)</option>
            </select>
            {formData.ads > 0 && (
              <div className="text-sm text-muted-foreground">
                Coût en DZD: {(formData.ads * formData.eurToDzdRate).toFixed(2)} DZD
              </div>
            )}
          </div>

          <div className="space-y-4">
            <NumberInput
              label={t('returns') + " (Montant fixe en DZD)"}
              value={formData.returns}
              onChange={(value) => handleInputChange('returns', value)}
              placeholder="0.00 DZD"
              min={0}
            />
            <NumberInput
              label={t('returns') + " (Pourcentage)"}
              value={formData.returnsPercentage}
              onChange={(value) => handleInputChange('returnsPercentage', value)}
              placeholder="0%"
              min={0}
              max={100}
              step="0.1"
            />
          </div>

          <NumberInput
            label={t('risk') + " (% du prix de base)"}
            value={formData.risk}
            onChange={(value) => handleInputChange('risk', value)}
            placeholder="0%"
            min={0}
            max={100}
            step="0.1"
          />

          <NumberInput
            label={t('operational')}
            value={formData.operational}
            onChange={(value) => handleInputChange('operational', value)}
            placeholder="0.00 DZD"
          />

          <NumberInput
            label={t('profit')}
            value={formData.profit}
            onChange={(value) => handleInputChange('profit', value)}
            placeholder="0.00 DZD"
            min={0}
            step="0.01"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            className="flex-1"
            onClick={() => setFinalPrice(calculateFinalPrice(formData))}
            disabled={!formData.basePrice}
          >
            <Calculator className="mr-2 h-4 w-4" />
            {t('calculate')}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setFormData({
                basePrice: 0,
                quantity: 1,
                creative: 0,
                ads: 0,
                adsConversionType: 'message',
                eurToDzdRate: 145.50,
                logistics: 0,
                returns: 0,
                returnsPercentage: 0,
                operational: 0,
                risk: 0,
                profit: 0
              });
              setFinalPrice(null);
            }}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {t('reset')}
          </Button>
        </div>

        {finalPrice !== null && (
          <PriceDisplay
            price={finalPrice}
            currency={t('currency')}
            label={t('finalPrice')}
            lang={lang}
          />
        )}
      </Card>
    </div>
  );
}