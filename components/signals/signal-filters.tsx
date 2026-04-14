'use client';

interface SignalFiltersProps {
  selectedAssets: string[];
  setSelectedAssets: (assets: string[]) => void;
  selectedConfidence: string;
  setSelectedConfidence: (confidence: string) => void;
}

export function SignalFilters({
  selectedAssets,
  setSelectedAssets,
  selectedConfidence,
  setSelectedConfidence,
}: SignalFiltersProps) {
  const assets = ['GBPUSD', 'XAUUSD', 'EURUSD'];
  const confidenceLevels = [
    { value: 'all', label: 'All Confidence Levels' },
    { value: 'high', label: 'High (75%+)' },
    { value: 'medium', label: 'Medium (60-75%)' },
    { value: 'low', label: 'Low (<60%)' },
  ];

  const toggleAsset = (asset: string) => {
    setSelectedAssets(
      selectedAssets.includes(asset)
        ? selectedAssets.filter((a) => a !== asset)
        : [...selectedAssets, asset]
    );
  };

  return (
    <div className="space-y-4">
      {/* Asset Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {assets.map((asset) => (
          <button
            key={asset}
            onClick={() => toggleAsset(asset)}
            className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
              selectedAssets.includes(asset)
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}
          >
            {asset}
          </button>
        ))}
      </div>

      {/* Confidence Filter */}
      <div className="flex flex-wrap gap-2">
        {confidenceLevels.map((level) => (
          <button
            key={level.value}
            onClick={() => setSelectedConfidence(level.value)}
            className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
              selectedConfidence === level.value
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}
