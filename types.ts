
export interface ProductInfo {
  productName: string;
  description: string;
  targetAudience: string;
  promo: string;
  shopName: string;
  gmapsLink: string;
  waNumber: string;
  productImage: File | null;
}

export interface GeneratedCaptions {
  whatsapp: string;
  instagram: string;
  facebook: string;
  threads: string;
  marketplace: string;
}

export interface CalendarEntry {
  day: string;
  idea: string;
}

export interface GeneratedContent {
  captions: GeneratedCaptions;
  calendar: CalendarEntry[];
}
