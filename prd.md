# KICK-OFF FAST
## Product Requirements Document (PRD)

### 1. VISIÓN DEL PRODUCTO

KICK-OFF FAST es una plataforma interna de inteligencia comercial, investigación de mercados, geomarketing y generación de oportunidades de negocio.

Su propósito inicial es proporcionar al equipo operador las herramientas necesarias para ofrecer servicios profesionales de marketing digital a restaurantes y negocios locales.

La plataforma permitirá investigar competidores, analizar su presencia digital, identificar tendencias y oportunidades comerciales, segmentar mercados geográficamente, diseñar estrategias de captación y administrar los leads generados.

Inicialmente, KICK-OFF FAST será utilizado por el equipo de marketing para gestionar los clientes y ejecutar los servicios de manera centralizada.

La arquitectura deberá permitir evolucionar posteriormente hacia un SaaS que los negocios puedan contratar y utilizar directamente.

**Propuesta de valor:**

Convertir información del mercado en oportunidades comerciales mediante inteligencia competitiva, análisis de demanda, segmentación geográfica y captación de clientes potenciales.

### 2. MODELO DE NEGOCIO

KICK-OFF FAST comienza como una herramienta interna que permite comercializar servicios de marketing gestionados.

Modelo inicial:

1. Se registra un negocio como cliente.
2. Se configura su perfil comercial.
3. Se identifican sus competidores.
4. Se investigan las interacciones y tendencias públicas disponibles.
5. Se identifican oportunidades de mercado.
6. Se construyen campañas de captación.
7. Se generan leads mediante canales autorizados.
8. Se hace seguimiento de resultados.
9. Se entrega un informe de rendimiento al cliente.

El cliente paga por el servicio de investigación, estrategia, ejecución y optimización.

Evolución comercial:

- Servicio gestionado de marketing.
- Paquetes recurrentes de inteligencia comercial.
- Servicio de captación de leads.
- Suscripción a KICK-OFF FAST.
- Plataforma SaaS de autoservicio.

### 3. USUARIOS Y PERMISOS

La V1 será exclusivamente interna.

**Administrador**
- Gestiona usuarios y permisos.
- Crea y administra clientes.
- Configura integraciones.
- Consulta toda la información.
- Gestiona la operación.

**Estratega de marketing**
- Investiga clientes y competidores.
- Analiza oportunidades.
- Genera estrategias.
- Crea campañas.
- Consulta indicadores.

**Operador**
- Administra campañas.
- Gestiona contenido.
- Registra leads.
- Actualiza estados.
- Prepara informes.

No se desarrollará autenticación ni panel de clientes externos en la V1.

### 4. MÓDULOS FUNCIONALES

#### MÓDULO 1. CLIENT MANAGEMENT

Administración centralizada de los negocios contratantes.

Funciones:
- Crear y editar clientes.
- Nombre comercial y razón social opcional.
- Sector y categoría.
- Dirección y coordenadas.
- Teléfono y correo comercial.
- Sitio web.
- Redes sociales.
- Descripción del negocio.
- Productos y servicios principales.
- Público objetivo.
- Zonas de cobertura.
- Estado de contratación.
- Observaciones internas.

Cada cliente tendrá un expediente comercial con su investigación, competidores, oportunidades, campañas y leads.

Estados:
- Prospecto.
- Contactado.
- Negociación.
- Cliente activo.
- Pausado.
- Finalizado.

#### MÓDULO 2. COMPETITOR INTELLIGENCE

Motor de investigación y seguimiento de competidores.

Funciones:
- Registrar competidores manualmente.
- Asociarlos con uno o varios clientes.
- Registrar perfiles de redes sociales.
- Registrar sitio web y ubicación comercial.
- Clasificar por categoría y proximidad.
- Guardar observaciones.
- Consultar publicaciones y métricas públicas disponibles mediante fuentes autorizadas.
- Registrar promociones y estrategias comerciales.
- Comparar competidores.
- Mantener históricos de investigación.

