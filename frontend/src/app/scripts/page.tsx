'use client';

import { useState, useEffect } from 'react';
import { hotelApi } from '@/lib/api';
import ErrorMessage from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { SalesScript } from '@/types';

const SCRIPT_TYPES = [
  { value: 'greeting', label: 'Saludo Inicial' },
  { value: 'qualification', label: 'Calificación' },
  { value: 'presentation', label: 'Presentación' },
  { value: 'objection', label: 'Manejo de Objeciones' },
  { value: 'closing', label: 'Cierre de Venta' },
  { value: 'followup', label: 'Seguimiento' },
];

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<SalesScript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingScript, setEditingScript] = useState<SalesScript | null>(null);
  const [newScript, setNewScript] = useState({
    type: '',
    content: '',
    active: true,
  });

  const fetchScripts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await hotelApi.getSalesScripts();
      if (response.success && Array.isArray(response.data?.data)) {
        setScripts(response.data.data);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (err) {
      setError('Error al cargar los scripts');
      console.error('Error fetching scripts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  const handleSave = async () => {
    try {
      if (!newScript.type || !newScript.content) {
        toast.error('Todos los campos son requeridos');
        return;
      }

      const response = await hotelApi.createSalesScript(newScript);
      if (response.success) {
        toast.success('Script creado exitosamente');
        setNewScript({ type: '', content: '', active: true });
        await fetchScripts();
      } else {
        throw new Error(response.message || 'Error al crear el script');
      }
    } catch (error) {
      console.error('Error saving script:', error);
      toast.error('Error al guardar el script');
    }
  };

  const handleUpdate = async (id: number, data: Partial<SalesScript>) => {
    try {
      const response = await hotelApi.updateSalesScript(id, data);
      if (response.success) {
        toast.success('Script actualizado exitosamente');
        setEditingScript(null);
        await fetchScripts();
      } else {
        throw new Error(response.message || 'Error al actualizar el script');
      }
    } catch (error) {
      console.error('Error updating script:', error);
      toast.error('Error al actualizar el script');
    }
  };

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Scripts de Venta</h1>

      {/* Formulario para nuevo script */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Nuevo Script</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Tipo de Script</Label>
              <Select
                value={newScript.type}
                onValueChange={(value) => setNewScript({ ...newScript, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {SCRIPT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                value={newScript.content}
                onChange={(e) => setNewScript({ ...newScript, content: e.target.value })}
                placeholder="Escribe el contenido del script..."
                className="h-32"
              />
            </div>

            <Button onClick={handleSave}>Guardar Script</Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de scripts existentes */}
      <div className="grid gap-4">
        {scripts.map((script) => (
          <Card key={script.id}>
            <CardHeader>
              <CardTitle>
                {SCRIPT_TYPES.find((t) => t.value === script.type)?.label || script.type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingScript?.id === script.id ? (
                <div className="space-y-4">
                  <Textarea
                    value={editingScript.content}
                    onChange={(e) =>
                      setEditingScript({ ...editingScript, content: e.target.value })
                    }
                    className="h-32"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(script.id, editingScript)}>
                      Guardar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingScript(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="whitespace-pre-wrap mb-4">{script.content}</p>
                  <Button onClick={() => setEditingScript(script)}>
                    Editar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
