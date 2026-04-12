'use client'

interface NavPillsProps {
  items: Array<{ id: string; label: string; count?: number }>
  active: string
  onSelect: (id: string) => void
}

export function NavPills({ items, active, onSelect }: NavPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`px-4 py-2 rounded-full whitespace-nowrap font-mono text-sm transition-all flex-shrink-0 ${
            active === item.id
              ? 'bg-green-900/30 border border-green-700 text-green-400'
              : 'bg-gray-900/30 border border-gray-800 text-gray-400 hover:border-gray-700'
          }`}
        >
          {item.label}
          {item.count !== undefined && <span className="ml-2 text-gray-500">({item.count})</span>}
        </button>
      ))}
    </div>
  )
}
