
import React, { useState, useMemo } from 'react';
import type { GeneratedContent as GeneratedContentType, ProductInfo } from '../types';
import { WhatsAppIcon, InstagramIcon, FacebookIcon, ThreadsIcon, MarketplaceIcon } from './IconComponents';

interface GeneratedContentProps {
  content: GeneratedContentType;
  imageUrl: string;
  shopInfo: Pick<ProductInfo, 'shopName' | 'gmapsLink' | 'waNumber' | 'productName'>;
}

type Platform = 'whatsapp' | 'instagram' | 'facebook' | 'threads' | 'marketplace';

const platformConfig = {
    whatsapp: { icon: WhatsAppIcon, name: 'WhatsApp', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/50' },
    instagram: { icon: InstagramIcon, name: 'Instagram', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/50' },
    facebook: { icon: FacebookIcon, name: 'Facebook', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/50' },
    threads: { icon: ThreadsIcon, name: 'Threads', color: 'text-gray-800', bg: 'bg-gray-100 dark:bg-gray-700' },
    marketplace: { icon: MarketplaceIcon, name: 'Marketplace', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/50' },
};

const GeneratedContent: React.FC<GeneratedContentProps> = ({ content, imageUrl, shopInfo }) => {
  const [activeTab, setActiveTab] = useState<Platform>('instagram');
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ [id]: true });
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
  };

  const waLink = useMemo(() => {
    const cleanWaNumber = shopInfo.waNumber.replace(/[^0-9]/g, '');
    const finalWaNumber = cleanWaNumber.startsWith('0') ? `62${cleanWaNumber.substring(1)}` : cleanWaNumber;
    const message = `Halo ${shopInfo.shopName}, saya tertarik dengan produk ${shopInfo.productName}.`;
    return `https://wa.me/${finalWaNumber}?text=${encodeURIComponent(message)}`;
  }, [shopInfo.waNumber, shopInfo.shopName, shopInfo.productName]);

  const downloadFilename = useMemo(() => {
    const sanitizedName = shopInfo.productName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    return `poster_${sanitizedName || 'produk'}.jpeg`;
  }, [shopInfo.productName]);
  
  return (
    <div className="space-y-8">
      {/* Poster Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Poster Promosi Anda</h3>
        <img src={imageUrl} alt="Poster Promosi Produk" className="w-full h-auto object-cover rounded-xl shadow-md" />
        <a
          href={imageUrl}
          download={downloadFilename}
          className="mt-4 inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span>Unduh Poster</span>
        </a>
      </div>

      {/* Captions Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Caption Siap Pakai</h3>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
            {(Object.keys(platformConfig) as Platform[]).map((platform) => {
              const { icon: Icon, name } = platformConfig[platform];
              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(platform)}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === platform
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {name}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="mt-4">
            {(Object.keys(platformConfig) as Platform[]).map((platform) => (
                <div key={platform} className={`${activeTab === platform ? 'block' : 'hidden'}`}>
                    <div className={`p-4 rounded-lg ${platformConfig[platform].bg}`}>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{content.captions[platform]}</p>
                    </div>
                    <button onClick={() => handleCopy(content.captions[platform], platform)} className="mt-3 bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-teal-600 transition-colors">
                        {copiedStates[platform] ? 'Tersalin!' : 'Salin Caption'}
                    </button>
                </div>
            ))}
        </div>
      </div>
      
      {/* Calendar Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Kalender Konten 7 Hari</h3>
        <ul className="space-y-4">
          {content.calendar.map((entry, index) => (
            <li key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-100 dark:bg-teal-900/70 text-teal-700 dark:text-teal-300 rounded-lg flex flex-col items-center justify-center font-bold">
                <span className="text-xs">Hari</span>
                <span className="text-xl">{index + 1}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{entry.day}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{entry.idea}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* WA Link & GMaps Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Link Penting untuk Pelanggan</h3>
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/50 p-4 rounded-lg">
                <div>
                    <p className="font-semibold text-green-800 dark:text-green-200">Link Order WhatsApp</p>
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 dark:text-green-400 break-all">{waLink}</a>
                </div>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 ml-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                    Tes Link
                </a>
            </div>
            {shopInfo.gmapsLink && (
                <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
                    <div>
                        <p className="font-semibold text-blue-800 dark:text-blue-200">Lokasi Google Maps</p>
                        <a href={shopInfo.gmapsLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 break-all">{shopInfo.gmapsLink}</a>
                    </div>
                    <a href={shopInfo.gmapsLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 ml-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        Lihat Peta
                    </a>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedContent;
