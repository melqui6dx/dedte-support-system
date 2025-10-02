import React, { useState } from 'react';
import { Plus, Search, Filter, X, Phone, Mail, BookOpen, Calendar, FileText, Download, MessageSquare, Clock, CheckCircle, AlertCircle, Eye, Edit2, Trash2, PlusCircle, BarChart3, FolderTree, ExternalLink } from 'lucide-react';

const SistemaSoporteDEDTE = ({
  solicitudes,
  categorias,
  onCrearSolicitud,
  onCrearCategoria,
  onActualizarCategoria,
  onEliminarCategoria
}) => {
  const [vista, setVista] = useState('solicitudes');
  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalCategoria, setModalCategoria] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [filtros, setFiltros] = useState({ busqueda: '', estado: '', facultad: '', prioridad: '' });
  const [errorMessage, setErrorMessage] = useState(null);

  // Componente: Modal de Detalle de Solicitud
  const ModalDetalleSolicitud = ({ solicitud, onClose }) => {
    const getEstadoBadge = (estado) => {
      const estados = {
        pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
        en_revision: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Eye },
        en_proceso: { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertCircle },
        resuelto: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
        cerrado: { bg: 'bg-gray-100', text: 'text-gray-800', icon: CheckCircle }
      };
      const config = estados[estado];
      const Icon = config.icon;
      return (
        <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit`}>
          <Icon size={14} />
          {estado.replace('_', ' ').toUpperCase()}
        </span>
      );
    };

    const getPrioridadBadge = (prioridad) => {
      const prioridades = {
        baja: { bg: 'bg-gray-100', text: 'text-gray-700' },
        media: { bg: 'bg-blue-100', text: 'text-blue-700' },
        alta: { bg: 'bg-orange-100', text: 'text-orange-700' },
        urgente: { bg: 'bg-red-100', text: 'text-red-700' }
      };
      const config = prioridades[prioridad];
      return (
        <span className={`${config.bg} ${config.text} px-2 py-1 rounded text-xs font-medium`}>
          {prioridad.toUpperCase()}
        </span>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{solicitud.numero_ticket}</h2>
                {getEstadoBadge(solicitud.estado)}
                {getPrioridadBadge(solicitud.prioridad)}
              </div>
              <p className="text-gray-600">{solicitud.titulo}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-6 space-y-6">
            {/* Información del Estudiante */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen size={18} />
                Información del Estudiante
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre Completo</p>
                  <p className="font-medium text-gray-800">{solicitud.nombre_estudiante}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Matrícula</p>
                  <p className="font-medium text-gray-800">{solicitud.matricula || 'No proporcionada'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone size={14} /> Teléfono
                  </p>
                  <a href={`tel:${solicitud.telefono}`} className="font-medium text-blue-600 hover:underline">
                    {solicitud.telefono}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail size={14} /> Email
                  </p>
                  <a href={`mailto:${solicitud.email}`} className="font-medium text-blue-600 hover:underline text-sm">
                    {solicitud.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Facultad</p>
                  <p className="font-medium text-gray-800">{solicitud.facultad}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Carrera</p>
                  <p className="font-medium text-gray-800">{solicitud.carrera}</p>
                </div>
              </div>
            </div>

            {/* Descripción del Problema */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <MessageSquare size={18} />
                Descripción del Problema
              </h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {solicitud.descripcion}
              </p>
            </div>

            {/* Archivos Adjuntos */}
            {solicitud.adjuntos && solicitud.adjuntos.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText size={18} />
                  Archivos Adjuntos ({solicitud.adjuntos.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {solicitud.adjuntos.map((archivo, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="bg-blue-100 p-2 rounded">
                        {archivo.tipo.includes('image') ? (
                          <FileText size={20} className="text-blue-600" />
                        ) : (
                          <FileText size={20} className="text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{archivo.nombre}</p>
                        <p className="text-xs text-gray-500">{archivo.tipo}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 flex-shrink-0">
                        <Download size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Información Adicional */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Categoría</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: solicitud.categoria?.color }}></div>
                  <p className="font-medium text-gray-800 text-sm">{solicitud.categoria?.nombre}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Canal</p>
                <p className="font-medium text-gray-800 text-sm capitalize">{solicitud.canal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha Creación</p>
                <p className="font-medium text-gray-800 text-sm">
                  {new Date(solicitud.created_at).toLocaleDateString('es-ES', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {solicitud.asignado_a && (
                <div>
                  <p className="text-sm text-gray-600">Asignado a</p>
                  <p className="font-medium text-gray-800 text-sm">{solicitud.asignado_a}</p>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-4 border-t">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium">
                Cambiar Estado
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 font-medium">
                Asignar
              </button>
              <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium flex items-center gap-2">
                <ExternalLink size={18} />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente: Tabla de Solicitudes
  const TablaSolicitudes = () => {
    const solicitudesFiltradas = solicitudes.filter(s => {
      const matchBusqueda = !filtros.busqueda || 
        s.nombre_estudiante.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        s.numero_ticket.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        s.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase());
      const matchEstado = !filtros.estado || s.estado === filtros.estado;
      const matchFacultad = !filtros.facultad || s.facultad === filtros.facultad;
      return matchBusqueda && matchEstado && matchFacultad;
    });

    const getEstadoBadge = (estado) => {
      const estados = {
        pendiente: 'bg-yellow-100 text-yellow-800',
        en_revision: 'bg-blue-100 text-blue-800',
        en_proceso: 'bg-orange-100 text-orange-800',
        resuelto: 'bg-green-100 text-green-800',
        cerrado: 'bg-gray-100 text-gray-800'
      };
      return (
        <span className={`${estados[estado]} px-2 py-1 rounded-full text-xs font-medium`}>
          {estado.replace('_', ' ')}
        </span>
      );
    };

    return (
      <div className="space-y-4">
        {/* Filtros y búsqueda */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nombre, ticket o título..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="resuelto">Resuelto</option>
            </select>
            <select
              value={filtros.facultad}
              onChange={(e) => setFiltros({...filtros, facultad: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las facultades</option>
              <option value="Ingeniería y Arquitectura">Ingeniería y Arquitectura</option>
              <option value="Ciencias de la Salud">Ciencias de la Salud</option>
              <option value="Ciencias Económicas y Sociales">Ciencias Económicas y Sociales</option>
            </select>
            <button
              onClick={() => setModalNuevo(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Nueva Solicitud
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {solicitudesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <FileText size={48} className="mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium text-gray-600">No se encontraron solicitudes</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {filtros.busqueda || filtros.estado || filtros.facultad
                            ? 'Intenta ajustar los filtros'
                            : 'Crea la primera solicitud para comenzar'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  solicitudesFiltradas.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{solicitud.numero_ticket}</div>
                      <div className="text-xs text-gray-500 capitalize">{solicitud.canal}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{solicitud.nombre_estudiante}</div>
                      <div className="text-xs text-gray-500">{solicitud.telefono}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{solicitud.titulo}</div>
                      <div className="text-xs text-gray-500">{solicitud.facultad}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: solicitud.categoria?.color }}></div>
                        <span className="text-sm text-gray-700">{solicitud.categoria?.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEstadoBadge(solicitud.estado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(solicitud.created_at).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: 'short'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setModalDetalle(solicitud)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye size={16} />
                        Ver
                      </button>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Componente: Gestión de Categorías
  const GestionCategorias = () => {
    const handleEliminar = async (id) => {
      if (confirm('¿Estás seguro de eliminar esta categoría?')) {
        try {
          await onEliminarCategoria(id);
          setErrorMessage(null);
        } catch (err) {
          setErrorMessage(err.message || 'Error al eliminar la categoría');
        }
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Categorías</h2>
          <button
            onClick={() => { setCategoriaEditar(null); setModalCategoria(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Nueva Categoría
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map((cat) => (
            <div key={cat.id} className="bg-white p-5 rounded-lg shadow-sm border-l-4" style={{ borderColor: cat.color }}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  </div>
                  <h3 className="font-semibold text-gray-800">{cat.nombre}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${cat.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {cat.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setCategoriaEditar(cat); setModalCategoria(true); }}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 flex items-center justify-center gap-2 text-sm"
                >
                  <Edit2 size={14} />
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(cat.id)}
                  className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 flex items-center justify-center gap-2 text-sm"
                >
                  <Trash2 size={14} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Componente: Dashboard con Analíticas
  const Dashboard = () => {
    const totalSolicitudes = solicitudes.length;
    const pendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
    const enProceso = solicitudes.filter(s => s.estado === 'en_proceso').length;
    const resueltas = solicitudes.filter(s => s.estado === 'resuelto').length;
    
    const porCategoria = categorias.map(cat => ({
      nombre: cat.nombre,
      cantidad: solicitudes.filter(s => s.categoria?.nombre === cat.nombre).length,
      color: cat.color
    })).filter(c => c.cantidad > 0);

    const porFacultad = [...new Set(solicitudes.map(s => s.facultad))].map(fac => ({
      facultad: fac,
      cantidad: solicitudes.filter(s => s.facultad === fac).length
    }));

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard de Analíticas</h2>
          <p className="text-gray-600 mt-1">Período: Octubre 2025</p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm font-medium">Total Solicitudes</p>
              <BarChart3 size={24} className="text-blue-200" />
            </div>
            <p className="text-4xl font-bold">{totalSolicitudes}</p>
            <p className="text-blue-100 text-xs mt-2">Últimos 30 días</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-yellow-100 text-sm font-medium">Pendientes</p>
              <Clock size={24} className="text-yellow-200" />
            </div>
            <p className="text-4xl font-bold">{pendientes}</p>
            <p className="text-yellow-100 text-xs mt-2">{((pendientes/totalSolicitudes)*100).toFixed(1)}% del total</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-100 text-sm font-medium">En Proceso</p>
              <AlertCircle size={24} className="text-orange-200" />
            </div>
            <p className="text-4xl font-bold">{enProceso}</p>
            <p className="text-orange-100 text-xs mt-2">{((enProceso/totalSolicitudes)*100).toFixed(1)}% del total</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm font-medium">Resueltas</p>
              <CheckCircle size={24} className="text-green-200" />
            </div>
            <p className="text-4xl font-bold">{resueltas}</p>
            <p className="text-green-100 text-xs mt-2">{((resueltas/totalSolicitudes)*100).toFixed(1)}% del total</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Por Categoría */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FolderTree size={20} />
              Solicitudes por Categoría
            </h3>
            <div className="space-y-4">
              {porCategoria.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 font-medium">{item.nombre}</span>
                    <span className="font-semibold text-gray-800">{item.cantidad} ({((item.cantidad/totalSolicitudes)*100).toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${(item.cantidad / totalSolicitudes) * 100}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Por Facultad */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} />
              Solicitudes por Facultad
            </h3>
            <div className="space-y-4">
              {porFacultad.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 font-medium truncate">{item.facultad}</span>
                    <span className="font-semibold text-gray-800">{item.cantidad}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${(item.cantidad / totalSolicitudes) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Tiempo Promedio de Resolución</p>
            <p className="text-2xl font-bold text-gray-800">2.5 días</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Canal Más Usado</p>
            <p className="text-2xl font-bold text-gray-800">WhatsApp</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Tasa de Satisfacción</p>
            <p className="text-2xl font-bold text-gray-800">94.2%</p>
          </div>
        </div>
      </div>
    );
  };

  // Modal para Nueva Solicitud
  const ModalNuevaSolicitud = () => {
    const [formData, setFormData] = useState({
      nombre_estudiante: '',
      telefono: '',
      email: '',
      matricula: '',
      facultad: '',
      carrera: '',
      categoria_id: '',
      titulo: '',
      descripcion: '',
      prioridad: 'media',
      canal: 'whatsapp'
    });
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();

      // Validaciones básicas
      if (!formData.nombre_estudiante || !formData.telefono || !formData.categoria_id || !formData.titulo || !formData.descripcion) {
        alert('Por favor completa todos los campos obligatorios');
        return;
      }

      try {
        setEnviando(true);
        await onCrearSolicitud(formData);
        setModalNuevo(false);
        setFormData({
          nombre_estudiante: '',
          telefono: '',
          email: '',
          matricula: '',
          facultad: '',
          carrera: '',
          categoria_id: '',
          titulo: '',
          descripcion: '',
          prioridad: 'media',
          canal: 'whatsapp'
        });
      } catch (err) {
        alert(err.message || 'Error al crear la solicitud');
      } finally {
        setEnviando(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Nueva Solicitud de Soporte</h2>
            <button onClick={() => setModalNuevo(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  value={formData.nombre_estudiante}
                  onChange={(e) => setFormData({...formData, nombre_estudiante: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="809-555-0123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="estudiante@universidad.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
                <input
                  type="text"
                  value={formData.matricula}
                  onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="A00123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facultad *</label>
                <select
                  value={formData.facultad}
                  onChange={(e) => setFormData({...formData, facultad: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Ingeniería y Arquitectura">Ingeniería y Arquitectura</option>
                  <option value="Ciencias de la Salud">Ciencias de la Salud</option>
                  <option value="Ciencias Económicas y Sociales">Ciencias Económicas y Sociales</option>
                  <option value="Humanidades">Humanidades</option>
                  <option value="Ciencias Jurídicas">Ciencias Jurídicas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
                <input
                  type="text"
                  value={formData.carrera}
                  onChange={(e) => setFormData({...formData, carrera: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Ingeniería Civil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                <select
                  value={formData.categoria_id}
                  onChange={(e) => setFormData({...formData, categoria_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {categorias.filter(c => c.activo).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select
                  value={formData.prioridad}
                  onChange={(e) => setFormData({...formData, prioridad: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Canal</label>
                <select
                  value={formData.canal}
                  onChange={(e) => setFormData({...formData, canal: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="formulario">Formulario Web</option>
                  <option value="presencial">Presencial</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título del Problema *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Breve descripción del problema"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Detallada *</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe el problema con el mayor detalle posible..."
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm text-gray-600 mb-1">Arrastra archivos aquí o haz clic para seleccionar</p>
              <p className="text-xs text-gray-500">PNG, JPG, PDF hasta 10MB</p>
              <input type="file" multiple className="hidden" />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setModalNuevo(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 font-medium"
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={enviando}
              >
                {enviando ? 'Creando...' : 'Crear Solicitud'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Modal para Gestión de Categoría
  const ModalGestionCategoria = () => {
    const [formData, setFormData] = useState(
      categoriaEditar || { nombre: '', color: '#3B82F6', activo: true }
    );
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.nombre) {
        alert('Por favor ingresa el nombre de la categoría');
        return;
      }

      try {
        setEnviando(true);
        if (categoriaEditar) {
          await onActualizarCategoria(categoriaEditar.id, formData);
        } else {
          await onCrearCategoria(formData);
        }
        setModalCategoria(false);
        setCategoriaEditar(null);
      } catch (err) {
        alert(err.message || 'Error al guardar la categoría');
      } finally {
        setEnviando(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {categoriaEditar ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <button onClick={() => setModalCategoria(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Problemas Técnicos"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-16 h-10 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                Categoría activa
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setModalCategoria(false);
                  setCategoriaEditar(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={enviando}
              >
                {enviando ? 'Guardando...' : (categoriaEditar ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mensaje de error */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)} className="text-red-600 hover:text-red-800 ml-2">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Soporte DEDTE</h1>
              <p className="text-sm text-gray-600 mt-1">Gestión de solicitudes estudiantiles</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Usuario: Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navegación */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <button
              onClick={() => setVista('solicitudes')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                vista === 'solicitudes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Solicitudes
            </button>
            <button
              onClick={() => setVista('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                vista === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Analíticas
            </button>
            <button
              onClick={() => setVista('categorias')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                vista === 'categorias'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Categorías
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {vista === 'solicitudes' && <TablaSolicitudes />}
        {vista === 'dashboard' && <Dashboard />}
        {vista === 'categorias' && <GestionCategorias />}
      </main>

      {/* Modales */}
      {modalDetalle && <ModalDetalleSolicitud solicitud={modalDetalle} onClose={() => setModalDetalle(null)} />}
      {modalNuevo && <ModalNuevaSolicitud />}
      {modalCategoria && <ModalGestionCategoria />}
    </div>
  );
};

export default SistemaSoporteDEDTE;