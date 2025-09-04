
import React, { useState } from 'react';
import type { ProductInfo } from '../types';
import { THEMES } from '../constants';
import type { ThemeId } from '../constants';

interface ProductInputFormProps {
  onSubmit: (productInfo: ProductInfo, theme: ThemeId) => void;
  isLoading: boolean;
}

const ProductInputForm: React.FC<ProductInputFormProps> = ({ onSubmit, isLoading }) => {
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    productName: '',
    description: '',
    targetAudience: '',
    promo: '',
    shopName: '',
    gmapsLink: '',
    waNumber: '',
    productImage: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('modern');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductInfo((prev) => ({ ...prev, productImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productInfo.productImage) {
        alert("Mohon unggah foto produk Anda.");
        return;
    }
    onSubmit(productInfo, selectedTheme);
  };
  
  const isFormIncomplete = !productInfo.productName || !productInfo.description || !productInfo.shopName || !productInfo.waNumber || !productInfo.productImage;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Info Produk & Toko</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Lengkapi data berikut untuk hasil maksimal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label htmlFor="shopName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Toko/UMKM <span className="text-red-500">*</span></label>
          <input type="text" name="shopName" id="shopName" value={productInfo.shopName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Contoh: Kedai Kopi Senja" />
        </div>
        <div className="space-y-1">
          <label htmlFor="productName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Produk <span className="text-red-500">*</span></label>
          <input type="text" name="productName" id="productName" value={productInfo.productName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Contoh: Es Kopi Susu Gula Aren" />
        </div>
      </div>
      
      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi Singkat Produk <span className="text-red-500">*</span></label>
        <textarea name="description" id="description" value={productInfo.description} onChange={handleChange} required rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Jelaskan keunikan produk Anda. Contoh: Dibuat dari biji kopi pilihan dengan rasa manis legit gula aren asli."></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label htmlFor="targetAudience" className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Audiens</label>
            <input type="text" name="targetAudience" id="targetAudience" value={productInfo.targetAudience} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Contoh: Mahasiswa, pekerja kantor" />
          </div>
          <div className="space-y-1">
            <label htmlFor="promo" className="text-sm font-medium text-gray-700 dark:text-gray-300">Info Promo (jika ada)</label>
            <input type="text" name="promo" id="promo" value={productInfo.promo} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Contoh: Beli 2 Gratis 1" />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label htmlFor="waNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nomor WhatsApp <span className="text-red-500">*</span></label>
          <input type="tel" name="waNumber" id="waNumber" value={productInfo.waNumber} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Contoh: 081234567890" />
        </div>
        <div className="space-y-1">
          <label htmlFor="gmapsLink" className="text-sm font-medium text-gray-700 dark:text-gray-300">Link Google Maps</label>
          <input type="url" name="gmapsLink" id="gmapsLink" value={productInfo.gmapsLink} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Opsional, untuk pembeli offline" />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Foto Produk <span className="text-red-500">*</span></label>
        <div className="flex items-center space-x-6">
          <div className="shrink-0">
            {imagePreview ? (
              <img className="h-20 w-20 object-cover rounded-lg" src={imagePreview} alt="Pratinjau Produk" />
            ) : (
              <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            )}
          </div>
          <label className="block">
            <span className="sr-only">Pilih foto</span>
            <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} required
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-900/50 dark:file:text-teal-300 dark:hover:file:bg-teal-900"
            />
          </label>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Pilih Tema Poster</h4>
        <div className="flex flex-wrap gap-2">
            {THEMES.map(theme => (
                <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id as ThemeId)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${selectedTheme === theme.id ? 'bg-teal-500 text-white ring-2 ring-offset-2 ring-teal-500 dark:ring-offset-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                >
                    {theme.name}
                </button>
            ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || isFormIncomplete}
        className="w-full flex justify-center items-center gap-2 bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memproses...
          </>
        ) : (
            'Buat Materi Promosi Sekarang!'
        )}
      </button>
    </form>
  );
};

export default ProductInputForm;
