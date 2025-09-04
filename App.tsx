
import React, { useState } from 'react';
import ProductInputForm from './components/ProductInputForm';
import GeneratedContent from './components/GeneratedContent';
import LoadingSpinner from './components/LoadingSpinner';
import { generatePromotionalContent } from './services/geminiService';
import type { ProductInfo, GeneratedContent as GeneratedContentType } from './types';
import type { ThemeId } from './constants';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<{
    content: GeneratedContentType;
    imageUrl: string;
    shopInfo: Pick<ProductInfo, 'shopName' | 'gmapsLink' | 'waNumber' | 'productName'>
  } | null>(null);

  const handleSubmit = async (productInfo: ProductInfo, theme: ThemeId) => {
    setIsLoading(true);
    setError(null);
    setGeneratedData(null);
    try {
      const { content, imageUrl } = await generatePromotionalContent(productInfo, theme);
      setGeneratedData({ 
        content, 
        imageUrl, 
        shopInfo: {
          shopName: productInfo.shopName,
          gmapsLink: productInfo.gmapsLink,
          waNumber: productInfo.waNumber,
          productName: productInfo.productName
        } 
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">BikinLaris AI</h1>
              <p className="text-sm text-gray-500">Promosi UMKM Jadi Gampang</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          
          {/* Left Column: Input */}
          <div className="lg:sticky lg:top-8 self-start">
            <ProductInputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Right Column: Output */}
          <div className="mt-12 lg:mt-0">
            {isLoading && (
              <div className="flex justify-center items-center h-96">
                <LoadingSpinner />
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {generatedData && (
              <GeneratedContent 
                content={generatedData.content} 
                imageUrl={generatedData.imageUrl} 
                shopInfo={generatedData.shopInfo}
              />
            )}
             {!isLoading && !generatedData && !error && (
                <div className="flex flex-col items-center justify-center h-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Hasil Promosi Akan Muncul di Sini</h2>
                    <p className="text-gray-500 mt-2 max-w-md">Lengkapi formulir di sebelah kiri dan biarkan AI kami membuatkan materi promosi yang akan melariskan jualan Anda!</p>
                </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-gray-500">
        <p>Dibuat dengan ❤️ untuk kemajuan UMKM Indonesia.</p>
      </footer>
    </div>
  );
};

export default App;
