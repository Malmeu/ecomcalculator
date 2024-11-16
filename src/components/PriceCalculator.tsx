import { useState, useEffect } from 'react';
import { Calculator, RefreshCcw, DollarSign, Package, Palette, MessageCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Language, TranslationKey, getTranslation } from '@/lib/i18n';
import { FormData } from '@/lib/types';
import { calculateFinalPrice } from '@/lib/calculator';
import { NumberInput } from '@/components/ui/NumberInput';
import { LanguageSelector } from '@/components/LanguageSelector';
import { PriceDisplay } from '@/components/PriceDisplay';
import { fetchBlackMarketRate } from '@/lib/api';
import { QuoteOfDay } from './QuoteOfDay';

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
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white">
            EcomCalculator <span className="text-blue-500">🚀</span>
          </h1>
          <p className="mt-2 text-gray-400">Optimisez vos marges, maximisez vos profits</p>
        </div>
        
        <QuoteOfDay />
      </div>

      <Card className={`max-w-2xl mx-auto p-6 sm:p-8 space-y-8 bg-gray-800/50 backdrop-blur-sm border-gray-700 ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="flex justify-end">
          <LanguageSelector value={lang} onChange={setLang} />
        </div>

        <div className="grid gap-6">
          <NumberInput
            icon={<DollarSign className="text-blue-400" />}
            label={t('basePrice')}
            value={formData.basePrice}
            onChange={(value) => handleInputChange('basePrice', value)}
            placeholder="0.00 DZD"
            required
          />

          <NumberInput
            icon={<Package className="text-purple-400" />}
            label={t('quantity')}
            value={formData.quantity}
            onChange={(value) => handleInputChange('quantity', value)}
            placeholder="1"
            min={1}
            step="1"
          />

          <NumberInput
            icon={<Palette className="text-pink-400" />}
            label={t('creative')}
            value={formData.creative}
            onChange={(value) => handleInputChange('creative', value)}
            placeholder="0.00 DZD"
            helperText="Ce coût sera divisé par la quantité de produits"
          />

          <NumberInput
            icon={<MessageCircle className="text-green-400" />}
            label={t('ads') + " (EUR)"}
            value={formData.ads}
            onChange={(value) => handleInputChange('ads', value)}
            placeholder="0.00 EUR"
            min={0}
          />
          <div className="flex gap-2 items-end">
            <NumberInput
              icon={<RotateCcw className="text-yellow-400" />}
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
            className="w-full p-2 border rounded bg-gray-700/50 border-gray-600 text-white font-semibold"
            value={formData.adsConversionType}
            onChange={(e) => handleInputChange('adsConversionType', e.target.value as 'message' | 'call')}
          >
            <option value="message" className="bg-gray-800 text-white">Conversion par message (×6)</option>
            <option value="call" className="bg-gray-800 text-white">Conversion par appel (×3)</option>
          </select>
          {formData.ads > 0 && (
            <div className="text-sm text-white">
              Coût en DZD: {(formData.ads * formData.eurToDzdRate).toFixed(2)} DZD
            </div>
          )}

          <NumberInput
            icon={<DollarSign className="text-green-400" />}
            label={t('returns') + " (Montant fixe en DZD)"}
            value={formData.returns}
            onChange={(value) => handleInputChange('returns', value)}
            placeholder="0.00 DZD"
            min={0}
          />
          <NumberInput
            icon={<DollarSign className="text-yellow-400" />}
            label={t('returns') + " (Pourcentage)"}
            value={formData.returnsPercentage}
            onChange={(value) => handleInputChange('returnsPercentage', value)}
            placeholder="0%"
            min={0}
            max={100}
            step="0.1"
          />

          <NumberInput
            icon={<DollarSign className="text-orange-400" />}
            label={t('risk') + " (% du prix de base)"}
            value={formData.risk}
            onChange={(value) => handleInputChange('risk', value)}
            placeholder="0%"
            min={0}
            max={100}
            step="0.1"
          />

          <NumberInput
            icon={<DollarSign className="text-purple-400" />}
            label={t('operational')}
            value={formData.operational}
            onChange={(value) => handleInputChange('operational', value)}
            placeholder="0.00 DZD"
          />

          <NumberInput
            icon={<DollarSign className="text-blue-400" />}
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
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
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
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20">
            <PriceDisplay
              price={finalPrice}
              currency={t('currency')}
              label={t('finalPrice')}
              lang={lang}
            />
          </div>
        )}
      </Card>
    </div>
  );
}