'use client';

interface EventType {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface EventTypeCardsProps {
  eventTypes: EventType[];
  selectedEventType: string;
  onSelectEventType: (eventType: string) => void;
}

export function EventTypeCards({ eventTypes, selectedEventType, onSelectEventType }: EventTypeCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {eventTypes.map((event) => {
        const isSelected = selectedEventType === event.id;
        return (
          <button
            key={event.id}
            onClick={() => onSelectEventType(event.id)}
            className={`p-4 rounded-lg text-left transition-all ${
              isSelected
                ? 'bg-gradient-to-br from-purple-600/30 to-magenta-600/30 border-2 border-purple-500 shadow-lg shadow-purple-500/20'
                : 'bg-slate-800/40 border border-slate-700 hover:border-slate-600'
            }`}
          >
            <h3 className={`text-xl font-bold mb-1 ${isSelected ? 'text-purple-300' : 'text-white'}`}>
              {event.title}
            </h3>
            <p className="text-slate-400 text-sm mb-2">{event.description}</p>
            <p className={`text-xs font-mono ${isSelected ? 'text-purple-200' : 'text-slate-500'}`}>{event.date}</p>
          </button>
        );
      })}
    </div>
  );
}
