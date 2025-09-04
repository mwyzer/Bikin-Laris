
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
    whatsapp: { icon: WhatsAppIcon, name: 'WhatsApp', color: 'text-green-500', bg: 'bg-green-50' },
    instagram: { icon: InstagramIcon, name: 'Instagram', color: 'text-pink-500', bg: 'bg-pink-50' },
    facebook: { icon: FacebookIcon, name: 'Facebook', color: 'text-blue-600', bg: 'bg-blue-50' },
    threads: { icon: ThreadsIcon, name: 'Threads', color: 'text-gray-800', bg: 'bg-gray-100' },
    marketplace: { icon: MarketplaceIcon, name: 'Marketplace', color: 'text-orange-500', bg: 'bg-orange-50' },
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
  
  return (
    <div className="space-y-8">
      {/* Poster Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Poster Promosi Anda</h3>
        <img src={imageUrl} alt="Poster Promosi Produk" className="w-full h-auto object-cover rounded-xl shadow-md" />
      </div>

      {/* Captions Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Caption Siap Pakai</h3>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            {(Object.keys(platformConfig) as Platform[]).map((platform) => {
              const { icon: Icon, name } = platformConfig[platform];
              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(platform)}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === platform
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                        <p className="text-gray-700 whitespace-pre-wrap">{content.captions[platform]}</p>
                    </div>
                    <button onClick={() => handleCopy(content.captions[platform], platform)} className="mt-3 bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-teal-600 transition-colors">
                        {copiedStates[platform] ? 'Tersalin!' : 'Salin Caption'}
                    </button>
                </div>
            ))}
        </div>
      </div>
      
      {/* Calendar Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Kalender Konten 7 Hari</h3>
        <ul className="space-y-4">
          {content.calendar.map((entry, index) => (
            <li key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-100 text-teal-700 rounded-lg flex flex-col items-center justify-center font-bold">
                <span className="text-xs">Hari</span>
                <span className="text-xl">{index + 1}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{entry.day}</p>
                <p className="text-gray-600 text-sm">{entry.idea}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* WA Link & GMaps Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Link Penting untuk Pelanggan</h3>
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                <div>
                    <p className="font-semibold text-green-800">Link Order WhatsApp</p>
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 break-all">{waLink}</a>
                </div>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 ml-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                    Tes Link
                </a>
            </div>
            {shopInfo.gmapsLink && (
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                    <div>
                        <p className="font-semibold text-blue-800">Lokasi Google Maps</p>
                        <a href={shopInfo.gmapsLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 break-all">{shopInfo.gmapsLink}</a>
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
