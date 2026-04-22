import { useCallback, useEffect, useState } from 'react';
import { LoadoutsResponse } from './types';

const MOCK_DATA: LoadoutsResponse = {
  sections: [
    {
      title: 'Absolute Meta',
      data: [
        {
          id: '1',
          title: 'Renetti',
          weaponType: 'Pistola',
          game: 'MWIII',
          tier: 'absolute_meta',
          tierLabel: 'ABSOLUTE META',
          thumbnailUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=800&auto=format&fit=crop',
          attachments: [
            { slot: 'Boca', name: 'Zehmn35 Compensated' },
            { slot: 'Cano', name: 'MLX-Short Barrel' },
            { slot: 'Mira', name: 'Slate Reflector' },
            { slot: 'Carregador', name: '50 Round Drum' },
            { slot: 'Kit de Conversão', name: 'Jak Ferocity' }
          ],
          code: 'RENETTI-META-01'
        },
        {
          id: '2',
          title: 'HRM-9',
          weaponType: 'SMG',
          game: 'MWIII',
          tier: 'absolute_meta',
          tierLabel: 'ABSOLUTE META',
          thumbnailUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=800&auto=format&fit=crop',
          attachments: [
            { slot: 'Boca', name: 'L4R Flash Hider' },
            { slot: 'Cano', name: 'Princeps Long Barrel' },
            { slot: 'Coronha', name: 'Folding Stock' },
            { slot: 'Sob o Cano', name: 'DR-6 Handstop' },
            { slot: 'Carregador', name: '50 Round Drum' }
          ],
          code: 'HRM9-META-02'
        }
      ]
    },
    {
      title: 'Competitive',
      data: [
        {
          id: '3',
          title: 'RAM-9',
          weaponType: 'SMG',
          game: 'MWIII',
          tier: 'competitive',
          tierLabel: 'COMPETITIVE',
          thumbnailUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=800&auto=format&fit=crop',
          attachments: [
            { slot: 'Boca', name: 'Spiral V3.5 Flash' },
            { slot: 'Cano', name: 'Speedtrack Barrel' },
            { slot: 'Sob o Cano', name: 'Bruen Heavy Support' },
            { slot: 'Pente', name: '50 Round Mag' }
          ]
        }
      ]
    }
  ],
  filters: {
    gunTypes: ['Pistola', 'SMG', 'Fuzil de Assalto', 'Sniper']
  }
};

export const useLoadouts = (filters?: { gun_type?: string[] }) => {
  const [data, setData] = useState<LoadoutsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const filtersKey = JSON.stringify(filters ?? {});

  const fetchLoadouts = useCallback(async (refetch = false) => {
    if (refetch) setIsRefetching(true);
    else setIsLoading(true);

    // Simulando delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));

    let filteredSections = MOCK_DATA.sections;

    if (filters?.gun_type && filters.gun_type.length > 0) {
      filteredSections = MOCK_DATA.sections.map(section => ({
        ...section,
        data: section.data.filter(item => 
          filters.gun_type!.includes(item.weaponType)
        )
      })).filter(section => section.data.length > 0);
    }

    setData({
      ...MOCK_DATA,
      sections: filteredSections
    });
    setIsLoading(false);
    setIsRefetching(false);
  }, [filters]);

  useEffect(() => {
    fetchLoadouts();
  }, [fetchLoadouts, filtersKey]);

  return {
    data,
    isLoading,
    isRefetching,
    refetch: () => fetchLoadouts(true)
  };
};
