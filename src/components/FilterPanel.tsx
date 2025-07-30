// src/components/FilterPanel.tsx
'use client';

// هذا المكون مسؤول فقط عن عرض خيارات الفلترة
// ولا يحتوي على أي منطق معقد

interface FilterPanelProps {
  filters: {
    crimeType: string;
    timeRange: string;
  };
  onFiltersChange: (newFilters: FilterPanelProps['filters']) => void;
}

const crimeTypes = [
  { value: 'all', label: 'Alla brott' },
  { value: 'Inbrott', label: 'Inbrott' },
  { value: 'Stöld', label: 'Stöld' },
  { value: 'Skadegörelse', label: 'Skadegörelse' },
  { value: 'Misshandel', label: 'Misshandel' },
  { value: 'Rån', label: 'Rån' },
];

const timeRanges = [
  { value: '24h', label: 'Senaste 24 timmarna' },
  { value: '7d', label: 'Senaste 7 dagarna' },
  { value: '30d', label: 'Senaste 30 dagarna' },
];

export default function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  
  const handleFilterChange = (filterName: keyof FilterPanelProps['filters'], value: string) => {
    onFiltersChange({
      ...filters,
      [filterName]: value,
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg border">
      <h2 className="text-lg font-semibold mb-4">Filter</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brottstyp
          </label>
          <select
            value={filters.crimeType}
            onChange={(e) => handleFilterChange('crimeType', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {crimeTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tidsperiod
          </label>
          <select
            value={filters.timeRange}
            onChange={(e) => handleFilterChange('timeRange', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}