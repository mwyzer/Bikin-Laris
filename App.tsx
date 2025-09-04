
import React, { useState, useEffect } from 'react';
import ProductInputForm from './components/ProductInputForm';
import GeneratedContent from './components/GeneratedContent';
import LoadingSpinner from './components/LoadingSpinner';
import { generatePromotionalContent } from './services/geminiService';
import type { ProductInfo, GeneratedContent as GeneratedContentType } from './types';
import type { ThemeId } from './constants';

const App: React.FC = () => {
  const [theme, setTheme] = useState(() => {
    // Untuk lingkungan non-browser, default ke 'light'.
    if (typeof window === 'undefined' || !window.localStorage) {
      return 'light';
    }

    const storedTheme = localStorage.getItem('theme');
    // Jika ada tema yang tersimpan, gunakan itu.
    if (storedTheme) {
      return storedTheme === 'dark' ? 'dark' : 'light';
    }

    // Jika tidak, periksa preferensi sistem operasi pengguna.
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<{
    content: GeneratedContentType;
    imageUrl: string;
    shopInfo: Pick<ProductInfo, 'shopName' | 'gmapsLink' | 'waNumber' | 'productName'>
  } | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Simpan tema saat ini ke localStorage
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.error("Gagal menyimpan tema ke localStorage.", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSubmit = async (productInfo: ProductInfo, themeId: ThemeId) => {
    setIsLoading(true);
    setError(null);
    setGeneratedData(null);
    try {
      const { content, imageUrl } = await generatePromotionalContent(productInfo, themeId);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">BikinLaris AI</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Promosi UMKM Jadi Gampang</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          
          <div className="lg:sticky lg:top-24 self-start">
            <ProductInputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          <div className="mt-12 lg:mt-0">
            {isLoading && (
              <div className="flex justify-center items-center h-96">
                <LoadingSpinner />
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-600/50 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
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
                <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center transition-colors duration-300">
                    <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Hasil Promosi Akan Muncul di Sini</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">Lengkapi formulir di sebelah kiri dan biarkan AI kami membuatkan materi promosi yang akan melariskan jualan Anda!</p>
                </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Dibuat dengan ❤️ untuk kemajuan UMKM Indonesia.</p>
      </footer>
    </div>
  );
};

export default App;
