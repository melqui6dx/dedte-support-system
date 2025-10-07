import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import SistemaSoporteDEDTE from './components/SistemaSoporteDEDTE';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import * as api from './utils/api';

function AppContent() {
  const { user, loading: authLoading } = useAuth();

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <Login />;
  }

  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();

    // Escuchar cambios en tiempo real
    const channel = supabase
      .channel('cambios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'solicitudes' }, handleSolicitudesChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categorias' }, handleCategoriasChange)
      .subscribe();

    return () => supabase.removeChannel(channel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cargar datos iniciales
  async function cargarDatos() {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([cargarSolicitudesData(), cargarCategoriasData()]);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos. Por favor, verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  }

  async function cargarSolicitudesData() {
    try {
      const data = await api.cargarSolicitudes();
      setSolicitudes(data || []);
    } catch (err) {
      console.error('Error cargando solicitudes:', err);
      throw err;
    }
  }

  async function cargarCategoriasData() {
    try {
      const data = await api.cargarCategorias();
      setCategorias(data || []);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      throw err;
    }
  }

  // Handlers para cambios en tiempo real
  function handleSolicitudesChange() {
    cargarSolicitudesData();
  }

  function handleCategoriasChange() {
    cargarCategoriasData();
  }

  // ============================================
  // FUNCIONES CRUD PARA SOLICITUDES
  // ============================================

  async function handleCrearSolicitud(datos) {
    try {
      const nuevaSolicitud = await api.crearSolicitud(datos);
      setSolicitudes([nuevaSolicitud, ...solicitudes]);
      return nuevaSolicitud;
    } catch (err) {
      console.error('Error creando solicitud:', err);
      throw new Error('No se pudo crear la solicitud. Por favor, intenta de nuevo.');
    }
  }

  async function handleActualizarSolicitud(id, updates) {
    try {
      const solicitudActualizada = await api.actualizarSolicitud(id, updates);
      setSolicitudes(solicitudes.map(s => s.id === id ? solicitudActualizada : s));
      return solicitudActualizada;
    } catch (err) {
      console.error('Error actualizando solicitud:', err);
      throw new Error('No se pudo actualizar la solicitud. Por favor, intenta de nuevo.');
    }
  }

  async function handleEliminarSolicitud(id) {
    try {
      await api.eliminarSolicitud(id);
      setSolicitudes(solicitudes.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error eliminando solicitud:', err);
      throw new Error('No se pudo eliminar la solicitud. Por favor, intenta de nuevo.');
    }
  }

  // ============================================
  // FUNCIONES CRUD PARA CATEGORÍAS
  // ============================================

  async function handleCrearCategoria(datos) {
    try {
      const nuevaCategoria = await api.crearCategoria(datos);
      setCategorias([...categorias, nuevaCategoria]);
      return nuevaCategoria;
    } catch (err) {
      console.error('Error creando categoría:', err);
      throw new Error('No se pudo crear la categoría. Por favor, intenta de nuevo.');
    }
  }

  async function handleActualizarCategoria(id, updates) {
    try {
      const categoriaActualizada = await api.actualizarCategoria(id, updates);
      setCategorias(categorias.map(c => c.id === id ? categoriaActualizada : c));
      return categoriaActualizada;
    } catch (err) {
      console.error('Error actualizando categoría:', err);
      throw new Error('No se pudo actualizar la categoría. Por favor, intenta de nuevo.');
    }
  }

  async function handleEliminarCategoria(id) {
    try {
      await api.eliminarCategoria(id);
      setCategorias(categorias.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error eliminando categoría:', err);
      throw new Error('No se pudo eliminar la categoría. Por favor, intenta de nuevo.');
    }
  }

  // ============================================
  // FUNCIONES PARA ARCHIVOS
  // ============================================

  async function handleSubirArchivo(file, solicitudId) {
    try {
      const adjunto = await api.subirArchivo(file, solicitudId);
      // Recargar la solicitud para obtener los adjuntos actualizados
      await cargarSolicitudesData();
      return adjunto;
    } catch (err) {
      console.error('Error subiendo archivo:', err);
      throw new Error('No se pudo subir el archivo. Por favor, intenta de nuevo.');
    }
  }

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando sistema...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <div className="text-red-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Error de Conexión</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={cargarDatos}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SistemaSoporteDEDTE
      solicitudes={solicitudes}
      categorias={categorias}
      onRecargar={cargarDatos}
      onCrearSolicitud={handleCrearSolicitud}
      onActualizarSolicitud={handleActualizarSolicitud}
      onEliminarSolicitud={handleEliminarSolicitud}
      onCrearCategoria={handleCrearCategoria}
      onActualizarCategoria={handleActualizarCategoria}
      onEliminarCategoria={handleEliminarCategoria}
      onSubirArchivo={handleSubirArchivo}
    />
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;