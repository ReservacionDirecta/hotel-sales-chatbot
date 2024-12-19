'use client';

import { useState, useEffect } from 'react';
import hotelApi from '@/lib/api';
import { 
  ChatBubbleLeftRightIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  ArrowTrendingUpIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import WhatsAppConnection from '@/components/WhatsAppConnection';
import ConversationsList from '@/components/ConversationsList';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState({
    conversations: 0,
    availableRooms: 0,
    scripts: 0,
    conversionRate: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [conversationsRes, roomsRes, scriptsRes] = await Promise.allSettled([
          hotelApi.getConversations(),
          hotelApi.getRooms(),
          hotelApi.getSalesScripts(),
        ]);

        const newStats = {
          conversations: 0,
          availableRooms: 0,
          scripts: 0,
          conversionRate: 0,
        };

        if (conversationsRes.status === 'fulfilled' && conversationsRes.value?.data) {
          const data = Array.isArray(conversationsRes.value.data) ? conversationsRes.value.data : [];
          newStats.conversations = data.filter(c => c.status === 'active').length;
        }

        if (roomsRes.status === 'fulfilled' && roomsRes.value?.data) {
          const data = Array.isArray(roomsRes.value.data) ? roomsRes.value.data : [];
          newStats.availableRooms = data.filter(r => r.available).length;
        }

        if (scriptsRes.status === 'fulfilled' && scriptsRes.value?.data) {
          const data = Array.isArray(scriptsRes.value.data) ? scriptsRes.value.data : [];
          newStats.scripts = data.length;
        }

        newStats.conversionRate = 25;

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Error al cargar las estadísticas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Panel de Control</h1>
        <Button
          onClick={() => router.push('/settings')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Cog6ToothIcon className="h-5 w-5" />
          Configuración
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Conversaciones"
          value={stats.conversations}
          Icon={ChatBubbleLeftRightIcon}
          description="Conversaciones activas"
          loading={isLoading}
        />
        <StatsCard
          title="Habitaciones"
          value={stats.availableRooms}
          Icon={BuildingOfficeIcon}
          description="Habitaciones disponibles"
          loading={isLoading}
        />
        <StatsCard
          title="Scripts"
          value={stats.scripts}
          Icon={DocumentTextIcon}
          description="Scripts de venta activos"
          loading={isLoading}
        />
        <StatsCard
          title="Conversión"
          value={`${stats.conversionRate}%`}
          Icon={ArrowTrendingUpIcon}
          description="Tasa de conversión"
          loading={isLoading}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Estado de Conexión</h2>
        <WhatsAppConnection />
      </div>

      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold p-6 border-b">Conversaciones</h2>
        <ConversationsList />
      </div>
    </main>
  );
}
