'use client';

import React, { useEffect, useState } from 'react';
import hotelApi, { type WhatsAppStatus } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

export default function WhatsAppConnection() {
  const [status, setStatus] = useState<WhatsAppStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await hotelApi.getWhatsAppStatus();
      if (response.success && response.data) {
        setStatus(response.data);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp status:', error);
      toast.error('Error al obtener el estado de WhatsApp');
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = async () => {
    setLoading(true);
    try {
      const response = await hotelApi.resetWhatsAppConnection();
      if (response.success) {
        toast.success('Conexión reiniciada exitosamente');
        await fetchStatus();
      }
    } catch (error) {
      console.error('Error resetting WhatsApp connection:', error);
      toast.error('Error al reiniciar la conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const response = await hotelApi.disconnectWhatsApp();
      if (response.success) {
        toast.success('Desconectado exitosamente');
        await fetchStatus();
      }
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
      toast.error('Error al desconectar WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  if (!status) {
    return <div>Cargando estado de WhatsApp...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Estado de WhatsApp</h2>
          <p className="mt-1 text-sm text-gray-500">
            {status?.isConnected
              ? 'Conectado y listo para recibir mensajes'
              : 'Escanea el código QR para conectar WhatsApp'}
          </p>
        </div>
        <div className="flex gap-2">
          {status?.isConnected && (
            <Button
              variant="outline"
              onClick={handleDisconnect}
              disabled={loading}
            >
              Desconectar
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={loading}
          >
            Reiniciar
          </Button>
        </div>
      </div>

      {status?.qrCode && !status.isConnected && (
        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg">
          <QRCodeSVG
            value={status.qrCode}
            size={256}
            level="H"
            includeMargin
            className="mb-4"
          />
          <p className="text-sm text-gray-500">
            Intentos restantes: {status.maxAttempts - status.qrAttempts}
          </p>
        </div>
      )}

      {status?.isConnected && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <span>WhatsApp conectado y funcionando</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center text-gray-500">
          <span className="inline-block animate-spin mr-2">⚡</span>
          Procesando...
        </div>
      )}
    </div>
  );
};
