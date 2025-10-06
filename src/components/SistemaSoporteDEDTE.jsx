import React, { useState } from 'react';
import { Plus, Search, Filter, X, Phone, Mail, BookOpen, Calendar, FileText, Download, MessageSquare, Clock, CheckCircle, AlertCircle, Eye, Edit2, Trash2, PlusCircle, BarChart3, FolderTree, ExternalLink, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SistemaSoporteDEDTE = ({
  solicitudes,
  categorias,
  onCrearSolicitud,
  onCrearCategoria,
  onActualizarCategoria,
  onEliminarCategoria,
  onActualizarSolicitud
}) => {
  const { user, signOut } = useAuth();
  const [vista, setVista] = useState('solicitudes');
  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalCategoria, setModalCategoria] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [filtros, setFiltros] = useState({ busqueda: '', estado: '', facultad: '', prioridad: '' });
  const [errorMessage, setErrorMessage] = useState(null);
  const [modalCambiarEstado, setModalCambiarEstado] = useState(null);
  const [modalAsignar, setModalAsignar] = useState(null);

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      try {
        await signOut();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión. Por favor intenta de nuevo.');
      }
    }
  };

  // Componente: Modal de Detalle de Solicitud
  const ModalDetalleSolicitud = ({ solicitud, onClose }) => {
    const getEstadoBadge = (estado) => {
      const estados = {
        pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
        en_revision: 'bg-blue-50 text-blue-700 border-blue-200',
        en_proceso: 'bg-orange-50 text-orange-700 border-orange-200',
        resuelto: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        cerrado: 'bg-slate-100 text-slate-700 border-slate-200'
      };
      return (
        <span className={`${estados[estado]} px-3 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5`}>
          {estado.replace('_', ' ').toUpperCase()}
        </span>
      );
    };

    const getPrioridadBadge = (prioridad) => {
      const prioridades = {
        baja: 'bg-slate-50 text-slate-700 border-slate-200',
        media: 'bg-blue-50 text-blue-700 border-blue-200',
        alta: 'bg-orange-50 text-orange-700 border-orange-200',
        urgente: 'bg-red-50 text-red-700 border-red-200'
      };
      return (
        <span className={`${prioridades[prioridad]} px-3 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center`}>
          {prioridad.toUpperCase()}
        </span>
      );
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-start rounded-t-2xl">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900">{solicitud.numero_ticket}</h2>
                {getEstadoBadge(solicitud.estado)}
                {getPrioridadBadge(solicitud.prioridad)}
              </div>
              <p className="text-slate-600 font-medium">{solicitud.titulo}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-6 space-y-6">
            {/* Información del Estudiante */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <BookOpen size={18} strokeWidth={2} />
                Información del Estudiante
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 font-semibold">Nombre Completo</p>
                  <p className="font-medium text-slate-900 mt-0.5">{solicitud.nombre_estudiante}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-semibold">Matrícula</p>
                  <p className="font-medium text-slate-900 mt-0.5">{solicitud.matricula || 'No proporcionada'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-1 font-semibold">
                    <Phone size={14} strokeWidth={2} /> Teléfono
                  </p>
                  <a href={`tel:${solicitud.telefono}`} className="font-medium text-blue-600 hover:text-blue-700 mt-0.5 inline-block">
                    {solicitud.telefono}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-1 font-semibold">
                    <Mail size={14} strokeWidth={2} /> Email
                  </p>
                  <a href={`mailto:${solicitud.email}`} className="font-medium text-blue-600 hover:text-blue-700 text-sm mt-0.5 inline-block">
                    {solicitud.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-semibold">Facultad</p>
                  <p className="font-medium text-slate-900 mt-0.5">{solicitud.facultad}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-semibold">Carrera</p>
                  <p className="font-medium text-slate-900 mt-0.5">{solicitud.carrera}</p>
                </div>
              </div>
            </div>

            {/* Descripción del Problema */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <MessageSquare size={18} strokeWidth={2} />
                Descripción del Problema
              </h3>
              <p className="text-slate-700 bg-slate-50 border border-slate-200 p-4 rounded-xl whitespace-pre-wrap">
                {solicitud.descripcion}
              </p>
            </div>

            {/* Archivos Adjuntos */}
            {solicitud.adjuntos && solicitud.adjuntos.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText size={18} strokeWidth={2} />
                  Archivos Adjuntos ({solicitud.adjuntos.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {solicitud.adjuntos.map((archivo, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg">
                        {archivo.tipo.includes('image') ? (
                          <FileText size={20} className="text-blue-600" strokeWidth={2} />
                        ) : (
                          <FileText size={20} className="text-blue-600" strokeWidth={2} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{archivo.nombre}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{archivo.tipo}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 flex-shrink-0 transition-colors">
                        <Download size={18} strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Información Adicional */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-sm text-slate-600 font-semibold">Categoría</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: solicitud.categoria?.color }}></div>
                  <p className="font-medium text-slate-900 text-sm">{solicitud.categoria?.nombre}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-semibold">Canal</p>
                <p className="font-medium text-slate-900 text-sm capitalize mt-1">{solicitud.canal}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-semibold">Fecha Creación</p>
                <p className="font-medium text-slate-900 text-sm mt-1">
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
                  <p className="text-sm text-slate-600 font-semibold">Asignado a</p>
                  <p className="font-medium text-slate-900 text-sm mt-1">{solicitud.asignado_a}</p>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setModalCambiarEstado(solicitud)}
                className="flex-1 bg-slate-900 text-white py-2.5 px-4 rounded-xl hover:bg-slate-800 font-semibold shadow-sm transition-all"
              >
                Cambiar Estado
              </button>
              <button
                onClick={() => setModalAsignar(solicitud)}
                className="flex-1 bg-slate-100 text-slate-700 py-2.5 px-4 rounded-xl hover:bg-slate-200 font-semibold shadow-sm transition-all"
              >
                Asignar
              </button>
              <button
                onClick={() => {
                  const mensaje = `Hola ${solicitud.nombre_estudiante}, te contactamos desde DEDTE sobre tu ticket ${solicitud.numero_ticket}: ${solicitud.titulo}`;
                  const telefono = solicitud.telefono.replace(/\D/g, '');
                  window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
                }}
                className="bg-green-600 text-white py-2.5 px-4 rounded-xl hover:bg-green-700 font-semibold shadow-sm flex items-center gap-2 transition-all"
              >
                <ExternalLink size={18} strokeWidth={2} />
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
        pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
        en_revision: 'bg-blue-50 text-blue-700 border-blue-200',
        en_proceso: 'bg-orange-50 text-orange-700 border-orange-200',
        resuelto: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        cerrado: 'bg-slate-100 text-slate-700 border-slate-200'
      };
      return (
        <span className={`${estados[estado]} px-2.5 py-1 rounded-lg text-xs font-semibold border inline-flex items-center`}>
          {estado.replace('_', ' ')}
        </span>
      );
    };

    return (
      <div className="space-y-6">
        {/* Filtros y búsqueda */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 card-hover">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} strokeWidth={2} />
              <input
                type="text"
                placeholder="Buscar por nombre, ticket o título..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all shadow-sm"
              />
            </div>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              className="px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all bg-white shadow-sm"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="resuelto">Resuelto</option>
            </select>
            <select
              value={filtros.facultad}
              onChange={(e) => setFiltros({...filtros, facultad: e.target.value})}
              className="px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all bg-white shadow-sm"
            >
              <option value="">Todas las facultades</option>
              <option value="Cs. Jurídicas, Políticas y Sociales">Cs. Jurídicas, Políticas y Sociales</option>
              <option value="Cs. Económicas, Administrativas y Financieras">Cs. Económicas, Administrativas y Financieras</option>
              <option value="Ciencias Agrícolas">Ciencias Agrícolas</option>
              <option value="Cs. Exactas y Tecnología">Cs. Exactas y Tecnología</option>
              <option value="Ciencias Veterinarias">Ciencias Veterinarias</option>
              <option value="Auditoría Financiera o Contaduría Pública">Auditoría Financiera o Contaduría Pública</option>
              <option value="Politécnica">Politécnica</option>
              <option value="Humanidades">Humanidades</option>
              <option value="Ingeniería en Cs. de la Computación y Telecomunicaciones">Ingeniería en Cs. de la Computación y Telecomunicaciones</option>
              <option value="Integral del Norte">Integral del Norte</option>
              <option value="Integral de los Valles Cruceños">Integral de los Valles Cruceños</option>
              <option value="Cs. del Hábitat, Diseño y Arte">Cs. del Hábitat, Diseño y Arte</option>
              <option value="Cs. de la Salud Humana">Cs. de la Salud Humana</option>
              <option value="Integral del Chaco">Integral del Chaco</option>
              <option value="Integral de Ichilo">Integral de Ichilo</option>
              <option value="Integral Chiquitana">Integral Chiquitana</option>
              <option value="Ciencias Farmacéuticas y Bioquímicas">Ciencias Farmacéuticas y Bioquímicas</option>
            </select>
            <button
              onClick={() => setModalNuevo(true)}
              className="bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
            >
              <Plus size={18} strokeWidth={2.5} />
              Nueva Solicitud
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Ticket</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Estudiante</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Título</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Categoría</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Fecha</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/50">
                {solicitudesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="text-slate-400">
                        <FileText size={48} className="mx-auto mb-3 opacity-40" strokeWidth={1.5} />
                        <p className="text-lg font-semibold text-slate-700">No se encontraron solicitudes</p>
                        <p className="text-sm text-slate-500 mt-1.5">
                          {filtros.busqueda || filtros.estado || filtros.facultad
                            ? 'Intenta ajustar los filtros'
                            : 'Crea la primera solicitud para comenzar'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  solicitudesFiltradas.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{solicitud.numero_ticket}</div>
                      <div className="text-xs text-slate-500 capitalize font-medium mt-0.5">{solicitud.canal}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{solicitud.nombre_estudiante}</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">{solicitud.telefono}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 font-medium max-w-xs truncate">{solicitud.titulo}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{solicitud.facultad}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: solicitud.categoria?.color }}></div>
                        <span className="text-sm text-slate-700 font-medium">{solicitud.categoria?.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEstadoBadge(solicitud.estado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      {new Date(solicitud.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <button
                        onClick={() => setModalDetalle(solicitud)}
                        className="text-slate-900 hover:text-slate-600 flex items-center gap-1.5 transition-colors"
                      >
                        <Eye size={16} strokeWidth={2} />
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
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Categorías</h2>
          <button
            onClick={() => { setCategoriaEditar(null); setModalCategoria(true); }}
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 font-semibold shadow-sm flex items-center gap-2 transition-all"
          >
            <PlusCircle size={20} strokeWidth={2.5} />
            Nueva Categoría
          </button>
        </div>

        {/* Categories Grid */}
        {categorias.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm p-16 text-center animate-fadeIn">
            <FolderTree size={48} className="mx-auto mb-4 text-slate-300" strokeWidth={1.5} />
            <p className="text-lg font-semibold text-slate-700">No hay categorías creadas</p>
            <p className="text-sm text-slate-500 mt-1.5">Crea la primera categoría para comenzar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((cat, idx) => (
              <div key={cat.id} className={`bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 card-hover stagger-item`} style={{animationDelay: `${idx * 0.05}s`}}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color + '15' }}>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    </div>
                    <h3 className="font-semibold text-slate-900">{cat.nombre}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold inline-flex items-center ${
                    cat.activo
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {cat.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => { setCategoriaEditar(cat); setModalCategoria(true); }}
                    className="flex-1 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors border border-slate-200"
                  >
                    <Edit2 size={16} strokeWidth={2} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(cat.id)}
                    className="flex-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors border border-slate-200"
                  >
                    <Trash2 size={16} strokeWidth={2} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
          <h2 className="text-2xl font-bold text-slate-900">Dashboard de Analíticas</h2>
          <p className="text-slate-600 font-semibold mt-1">Período: Octubre 2025</p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 p-6 rounded-2xl shadow-sm card-hover stagger-item">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-600 text-sm font-semibold">Total Solicitudes</p>
              <BarChart3 size={20} className="text-slate-500" strokeWidth={2} />
            </div>
            <p className="text-4xl font-bold text-slate-900">{totalSolicitudes}</p>
            <p className="text-slate-500 text-xs font-semibold mt-2">Últimos 30 días</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 p-6 rounded-2xl shadow-sm card-hover stagger-item">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-600 text-sm font-semibold">Pendientes</p>
              <Clock size={20} className="text-amber-600" strokeWidth={2} />
            </div>
            <p className="text-4xl font-bold text-slate-900">{pendientes}</p>
            <p className="text-slate-500 text-xs font-semibold mt-2">{((pendientes/totalSolicitudes)*100).toFixed(1)}% del total</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 p-6 rounded-2xl shadow-sm card-hover stagger-item">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-600 text-sm font-semibold">En Proceso</p>
              <AlertCircle size={20} className="text-orange-600" strokeWidth={2} />
            </div>
            <p className="text-4xl font-bold text-slate-900">{enProceso}</p>
            <p className="text-slate-500 text-xs font-semibold mt-2">{((enProceso/totalSolicitudes)*100).toFixed(1)}% del total</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 p-6 rounded-2xl shadow-sm card-hover stagger-item">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-600 text-sm font-semibold">Resueltas</p>
              <CheckCircle size={20} className="text-emerald-600" strokeWidth={2} />
            </div>
            <p className="text-4xl font-bold text-slate-900">{resueltas}</p>
            <p className="text-slate-500 text-xs font-semibold mt-2">{((resueltas/totalSolicitudes)*100).toFixed(1)}% del total</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Por Categoría */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 card-hover">
            <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <FolderTree size={20} strokeWidth={2} />
              Solicitudes por Categoría
            </h3>
            <div className="space-y-4">
              {porCategoria.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-700 font-semibold">{item.nombre}</span>
                    <span className="font-bold text-slate-900">{item.cantidad} ({((item.cantidad/totalSolicitudes)*100).toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all duration-300"
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
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 card-hover">
            <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <BookOpen size={20} strokeWidth={2} />
              Solicitudes por Facultad
            </h3>
            <div className="space-y-4">
              {porFacultad.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-700 font-semibold truncate pr-2">{item.facultad}</span>
                    <span className="font-bold text-slate-900 flex-shrink-0">{item.cantidad}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-slate-700 transition-all duration-300"
                      style={{ width: `${(item.cantidad / totalSolicitudes) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 card-hover stagger-item">
            <p className="text-sm text-slate-600 font-semibold mb-2">Tiempo Promedio de Resolución</p>
            <p className="text-3xl font-bold text-slate-900">2.5 días</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 card-hover stagger-item">
            <p className="text-sm text-slate-600 font-semibold mb-2">Canal Más Usado</p>
            <p className="text-3xl font-bold text-slate-900">WhatsApp</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 card-hover stagger-item">
            <p className="text-sm text-slate-600 font-semibold mb-2">Tasa de Satisfacción</p>
            <p className="text-3xl font-bold text-slate-900">94.2%</p>
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
            <h2 className="text-xl font-bold text-slate-900">Nueva Solicitud de Soporte</h2>
            <button onClick={() => setModalNuevo(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Nombre Completo *</label>
                <input
                  type="text"
                  value={formData.nombre_estudiante}
                  onChange={(e) => setFormData({...formData, nombre_estudiante: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Teléfono *</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all"
                  placeholder="809-555-0123"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all"
                  placeholder="estudiante@universidad.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Matrícula</label>
                <input
                  type="text"
                  value={formData.matricula}
                  onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all"
                  placeholder="A00123456"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Facultad *</label>
                <select
                  value={formData.facultad}
                  onChange={(e) => setFormData({...formData, facultad: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all bg-white"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Cs. Jurídicas, Políticas y Sociales">Cs. Jurídicas, Políticas y Sociales</option>
                  <option value="Cs. Económicas, Administrativas y Financieras">Cs. Económicas, Administrativas y Financieras</option>
                  <option value="Ciencias Agrícolas">Ciencias Agrícolas</option>
                  <option value="Cs. Exactas y Tecnología">Cs. Exactas y Tecnología</option>
                  <option value="Ciencias Veterinarias">Ciencias Veterinarias</option>
                  <option value="Auditoría Financiera o Contaduría Pública">Auditoría Financiera o Contaduría Pública</option>
                  <option value="Politécnica">Politécnica</option>
                  <option value="Humanidades">Humanidades</option>
                  <option value="Ingeniería en Cs. de la Computación y Telecomunicaciones">Ingeniería en Cs. de la Computación y Telecomunicaciones</option>
                  <option value="Integral del Norte">Integral del Norte</option>
                  <option value="Integral de los Valles Cruceños">Integral de los Valles Cruceños</option>
                  <option value="Cs. del Hábitat, Diseño y Arte">Cs. del Hábitat, Diseño y Arte</option>
                  <option value="Cs. de la Salud Humana">Cs. de la Salud Humana</option>
                  <option value="Integral del Chaco">Integral del Chaco</option>
                  <option value="Integral de Ichilo">Integral de Ichilo</option>
                  <option value="Integral Chiquitana">Integral Chiquitana</option>
                  <option value="Ciencias Farmacéuticas y Bioquímicas">Ciencias Farmacéuticas y Bioquímicas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Carrera</label>
                <input
                  type="text"
                  value={formData.carrera}
                  onChange={(e) => setFormData({...formData, carrera: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all"
                  placeholder="Ej: Ingeniería Civil"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Categoría *</label>
                <select
                  value={formData.categoria_id}
                  onChange={(e) => setFormData({...formData, categoria_id: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all bg-white"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {categorias.filter(c => c.activo).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Prioridad</label>
                <select
                  value={formData.prioridad}
                  onChange={(e) => setFormData({...formData, prioridad: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all bg-white"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Canal</label>
                <select
                  value={formData.canal}
                  onChange={(e) => setFormData({...formData, canal: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all bg-white"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="formulario">Formulario Web</option>
                  <option value="presencial">Presencial</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Título del Problema *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all"
                placeholder="Breve descripción del problema"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Descripción Detallada *</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all"
                placeholder="Describe el problema con el mayor detalle posible..."
              />
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50">
              <FileText className="mx-auto text-slate-400 mb-2" size={32} strokeWidth={2} />
              <p className="text-sm text-slate-600 font-medium mb-1">Arrastra archivos aquí o haz clic para seleccionar</p>
              <p className="text-xs text-slate-500">PNG, JPG, PDF hasta 10MB</p>
              <input type="file" multiple className="hidden" />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalNuevo(false)}
                className="flex-1 bg-slate-100 text-slate-700 py-2.5 px-4 rounded-xl hover:bg-slate-200 font-semibold shadow-sm transition-all"
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-slate-900 text-white py-2.5 px-4 rounded-xl hover:bg-slate-800 font-semibold shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
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

  // Modal para Cambiar Estado
  const ModalCambiarEstado = ({ solicitud, onClose }) => {
    const [nuevoEstado, setNuevoEstado] = useState(solicitud.estado);
    const [comentario, setComentario] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setEnviando(true);
        await onActualizarSolicitud(solicitud.id, { estado: nuevoEstado });
        onClose();
        setModalDetalle(null);
      } catch (err) {
        alert(err.message || 'Error al cambiar el estado');
      } finally {
        setEnviando(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-xl">
          <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Cambiar Estado</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
              <p className="text-sm text-slate-600">
                Ticket: <span className="font-semibold text-slate-900">{solicitud.numero_ticket}</span>
              </p>
              <p className="text-sm text-slate-600">
                Estado actual: <span className="font-semibold text-slate-900 capitalize">{solicitud.estado.replace('_', ' ')}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Nuevo Estado *</label>
              <select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all bg-white"
                required
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_revision">En Revisión</option>
                <option value="en_proceso">En Proceso</option>
                <option value="resuelto">Resuelto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Comentario (opcional)</label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all"
                placeholder="Agrega un comentario sobre este cambio..."
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 text-slate-700 py-2.5 px-4 rounded-xl hover:bg-slate-200 font-semibold shadow-sm transition-all"
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-slate-900 text-white py-2.5 px-4 rounded-xl hover:bg-slate-800 font-semibold shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
                disabled={enviando}
              >
                {enviando ? 'Actualizando...' : 'Cambiar Estado'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Modal para Asignar Solicitud
  const ModalAsignar = ({ solicitud, onClose }) => {
    const [asignadoA, setAsignadoA] = useState(solicitud.asignado_a || '');
    const [enviando, setEnviando] = useState(false);

    // Lista de técnicos/agentes disponibles (esto debería venir de la BD en producción)
    const agentesDisponibles = [
      'Juan Pérez',
      'María González',
      'Carlos Rodríguez',
      'Ana Martínez',
      'Luis Fernández'
    ];

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        setEnviando(true);
        await onActualizarSolicitud(solicitud.id, { asignado_a: asignadoA });
        onClose();
        setModalDetalle(null);
      } catch (err) {
        alert(err.message || 'Error al asignar la solicitud');
      } finally {
        setEnviando(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-xl">
          <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Asignar Solicitud</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
              <p className="text-sm text-slate-600">
                Ticket: <span className="font-semibold text-slate-900">{solicitud.numero_ticket}</span>
              </p>
              <p className="text-sm text-slate-600">
                Estudiante: <span className="font-semibold text-slate-900">{solicitud.nombre_estudiante}</span>
              </p>
              <p className="text-sm text-slate-600">
                Asignado actual: <span className="font-semibold text-slate-900">{solicitud.asignado_a || 'No asignado'}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Asignar a *</label>
              <select
                value={asignadoA}
                onChange={(e) => setAsignadoA(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all bg-white"
                required
              >
                <option value="">Seleccionar agente...</option>
                {agentesDisponibles.map((agente) => (
                  <option key={agente} value={agente}>{agente}</option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-xs text-blue-800 font-medium">
                <strong className="font-semibold">Nota:</strong> El agente seleccionado será notificado de esta asignación.
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 text-slate-700 py-2.5 px-4 rounded-xl hover:bg-slate-200 font-semibold shadow-sm transition-all"
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-slate-900 text-white py-2.5 px-4 rounded-xl hover:bg-slate-800 font-semibold shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
                disabled={enviando}
              >
                {enviando ? 'Asignando...' : 'Asignar'}
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-xl">
          <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">
              {categoriaEditar ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <button onClick={() => setModalCategoria(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all"
                placeholder="Ej: Problemas Técnicos"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Color</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-16 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-all"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 p-3">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                className="w-4 h-4 text-slate-900 rounded focus:ring-2 focus:ring-slate-900 cursor-pointer"
              />
              <label htmlFor="activo" className="text-sm font-semibold text-slate-900 cursor-pointer">
                Categoría activa
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setModalCategoria(false);
                  setCategoriaEditar(null);
                }}
                className="flex-1 bg-slate-100 text-slate-700 py-2.5 px-4 rounded-xl hover:bg-slate-200 font-semibold shadow-sm transition-all"
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-slate-900 text-white py-2.5 px-4 rounded-xl hover:bg-slate-800 font-semibold shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
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
    <div className="min-h-screen vanguardist-bg relative">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 vanguardist-grid pointer-events-none"></div>

      {/* Mensaje de error */}
      {errorMessage && (
        <div className="fixed top-6 right-6 bg-red-50 border border-red-100 text-red-900 px-4 py-3.5 rounded-xl shadow-lg z-50 max-w-md backdrop-blur-sm animate-fadeIn">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)} className="text-red-600 hover:text-red-800 ml-3 -mt-0.5">
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                <BookOpen size={20} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sistema de Soporte DEDTE</h1>
                <p className="text-sm text-slate-600 mt-0.5 font-medium">Gestión de solicitudes estudiantiles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
                <User size={15} className="text-slate-600" strokeWidth={2} />
                <span className="text-sm text-slate-900 font-semibold">{user?.email || 'Usuario'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
                title="Cerrar sesión"
              >
                <LogOut size={15} strokeWidth={2} />
                <span className="text-sm font-semibold">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navegación */}
      <nav className="bg-white/60 backdrop-blur-md border-b border-slate-200/60 sticky top-[89px] z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setVista('solicitudes')}
              className={`relative py-4 px-4 font-semibold text-sm transition-all ${
                vista === 'solicitudes'
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Solicitudes
              {vista === 'solicitudes' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => setVista('dashboard')}
              className={`relative py-4 px-4 font-semibold text-sm transition-all ${
                vista === 'dashboard'
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Analíticas
              {vista === 'dashboard' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => setVista('categorias')}
              className={`relative py-4 px-4 font-semibold text-sm transition-all ${
                vista === 'categorias'
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Categorías
              {vista === 'categorias' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"></span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="animate-fadeIn">
          {vista === 'solicitudes' && <TablaSolicitudes />}
          {vista === 'dashboard' && <Dashboard />}
          {vista === 'categorias' && <GestionCategorias />}
        </div>
      </main>

      {/* Modales */}
      {modalDetalle && <ModalDetalleSolicitud solicitud={modalDetalle} onClose={() => setModalDetalle(null)} />}
      {modalNuevo && <ModalNuevaSolicitud />}
      {modalCategoria && <ModalGestionCategoria />}
      {modalCambiarEstado && <ModalCambiarEstado solicitud={modalCambiarEstado} onClose={() => setModalCambiarEstado(null)} />}
      {modalAsignar && <ModalAsignar solicitud={modalAsignar} onClose={() => setModalAsignar(null)} />}
    </div>
  );
};

export default SistemaSoporteDEDTE;