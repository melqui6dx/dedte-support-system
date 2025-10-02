import { supabase } from '../lib/supabase';

// ============================================
// SOLICITUDES - CRUD
// ============================================

// CARGAR TODAS LAS SOLICITUDES
export async function cargarSolicitudes() {
  const { data, error } = await supabase
    .from('solicitudes')
    .select(`
      *,
      categoria:categorias(nombre, color),
      adjuntos(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// CARGAR SOLICITUD POR ID
export async function cargarSolicitudPorId(id) {
  const { data, error } = await supabase
    .from('solicitudes')
    .select(`
      *,
      categoria:categorias(nombre, color),
      adjuntos(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// CREAR SOLICITUD
export async function crearSolicitud(datos) {
  // Generar número de ticket único
  const { data: ultimoTicket } = await supabase
    .from('solicitudes')
    .select('numero_ticket')
    .order('created_at', { ascending: false })
    .limit(1);

  let nuevoNumero = 1;
  if (ultimoTicket && ultimoTicket.length > 0) {
    const match = ultimoTicket[0].numero_ticket.match(/TKT-\d{4}-(\d+)/);
    if (match) {
      nuevoNumero = parseInt(match[1]) + 1;
    }
  }

  const year = new Date().getFullYear();
  const numero_ticket = `TKT-${year}-${String(nuevoNumero).padStart(4, '0')}`;

  const solicitudCompleta = {
    ...datos,
    numero_ticket,
    estado: datos.estado || 'pendiente',
    prioridad: datos.prioridad || 'media',
    canal: datos.canal || 'formulario'
  };

  const { data, error } = await supabase
    .from('solicitudes')
    .insert([solicitudCompleta])
    .select(`
      *,
      categoria:categorias(nombre, color),
      adjuntos(*)
    `)
    .single();

  if (error) throw error;

  // Crear entrada en historial
  await supabase.from('historial').insert({
    solicitud_id: data.id,
    tipo: 'creacion',
    contenido: `Solicitud creada: ${datos.titulo}`,
    autor: datos.nombre_estudiante
  });

  return data;
}

// ACTUALIZAR SOLICITUD
export async function actualizarSolicitud(id, updates) {
  const { data, error } = await supabase
    .from('solicitudes')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      categoria:categorias(nombre, color),
      adjuntos(*)
    `)
    .single();

  if (error) throw error;

  // Registrar cambio en historial si hay cambio de estado
  if (updates.estado) {
    await supabase.from('historial').insert({
      solicitud_id: id,
      tipo: 'cambio_estado',
      contenido: `Estado cambiado a: ${updates.estado}`,
      autor: updates.asignado_a || 'Sistema'
    });
  }

  return data;
}

// ELIMINAR SOLICITUD
export async function eliminarSolicitud(id) {
  const { error } = await supabase
    .from('solicitudes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// CATEGORÍAS - CRUD
// ============================================

// CARGAR TODAS LAS CATEGORÍAS
export async function cargarCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre');

  if (error) throw error;
  return data;
}

// CARGAR CATEGORÍAS ACTIVAS
export async function cargarCategoriasActivas() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('activo', true)
    .order('nombre');

  if (error) throw error;
  return data;
}

// CREAR CATEGORÍA
export async function crearCategoria(categoria) {
  const { data, error } = await supabase
    .from('categorias')
    .insert([{
      ...categoria,
      activo: categoria.activo !== undefined ? categoria.activo : true
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ACTUALIZAR CATEGORÍA
export async function actualizarCategoria(id, updates) {
  const { data, error } = await supabase
    .from('categorias')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ELIMINAR CATEGORÍA
export async function eliminarCategoria(id) {
  const { error } = await supabase
    .from('categorias')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// ARCHIVOS - Upload/Download
// ============================================

// SUBIR ARCHIVO
export async function subirArchivo(file, solicitudId) {
  const fileName = `${solicitudId}/${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('adjuntos')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('adjuntos')
    .getPublicUrl(fileName);

  // Guardar en BD
  const { data, error } = await supabase.from('adjuntos').insert({
    solicitud_id: solicitudId,
    nombre_archivo: file.name,
    tipo_archivo: file.type,
    url_archivo: publicUrl,
    tamano_bytes: file.size
  }).select().single();

  if (error) throw error;

  return data;
}

// DESCARGAR ARCHIVO
export async function descargarArchivo(url) {
  window.open(url, '_blank');
}

// ELIMINAR ARCHIVO
export async function eliminarArchivo(adjuntoId, urlArchivo) {
  // Extraer el path del archivo desde la URL
  const pathMatch = urlArchivo.match(/adjuntos\/(.+)$/);
  if (pathMatch) {
    const filePath = pathMatch[1];

    // Eliminar del storage
    const { error: storageError } = await supabase.storage
      .from('adjuntos')
      .remove([filePath]);

    if (storageError) throw storageError;
  }

  // Eliminar registro de la BD
  const { error } = await supabase
    .from('adjuntos')
    .delete()
    .eq('id', adjuntoId);

  if (error) throw error;
}

// ============================================
// HISTORIAL
// ============================================

// CARGAR HISTORIAL DE SOLICITUD
export async function cargarHistorial(solicitudId) {
  const { data, error } = await supabase
    .from('historial')
    .select('*')
    .eq('solicitud_id', solicitudId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// AGREGAR COMENTARIO AL HISTORIAL
export async function agregarComentario(solicitudId, contenido, autor) {
  const { data, error } = await supabase
    .from('historial')
    .insert({
      solicitud_id: solicitudId,
      tipo: 'comentario',
      contenido,
      autor
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}