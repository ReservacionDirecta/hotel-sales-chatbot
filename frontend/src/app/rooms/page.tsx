'use client';

import { useState, useEffect } from 'react';
import { hotelApi } from '@/lib/api';
import ErrorMessage from '@/components/ErrorMessage';
import type { Room } from '@/types';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editForm, setEditForm] = useState({
    type: '',
    price: 0,
    description: '',
    available: false,
  });
  const [formError, setFormError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await hotelApi.getRooms();
      if (response.success && Array.isArray(response.data)) {
        setRooms(response.data);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (err) {
      setError('Error al cargar las habitaciones');
      console.error('Error fetching rooms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const startEditing = (room: Room) => {
    setEditingRoom(room);
    setEditForm({
      type: room.type,
      price: room.price,
      description: room.description || '',
      available: room.available,
    });
  };

  const cancelEditing = () => {
    setEditingRoom(null);
    setEditForm({
      type: '',
      price: 0,
      description: '',
      available: false,
    });
    setFormError(null);
  };

  const validateForm = (form: typeof editForm) => {
    if (!form.type.trim()) {
      setFormError('El tipo de habitación es requerido');
      return false;
    }
    if (form.price <= 0) {
      setFormError('El precio debe ser mayor a 0');
      return false;
    }
    if (!form.description.trim()) {
      setFormError('La descripción es requerida');
      return false;
    }
    setFormError(null);
    return true;
  };

  const saveRoom = async () => {
    if (!editingRoom) return;

    if (!validateForm(editForm)) {
      return;
    }

    try {
      const response = await hotelApi.updateRoom(editingRoom.id, editForm);
      if (response.success) {
        await fetchRooms();
        cancelEditing();
      } else {
        throw new Error(response.message || 'Error al actualizar la habitación');
      }
    } catch (error) {
      console.error('Error updating room:', error);
      setFormError('Error al actualizar la habitación. Por favor, intenta nuevamente.');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
              <div className="mt-2">
                <button
                  onClick={fetchRooms}
                  className="text-sm font-medium text-red-800 hover:text-red-900"
                >
                  Intentar nuevamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2">Cargando habitaciones...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Habitaciones</h1>
        <button
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          onClick={() => {
            // TODO: Implement room creation
          }}
        >
          Agregar Habitación
        </button>
      </div>

      {formError && (
        <div className="mb-4">
          <ErrorMessage message={formError} />
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(rooms) && rooms.length > 0 ? (
              rooms.map((room) => (
                <tr key={room.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRoom?.id === room.id ? (
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-full"
                        value={editForm.type}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{room.type}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRoom?.id === room.id ? (
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-32"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })
                        }
                      />
                    ) : (
                      <div className="text-sm text-gray-900">${room.price}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingRoom?.id === room.id ? (
                      <textarea
                        className="border rounded px-2 py-1 w-full"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({ ...editForm, description: e.target.value })
                        }
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{room.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingRoom?.id === room.id ? (
                      <select
                        className="border rounded px-2 py-1"
                        value={editForm.available.toString()}
                        onChange={(e) =>
                          setEditForm({ ...editForm, available: e.target.value === 'true' })
                        }
                      >
                        <option value="true">Disponible</option>
                        <option value="false">No Disponible</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          room.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {room.available ? 'Disponible' : 'No Disponible'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingRoom?.id === room.id ? (
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={saveRoom}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(room)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No hay habitaciones disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
