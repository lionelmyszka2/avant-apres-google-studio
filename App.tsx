import React, { useState } from 'react';
import { Download, ArrowLeftRight, Settings, Image as ImageIcon, ExternalLink, HelpCircle } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { SliderPreview } from './components/SliderPreview';
import { generateStandaloneHtml } from './utils/htmlGenerator';
import { SliderConfig } from './types';

const INITIAL_CONFIG: SliderConfig = {
  orientation: 'horizontal',
  beforeLabel: '',
  afterLabel: '',
  sliderColor: '#3b82f6', // blue-500
  initialPosition: 50,
};

const App: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [config, setConfig] = useState<SliderConfig>(INITIAL_CONFIG);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSwap = () => {
    setBeforeImage(afterImage);
    setAfterImage(beforeImage);
  };

  const handleDownload = () => {
    if (!beforeImage || !afterImage) return;

    const htmlContent = generateStandaloneHtml(beforeImage, afterImage, config);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notion-avant-apres.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ImageIcon className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Notion Slider Gen</h1>
          </div>
          <button 
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
          >
            <HelpCircle size={18} />
            Comment l'intégrer dans Notion ?
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Instructions Panel */}
        {showInstructions && (
          <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-indigo-900 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <ExternalLink size={20} />
              Guide d'intégration Notion
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-indigo-800">
              <li>Téléchargez le fichier HTML généré via le bouton ci-dessous.</li>
              <li>Hébergez ce fichier en ligne. Options gratuites et rapides :
                <ul className="list-disc list-inside pl-5 mt-1 opacity-80">
                  <li><strong>GitHub Pages</strong> (Recommandé pour la pérennité)</li>
                  <li><strong>Netlify Drop</strong> (Glissez-déposez le fichier, c'est instantané)</li>
                  <li><strong>Votre propre site web</strong> (via FTP ou gestionnaire de fichiers)</li>
                </ul>
              </li>
              <li>Copiez l'URL publique de votre fichier (ex: <code>https://mon-site.com/slider.html</code>).</li>
              <li>Dans Notion, tapez <code>/embed</code> (ou <code>/intégrer</code>).</li>
              <li>Collez l'URL. C'est tout !</li>
            </ol>
            <button 
              onClick={() => setShowInstructions(false)}
              className="mt-4 text-xs font-semibold uppercase tracking-wide text-indigo-600 hover:text-indigo-800"
            >
              Fermer le guide
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* LEFT COLUMN: Controls & Uploads */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Settings size={20} />
                Images
              </h2>
              
              <ImageUploader 
                label="Image Avant (Dessous)" 
                image={beforeImage} 
                onImageUpload={setBeforeImage}
                onRemove={() => setBeforeImage(null)}
              />

              <div className="flex justify-center -my-2 relative z-10">
                <button 
                  onClick={handleSwap}
                  className="bg-white border border-gray-200 hover:border-indigo-500 hover:text-indigo-600 p-2 rounded-full shadow-sm transition-all"
                  title="Échanger les images"
                >
                  <ArrowLeftRight size={18} />
                </button>
              </div>

              <ImageUploader 
                label="Image Après (Dessus)" 
                image={afterImage} 
                onImageUpload={setAfterImage}
                onRemove={() => setAfterImage(null)}
              />
            </div>

            {/* Config Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Paramètres</h2>
              
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Orientation</span>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <button
                      onClick={() => setConfig({ ...config, orientation: 'horizontal' })}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md border transition-colors ${
                        config.orientation === 'horizontal' 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Horizontal
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, orientation: 'vertical' })}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md border-t border-b border-r transition-colors ${
                        config.orientation === 'vertical' 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Vertical
                    </button>
                  </div>
                </label>

                <label>
                  <span className="text-sm font-medium text-gray-700">Couleur du curseur</span>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      type="color"
                      value={config.sliderColor}
                      onChange={(e) => setConfig({ ...config, sliderColor: e.target.value })}
                      className="h-9 w-14 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="text-sm text-gray-500 uppercase">{config.sliderColor}</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={!beforeImage || !afterImage}
              className={`
                w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all
                ${!beforeImage || !afterImage 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:-translate-y-1'
                }
              `}
            >
              <Download size={24} />
              Télécharger le fichier HTML
            </button>
            <p className="text-center text-xs text-gray-400">
              Fichier autonome prêt à être intégré dans Notion.
            </p>

          </div>

          {/* RIGHT COLUMN: Preview */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Aperçu en direct</h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Interactif
                </div>
              </div>
              
              <div className="flex-1 p-6 flex items-center justify-center bg-gray-50/50 rounded-b-xl overflow-auto">
                {!beforeImage || !afterImage ? (
                  <div className="text-center text-gray-400 max-w-sm">
                    <div className="bg-gray-100 w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <ImageIcon size={32} className="opacity-50" />
                    </div>
                    <p className="font-medium">En attente d'images</p>
                    <p className="text-sm mt-1">Chargez vos images "Avant" et "Après" pour générer votre curseur.</p>
                  </div>
                ) : (
                  <div className="w-full flex justify-center">
                    <SliderPreview 
                      beforeImage={beforeImage}
                      afterImage={afterImage}
                      config={config}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;