Indicadores:
- Número de publicaciones.
- Frecuencia de publicación.
- Seguidores cuando el proveedor permita consultarlos.
- Interacciones públicas disponibles.
- Formatos de contenido.
- Temas predominantes.
- Promociones identificadas.
- Evolución histórica de indicadores disponibles.

La aplicación diferenciará:
- Datos obtenidos mediante API.
- Datos públicos registrados manualmente.
- Datos estimados.
- Datos no disponibles.

No se permitirá extracción masiva de seguidores, identificación de usuarios privados ni descarga de listas de personas que interactuaron con competidores.

#### MÓDULO 3. SOCIAL LISTENING & MARKET RADAR

Identificación de señales de demanda y oportunidades comerciales.

Funciones:
- Registrar palabras clave.
- Registrar hashtags.
- Definir categorías de búsqueda.
- Configurar zonas geográficas de interés.
- Registrar tendencias y conversaciones públicas disponibles.
- Clasificar información mediante IA.
- Detectar necesidades recurrentes.
- Identificar oportunidades de contenido y promoción.
- Generar recomendaciones comerciales.

Clasificación de señales:
- Intención de compra.
- Solicitud de recomendaciones.
- Búsqueda de productos.
- Interés por promociones.
- Necesidad de domicilios.
- Tendencias gastronómicas.
- Oportunidades de posicionamiento.

Cada señal almacenará:
- Fuente.
- URL de referencia cuando exista.
- Fecha de observación.
- Categoría.
- Ubicación mencionada, si está disponible.
- Clasificación de IA.
- Nivel de confianza.
- Oportunidad detectada.

La IA podrá recomendar acciones, pero las decisiones comerciales deberán ser aprobadas por el operador.

#### MÓDULO 4. GEO INTELLIGENCE

Sistema de investigación y segmentación territorial.

Funciones:
- Visualizar clientes y competidores en un mapa.
- Registrar coordenadas comerciales.
- Identificar zonas de influencia.
- Definir radios de cobertura.
- Registrar barrios y sectores.
- Identificar concentración de negocios por categoría.
- Definir zonas prioritarias para campañas.
- Visualizar leads por ubicación autorizada.
- Comparar zonas de cobertura comercial.

Capacidades:
- Georreferenciación de negocios.
- Segmentación territorial.
- Mapas de calor de datos agregados.
- Análisis de proximidad.
- Comparación de zonas.
- Identificación de áreas comerciales potenciales.

Las ubicaciones individuales de leads solo podrán utilizarse cuando hayan sido proporcionadas legítimamente. No se inferirá la ubicación física de una persona a partir de su perfil social.

#### MÓDULO 5. OPPORTUNITY ENGINE

Motor de identificación y priorización de oportunidades.

Combinará información del mercado, competidores y zonas geográficas.

Ejemplos:
- Competidores con baja actividad digital.
- Sectores con poca oferta de determinada categoría.
- Promociones que podrían diferenciar al cliente.
- Productos con oportunidades de posicionamiento.
- Tendencias relevantes para una campaña.
- Zonas donde conviene aumentar la cobertura.

Cada oportunidad tendrá:
- Nombre.
- Cliente relacionado.
- Descripción.
- Fuente de evidencia.
- Categoría.
- Zona geográfica.
- Impacto potencial.
- Esfuerzo estimado.
- Prioridad.
- Recomendación.
- Estado.

Estados:
- Detectada.
- En evaluación.
- Aprobada.
- En ejecución.
- Descartada.
- Completada.

La priorización será asistida por IA y revisada por el operador.

#### MÓDULO 6. LEAD MANAGEMENT

CRM interno para gestionar las oportunidades de captación.

Funciones:
- Registrar leads manualmente.
- Capturar leads desde formularios.
- Importar contactos con origen y autorización verificables.
- Registrar canal de procedencia.
- Asociar leads con campañas.
- Clasificar por zona.
- Asignar responsable.
- Administrar estados.
- Registrar interacciones.
- Programar seguimientos.
- Medir conversiones.

