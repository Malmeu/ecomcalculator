export interface FormData {
  basePrice: number;
  quantity: number;
  creative: number;
  ads: number;
  adsConversionType: 'message' | 'call';
  eurToDzdRate: number;
  logistics: number;
  returns: number;
  returnsPercentage: number;
  operational: number;
  risk: number;
  profit: number;
}

export const initialFormData: FormData = {
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
  profit: 0,
};