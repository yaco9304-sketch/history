import { motion } from 'framer-motion';
import { Nation } from '../../types';

interface GameMapProps {
  territories: Record<string, Nation | null>;
  onRegionClick?: (regionId: string) => void;
}

// 간단한 삼국시대 지도 (SVG)
export const GameMap = ({ territories, onRegionClick }: GameMapProps) => {
  const getNationColor = (nation: Nation | null) => {
    if (!nation) return '#4a5568'; // gray
    const colors = {
      goguryeo: '#ef4444',
      baekje: '#3b82f6',
      silla: '#f97316',
    };
    return colors[nation];
  };

  // 지역 데이터 (간소화된 한반도)
  const regions = [
    // 고구려 영역 (북부)
    { id: 'pyongyang', name: '평양', path: 'M120,50 L180,50 L200,90 L160,110 L100,90 Z', defaultNation: 'goguryeo' as Nation },
    { id: 'gungnae', name: '국내성', path: 'M180,30 L240,30 L250,70 L200,90 L180,50 Z', defaultNation: 'goguryeo' as Nation },
    { id: 'north1', name: '북부', path: 'M60,60 L120,50 L100,90 L60,100 Z', defaultNation: 'goguryeo' as Nation },
    
    // 백제 영역 (서남부)
    { id: 'hanseong', name: '한성', path: 'M80,120 L140,110 L150,160 L100,170 L70,150 Z', defaultNation: 'baekje' as Nation },
    { id: 'sabi', name: '사비', path: 'M60,160 L100,170 L110,220 L70,230 L50,200 Z', defaultNation: 'baekje' as Nation },
    { id: 'west', name: '서부', path: 'M50,110 L80,120 L70,150 L60,160 L40,140 Z', defaultNation: 'baekje' as Nation },
    
    // 신라 영역 (동남부)
    { id: 'gyeongju', name: '경주', path: 'M200,180 L250,170 L260,220 L220,240 L190,220 Z', defaultNation: 'silla' as Nation },
    { id: 'geumgwan', name: '금관가야', path: 'M150,220 L190,220 L200,260 L160,270 L140,250 Z', defaultNation: 'silla' as Nation },
    { id: 'east', name: '동부', path: 'M200,120 L250,110 L260,160 L250,170 L200,180 L180,150 Z', defaultNation: 'silla' as Nation },
    
    // 중부 지역 (분쟁 지역)
    { id: 'hangang', name: '한강유역', path: 'M140,110 L200,120 L180,150 L150,160 Z', defaultNation: null },
    { id: 'central', name: '중부', path: 'M150,160 L180,150 L200,180 L190,220 L150,220 L110,220 L100,170 Z', defaultNation: null },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-900/50 rounded-2xl overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/50" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      />

      <svg
        viewBox="0 0 300 300"
        className="w-full h-full max-w-md"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
      >
        {/* Water background */}
        <rect x="0" y="0" width="300" height="300" fill="#1e3a5f" opacity="0.3" />
        
        {/* Regions */}
        {regions.map((region) => {
          const nation = territories[region.id] ?? region.defaultNation;
          const color = getNationColor(nation);
          
          return (
            <motion.g key={region.id}>
              {/* Region shape */}
              <motion.path
                d={region.path}
                fill={color}
                stroke="#1a1a2e"
                strokeWidth="2"
                className="cursor-pointer"
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1, scale: 1.02 }}
                onClick={() => onRegionClick?.(region.id)}
                style={{ transformOrigin: 'center' }}
              />
              
              {/* Region label */}
              <text
                x={getPathCenter(region.path).x}
                y={getPathCenter(region.path).y}
                textAnchor="middle"
                className="text-[8px] fill-white font-medium pointer-events-none"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
              >
                {region.name}
              </text>
            </motion.g>
          );
        })}

        {/* Legend */}
        <g transform="translate(10, 260)">
          <rect x="0" y="0" width="80" height="35" fill="rgba(0,0,0,0.5)" rx="4" />
          <circle cx="12" cy="10" r="4" fill="#ef4444" />
          <text x="20" y="13" className="text-[7px] fill-white">고구려</text>
          <circle cx="50" cy="10" r="4" fill="#3b82f6" />
          <text x="58" y="13" className="text-[7px] fill-white">백제</text>
          <circle cx="12" cy="25" r="4" fill="#f97316" />
          <text x="20" y="28" className="text-[7px] fill-white">신라</text>
          <circle cx="50" cy="25" r="4" fill="#4a5568" />
          <text x="58" y="28" className="text-[7px] fill-white">중립</text>
        </g>
      </svg>
    </div>
  );
};

// 경로의 중심점 계산 (간단한 버전)
function getPathCenter(path: string): { x: number; y: number } {
  const coords = path.match(/\d+/g)?.map(Number) || [];
  if (coords.length < 2) return { x: 0, y: 0 };
  
  let sumX = 0, sumY = 0, count = 0;
  for (let i = 0; i < coords.length - 1; i += 2) {
    sumX += coords[i];
    sumY += coords[i + 1];
    count++;
  }
  
  return { x: sumX / count, y: sumY / count };
}