Información:
- Nombre.
- Teléfono y correo, cuando sean proporcionados.
- Empresa, cuando corresponda.
- Zona o ubicación declarada.
- Fuente de captación.
- Campaña asociada.
- Fecha de registro.
- Estado del consentimiento.
- Evidencia de autorización cuando corresponda.
- Responsable.
- Notas comerciales.

Estados:
- Nuevo.
- Pendiente de contacto.
- Contactado.
- Calificado.
- Convertido.
- No interesado.
- Descartado.

Lead Score:

Puntuación configurable que considera:
- Afinidad con el negocio.
- Intención comercial.
- Zona de interés.
- Interacciones con canales propios.
- Fuente del lead.
- Vigencia de la señal.

El lead scoring no deberá interpretar una interacción pública con un competidor como autorización para contactar a esa persona.

#### MÓDULO 7. CAMPAIGN MANAGEMENT

Administración de campañas de marketing.

Funciones:
- Crear campañas por cliente.
- Definir objetivos.
- Seleccionar público objetivo.
- Seleccionar zonas geográficas.
- Asociar productos y promociones.
- Registrar canales.
- Generar propuestas de campaña con IA.
- Crear textos promocionales.
- Generar briefs creativos.
- Adjuntar piezas gráficas.
- Registrar presupuesto.
- Administrar fechas.
- Registrar resultados.

Estados:
- Borrador.
- En revisión.
- Aprobada.
- Activa.
- Pausada.
- Finalizada.

En la V1, la ejecución y publicación podrán realizarse manualmente por el operador. La aplicación centralizará la planeación, los recursos y los resultados.

#### MÓDULO 8. AI MARKETING ASSISTANT

Asistente para apoyar la investigación y producción de estrategias.

Funciones:
- Resumir competidores.
- Analizar diferencias comerciales.
- Interpretar tendencias.
- Detectar oportunidades.
- Proponer estrategias de contenido.
- Generar textos promocionales.
- Proponer campañas.
- Crear calendarios editoriales.
- Recomendar públicos y zonas.
- Generar informes para clientes.

La IA deberá utilizar los datos del cliente y las evidencias disponibles.

No deberá inventar métricas, ubicaciones, interacciones ni oportunidades.

Las recomendaciones deberán distinguir entre hechos, estimaciones e hipótesis.

#### MÓDULO 9. REPORTING & ANALYTICS

Generación de informes operativos y comerciales.

Indicadores:
- Clientes activos.
- Competidores monitoreados.
- Investigaciones realizadas.
- Oportunidades detectadas.
- Oportunidades ejecutadas.
- Leads captados.
- Leads calificados.
- Conversiones.
- Campañas activas.
- Presupuesto publicitario registrado.
- Resultados por campaña.
- Rendimiento por zona.

Informes:
- Diagnóstico inicial.
- Análisis de competencia.
- Investigación de mercado.
- Oportunidades comerciales.
- Resultados de campañas.
- Rendimiento de captación.

Exportación inicial:
- PDF.
- CSV.

### 5. FLUJOS PRINCIPALES

**Flujo A — Incorporación de cliente**

1. Crear cliente.
2. Completar perfil comercial.
3. Registrar ubicación.
4. Registrar redes sociales propias.
5. Definir categoría y productos.
6. Definir público objetivo.
7. Configurar zonas de interés.
8. Registrar competidores.

Resultado: expediente comercial completo.

**Flujo B — Investigación de mercado**

1. Seleccionar cliente.
2. Consultar competidores registrados.
3. Recopilar información disponible.
4. Registrar tendencias y señales.
5. Ejecutar análisis asistido por IA.
6. Generar oportunidades.
7. Revisar y aprobar recomendaciones.

Resultado: diagnóstico de mercado.

**Flujo C — Generación de campaña**

1. Seleccionar oportunidad.
2. Definir objetivo comercial.
3. Seleccionar zona.
4. Definir público objetivo.
5. Generar propuesta con IA.
6. Preparar contenido.
7. Registrar presupuesto.
8. Aprobar campaña.
9. Ejecutar.
10. Registrar resultados.

