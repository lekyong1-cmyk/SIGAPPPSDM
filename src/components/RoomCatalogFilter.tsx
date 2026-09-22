import React from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  Sparkles, 
  RotateCcw,
  Check,
  Layers
} from 'lucide-react';

interface RoomCatalogFilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFloor: 'all' | 1 | 2;
  onFloorChange: (floor: 'all' | 1 | 2) => void;
  minCapacity: number;
  onMinCapacityChange: (cap: number) => void;
  selectedFacility: string;
  onFacilityChange: (fac: string) => void;
  onResetFilters: () => void;
}

const AVAILABLE_FACILITIES = [
  'Semua Fasilitas',
  'Smart Board',
  'Projector',
  'White Board',
  'AC',
  'WiFi',
];

export const RoomCatalogFilter: React.FC<RoomCatalogFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedFloor,
  onFloorChange,
  minCapacity,
  onMinCapacityChange,
  selectedFacility,
  onFacilityChange,
  onResetFilters,
}) => {
  const isFiltered =
    searchQuery !== '' ||
    selectedFloor !== 'all' ||
    minCapacity > 0 ||
    selectedFacility !== 'Semua Fasilitas';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top search & quick floor selection */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor ruangan (contoh: 202, 101) atau kata kunci..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition-all"
          />
        </div>

        {/* Floor Quick Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => onFloorChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedFloor === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Semua Lantai
          </button>
          <button
            onClick={() => onFloorChange(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedFloor === 1
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Lantai 1
          </button>
          <button
            onClick={() => onFloorChange(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedFloor === 2
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Lantai 2
          </button>
        </div>
      </div>

      {/* Facilities & Capacity Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Fasilitas:
          </span>

          {AVAILABLE_FACILITIES.map((fac) => {
            const isSelected = selectedFacility === fac;
            const isSmart = fac === 'Smart Board';

            return (
              <button
                key={fac}
                onClick={() => onFacilityChange(fac)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  isSelected
                    ? isSmart
                      ? 'bg-cyan-600 text-white shadow-2xs'
                      : 'bg-emerald-700 text-white shadow-2xs'
                    : isSmart
                    ? 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isSmart && <Sparkles className="w-3 h-3 text-cyan-200" />}
                <span>{fac}</span>
              </button>
            );
          })}
        </div>

        {/* Capacity Selector & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Kapasitas Min:</span>
            <select
              value={minCapacity}
              onChange={(e) => onMinCapacityChange(Number(e.target.value))}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value={0}>Semua (0+)</option>
              <option value={15}>≥ 15 Orang</option>
              <option value={30}>≥ 30 Orang</option>
              <option value={35}>≥ 35 Orang</option>
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
