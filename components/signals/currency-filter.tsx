'use client'

interface CurrencyFilterProps {
  currencies: Array<{ code: string; label: string }>
  selected: string[]
  onSelect: (code: string) => void
}

export function CurrencyFilter({ currencies, selected, onSelect }: CurrencyFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {currencies.map((currency) => (
        <button
          key={currency.code}
          onClick={() => onSelect(currency.code)}
          className={`px-3 py-1.5 rounded-full text-sm font-mono whitespace-nowrap transition-all flex-shrink-0 ${
            selected.includes(currency.code)
              ? 'bg-blue-900/30 border border-blue-700 text-blue-400'
              : 'bg-gray-900/30 border border-gray-800 text-gray-400 hover:border-gray-700'
          }`}
        >
          {currency.code}
        </button>
      ))}
    </div>
  )
}