Resultado: campaña documentada y medible.

**Flujo D — Gestión de leads**

1. Captar lead mediante formulario o canal autorizado.
2. Registrar su fuente.
3. Almacenar evidencia del consentimiento cuando corresponda.
4. Clasificar.
5. Asignar responsable.
6. Realizar seguimiento.
7. Registrar conversión.

Resultado: oportunidad comercial trazable.

### 6. ARQUITECTURA TÉCNICA

Stack propuesto:

Frontend:
- React.
- TypeScript.
- TanStack Router.
- Tailwind CSS.

Backend:
- Supabase.
- PostgreSQL.
- Supabase Auth.
- Supabase Storage.
- Supabase Edge Functions.

Integraciones:
- Meta Graph API.
- Google Maps Platform.
- API de modelos de IA.
- Formularios de captación.
- WhatsApp Business mediante integraciones autorizadas.

Infraestructura:
- Vercel.
- Supabase.
- GitHub.

Arquitectura modular:

- clients
- competitors
- research
- social-listening
- geointelligence
- opportunities
- leads
- campaigns
- ai-assistant
- reporting
- integrations

Los módulos compartirán entidades centrales, pero conservarán límites funcionales claros.

No se requiere desplegar cada módulo como un microservicio independiente en la primera versión.

### 7. MODELO DE DATOS INICIAL

Entidades principales:

**workspaces**
- id
- name
- created_at

**workspace_members**
- id
- workspace_id
- user_id
- role

**clients**
- id
- workspace_id
- business_name
- category
- description
- address
- latitude
- longitude
- website
- phone
- status

**social_accounts**
- id
- client_id
- platform
- account_name
- account_url
- connection_status
- external_account_id

**competitors**
- id
- client_id
- name
- category
- website
- address
- latitude
- longitude
- created_at

**competitor_profiles**
- id
- competitor_id
- platform
- profile_url
- external_id

**research_runs**
- id
- client_id
- status
- research_date
- summary

**competitor_snapshots**
- id
- competitor_profile_id
- metrics
- source_type
- captured_at

**market_signals**
- id
- client_id
- source_url
- keyword
- category
- description
- location_text
- confidence
- observed_at

**opportunities**
- id
- client_id
- title
- description
- category
- priority
- status
- evidence
- created_at

**campaigns**
- id
- client_id
- opportunity_id
- name
- objective
- budget
- start_date
- end_date
- status

**leads**
- id
- client_id
- campaign_id
- name
- email
- phone
- location
- source
- score
- status

**consent_records**
- id
- lead_id
- purpose
- consent_status
- consent_text_version
- evidence_reference
- captured_at
- revoked_at

**activity_logs**
- id
- workspace_id
- client_id
- user_id
- action
- metadata
- created_at

El modelo podrá ampliarse conforme se incorporen funcionalidades.

### 8. SEGURIDAD Y PROTECCIÓN DE DATOS

Requisitos obligatorios:

- Arquitectura multi-tenant desde el inicio.
- RLS en tablas con información de clientes.
- Separación de datos por workspace y cliente.
- Roles y permisos.
- Tokens de integración protegidos.
- Secretos exclusivamente en backend.
- Registro de actividades.
- Validación de entradas.
- Protección contra acceso cruzado entre clientes.
- Registro de consentimientos.
- Procedimientos de revocación y supresión.
- Restricción de exportaciones.
- Copias de seguridad.

Cumplir la legislación colombiana aplicable sobre protección de datos personales.

No se permitirá:
- Extraer masivamente seguidores de competidores.
- Descargar listas privadas de usuarios que interactuaron con terceros.
- Identificar personas mediante mecanismos de scraping no autorizados.
- Enviar mensajes masivos no solicitados.
- Utilizar datos personales sin una base legítima y las autorizaciones requeridas.
- Almacenar contraseñas de redes sociales de los clientes.

### 9. ALCANCE DEL MVP — V1

La primera versión debe ser funcional, no una plataforma de marketing completa.

Prioridad P0:

1. Autenticación interna.
2. Gestión de usuarios y roles.
3. Gestión de clientes.
4. Expediente comercial.
5. Registro de competidores.
6. Registro de perfiles sociales.
7. Investigación y snapshots.
8. Registro de señales de mercado.
9. Mapa de clientes y competidores.
10. Motor básico de oportunidades.
11. CRM interno básico.
12. Generación de recomendaciones mediante IA.
13. Registro de campañas.
14. Dashboard operativo.

Prioridad P1:

- Formularios públicos de captación.
- Generación avanzada de contenido.
- Reportes PDF.
- Integración con Meta.
- Integración con Google Maps avanzada.
- Automatizaciones.
- Conexión con FastFood Menu.

Fuera del MVP:

- Plataforma pública de autoservicio.
- Suscripciones y facturación SaaS.
- Aplicaciones móviles.
- Publicación automática multicanal.
- Gestión avanzada de anuncios.
- Extracción masiva de datos sociales.
- Automatización de mensajes directos.
- Analítica predictiva avanzada.

### 10. CRITERIOS DE ACEPTACIÓN

La V1 se considera funcional cuando:

1. El administrador puede crear y gestionar clientes.
2. Cada cliente tiene un expediente independiente.
3. Se pueden asociar múltiples competidores a cada cliente.
4. Se pueden registrar y consultar investigaciones.
5. Las métricas muestran su fuente y fecha de obtención.
6. Se pueden registrar señales comerciales.
7. La IA genera recomendaciones basadas en información disponible.
8. El mapa muestra clientes, competidores y zonas.
9. Se pueden crear oportunidades y cambiar sus estados.
10. Se pueden registrar leads y sus fuentes.
11. Se pueden documentar consentimientos.
12. Se pueden crear y administrar campañas.
13. Se puede consultar un dashboard operativo.
14. RLS impide el acceso a información de otros workspaces.
15. Ninguna operación depende de scraping no autorizado.

### 11. ROADMAP

**Etapa 1 — Core operativo**
- Base del proyecto.
- Autenticación.
- Clientes.
- Competidores.
- Investigación manual.
- Registro de señales.
- Mapa básico.

**Etapa 2 — Inteligencia comercial**
- Snapshots.
- Análisis comparativo.
- Asistente IA.
- Identificación de oportunidades.
- Priorización comercial.

**Etapa 3 — Captación**
- CRM.
- Formularios.
- Consentimientos.
- Lead scoring.
- Seguimiento comercial.

**Etapa 4 — Marketing**
- Campañas.
- Contenido.
- Reportes.
- Indicadores.
- Integraciones autorizadas.

**Etapa 5 — Escalamiento SaaS**
- Onboarding autónomo.
- Panel de cliente.
- Suscripciones.
- Límites por plan.
- Multiempresa.
- Automatización.
- API pública.

### 12. VISIÓN DE EVOLUCIÓN

KICK-OFF FAST debe conservar una arquitectura que permita separar dos productos comerciales:

**KICK-OFF FAST Agency**
Herramienta interna para investigar mercados y gestionar servicios de marketing ofrecidos por el equipo.

**KICK-OFF FAST SaaS**
Plataforma comercial para que restaurantes y negocios puedan investigar su entorno, administrar campañas, identificar oportunidades y gestionar sus leads de forma autónoma.

La versión SaaS deberá aprovechar los módulos desarrollados inicialmente, sin obligar a reconstruir el núcleo del sistema.

### 13. PRINCIPIO DE DESARROLLO

Construir primero el sistema que permita prestar y vender el servicio.

No desarrollar funcionalidades especulativas ni integraciones complejas antes de validar su utilidad comercial.

Cada módulo debe tener una responsabilidad clara, datos verificables, permisos definidos y criterios de aceptación.

El objetivo de la V1 no es automatizar toda una agencia de marketing.

El objetivo es convertir KICK-OFF FAST en la herramienta central desde la cual se pueda investigar, planear, ejecutar y medir el crecimiento comercial de los clientes.