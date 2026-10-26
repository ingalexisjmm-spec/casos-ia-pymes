-- Directorio del proyecto.
-- is_seed = true marca un ejemplo inicial, no un caso de un cliente.
-- Se genera desde src/data/use-cases.ts con: npm run db:seed-sql

insert into public.use_cases (
  slug,
  title,
  summary,
  body,
  categories,
  tools,
  difficulty,
  source_url,
  is_seed
) values
  ('whatsapp-fuera-de-horario', 'Responder WhatsApp cuando el equipo no está', 'Un asistente contesta precio, horario y disponibilidad con un documento que tú escribes, y deja lo demás para una persona.', 'Muchos negocios reciben las mismas preguntas por WhatsApp fuera del horario: cuánto cuesta, dónde están y si queda producto.

El asistente solo responde con lo que está escrito en una ficha breve: productos, precios, plazos y lo que no se puede prometer. Si la pregunta no está ahí, dice que alguien del equipo responde al día siguiente.

Empieza con diez preguntas reales copiadas del chat. Escríbelas con la respuesta que darías tú. Conecta ese texto a WhatsApp Business con la herramienta de bandeja o de automatización que ya uses.

Revisa las conversaciones los primeros días. El asistente no debe inventar descuentos, plazos ni stock.', array['atencion', 'ventas']::text[], array['WhatsApp Business', 'Documento de preguntas', 'ChatGPT']::text[], 'facil', null, true),
  ('borrador-de-cotizacion', 'Borrador de cotización a partir de una conversación', 'Pegas las notas de una llamada y obtienes un borrador de cotización con alcance, precio y lo que queda fuera.', 'Armar una cotización desde cero después de cada llamada consume la tarde. Casi siempre repites la misma estructura.

Con las notas de la conversación, el asistente propone un borrador: qué incluye, qué no incluye, plazo y precio según tu tabla. Tú corriges números y condiciones antes de enviarlo.

Prepara una tabla simple de precios y dos cotizaciones antiguas que te gusten, como ejemplo de tono. Pide el borrador en el mismo formato cada vez.

No envíes la primera versión sin leerla. Un cero de más en el precio no lo va a detectar solo.', array['ventas']::text[], array['Correo', 'Hoja de precios', 'ChatGPT']::text[], 'medio', null, true),
  ('resumen-semanal-de-ventas', 'Resumen semanal de ventas desde una hoja', 'Exportas la semana a una hoja de cálculo y recibes un texto corto: qué se vendió, qué quedó quieto y qué revisar.', 'El dueño o la persona de ventas abre la hoja y no siempre tiene tiempo de contar la historia de la semana.

El asistente lee las filas que ya exportaste y escribe un resumen: total, productos o servicios que más salieron, y los que no se movieron. No inventa causas. Si un dato no está en la hoja, lo dice.

Usa siempre las mismas columnas: fecha, producto, cantidad e importe. Pega la hoja o súbela y pide el mismo formato de cinco líneas.

Sirve para la reunión del lunes. No reemplaza el cierre contable.', array['ventas', 'finanzas']::text[], array['Google Sheets', 'Excel', 'ChatGPT']::text[], 'facil', null, true),
  ('descripciones-de-producto', 'Descripciones de producto para la tienda', 'A partir de una ficha técnica corta, redacta la descripción de la tienda en el tono del negocio y en el idioma que vendes.', 'Subir productos nuevos se atasca en el texto. La ficha del proveedor viene seca o en otro idioma.

El asistente reescribe con los datos que le das: material, medida, uso y cuidado. Mantiene lo que no se puede cambiar, como una talla o una advertencia.

Arma una fila por producto en una hoja: nombre y cuatro datos. Pide párrafos cortos, sin adjetivos vacíos. Copia el resultado a Shopify, WooCommerce o al catálogo que uses.

Una persona tiene que confirmar medidas y advertencias antes de publicar.', array['marketing']::text[], array['Hoja de catálogo', 'Shopify', 'WooCommerce']::text[], 'facil', null, true),
  ('calendario-de-publicaciones', 'Calendario de publicaciones a partir del catálogo', 'Propone un mes de ideas para redes usando los productos o servicios que ya vendes, no tendencias genéricas.', 'Publicar se vuelve repetir “estamos abiertos” porque no hay un plan. El catálogo, en cambio, ya tiene temas.

Con la lista de lo que vendes, el asistente arma un calendario de cuatro semanas: una idea, un formato (foto, carrusel o texto) y una frase de apertura. Tú eliges qué sí vas a hacer.

Pasa el catálogo y las reglas de tu marca: cómo hablas, qué no dices y en qué redes estás. Pide menos piezas de las que crees que puedes grabar.

No publiques una promo que el asistente inventó. Si no está en tu lista de precios, no existe.', array['marketing']::text[], array['Instagram', 'Hoja de catálogo', 'Canva']::text[], 'facil', null, true),
  ('respuestas-a-resenas', 'Borradores para responder reseñas públicas', 'Redacta una respuesta breve y educada a reseñas de tu ficha, para que alguien del equipo la revise y la publique.', 'Las reseñas quedan sin respuesta porque nadie quiere escribir en caliente, sobre todo cuando son malas.

El asistente propone una respuesta corta: agradece, reconoce el hecho si está claro y dice el siguiente paso. No discute ni ofrece descuentos que no autorizaste.

Define tres reglas: no pedir que quiten la reseña, no culpar al cliente y no dar datos privados. Pega el texto de la reseña y elige el borrador antes de publicarlo en Google o en la tienda.

Si la reseña habla de un daño o de un cobro, que la conteste una persona.', array['marketing', 'atencion']::text[], array['Google Business Profile', 'ChatGPT']::text[], 'facil', null, true),
  ('clasificar-correos-de-clientes', 'Clasificar correos de clientes por urgencia', 'Ordena la bandeja en urgente, esta semana y archivo, con una línea que dice por qué.', 'La bandeja mezcla cotizaciones, quejas, facturas y boletines. Lo urgente se esconde.

El asistente lee el asunto y el cuerpo, y propone una etiqueta: responder hoy, responder esta semana o no es de un cliente. Agrega una frase con el motivo.

Empieza con Gmail o el correo que ya usas. Revisa veinte mensajes etiquetados a mano para ver si las reglas coinciden con tu criterio. Ajusta ejemplos: “sin agua en el local” es urgente; “catálogo nuevo” no lo es.

No dejes que borre correos. Solo clasifica.', array['atencion', 'operaciones']::text[], array['Gmail', 'Outlook', 'ChatGPT']::text[], 'facil', null, true),
  ('preguntas-frecuentes-del-negocio', 'Una base de preguntas frecuentes del negocio', 'Juntas las respuestas oficiales en un solo lugar para que el equipo y un asistente digan lo mismo.', 'Cada persona del equipo responde distinto: un plazo, un precio, una política de cambios.

El trabajo es escribir esas respuestas una vez. El asistente ayuda a pasar chats y correos viejos a una lista corta, sin quedarse con lo que ya no vale.

Elige un documento compartido. Pon fecha a cada respuesta. Cuando cambie un precio, cambia el documento antes de cambiar el asistente.

Esta ficha es el cimiento de las otras. Sin ese texto, el resto inventa.', array['atencion', 'operaciones']::text[], array['Google Docs', 'Notion', 'ChatGPT']::text[], 'facil', null, true),
  ('seguimiento-despues-de-la-compra', 'Seguimiento unos días después de la compra', 'Prepara un mensaje de seguimiento para quien ya compró o recibió un servicio, con espacio para que una persona lo envíe.', 'Después de la venta nadie escribe, y el cliente decide solo si volver o no.

El asistente arma un mensaje corto a los pocos días: pregunta si quedó bien, recuerda un cuidado del producto y ofrece un siguiente paso que tú definiste. No pide una reseña de cinco estrellas ni promete un regalo.

Saca de tu hoja de pedidos el nombre, la fecha y lo que compró. Revisa el texto si el caso fue un reclamo.

Enviar menos mensajes, y solo a quien sí compró, funciona mejor que una cadena genérica.', array['atencion', 'ventas']::text[], array['Hoja de pedidos', 'WhatsApp Business', 'Correo']::text[], 'facil', null, true),
  ('minuta-de-reunion', 'Minuta con tareas y responsables', 'Convierte notas sueltas de una reunión en acuerdos, tareas y una fecha de revisión.', 'Las reuniones terminan y, a los dos días, nadie recuerda quién iba a hacer qué.

Pegas las notas o la transcripción. El asistente devuelve tres bloques: acuerdos, tareas con responsable y lo que quedó pendiente de decidir. No agrega temas que no estaban en las notas.

Pide que marque con “sin responsable” lo que no quedó asignado, en lugar de inventar un nombre. Envía la minuta el mismo día para que el equipo la corrija.

Sirve para un equipo chico. No es un acta legal.', array['operaciones', 'equipo']::text[], array['Notas', 'Google Docs', 'Claude']::text[], 'facil', null, true),
  ('confirmacion-de-citas', 'Confirmación de citas por mensaje', 'Redacta el recordatorio de una cita con fecha, hora y qué debe traer la persona, a partir del calendario.', 'Las ausencias duelen cuando el servicio se agenda de a una persona: un taller, una consulta, una visita.

El asistente escribe el recordatorio con los datos de la cita y las instrucciones que ya tienes (“llega 10 minutos antes”, “trae el número de pedido”). Quien corresponda lo envía, o lo manda tu herramienta de calendario si ya la tienes conectada.

Lista los tipos de cita y el texto fijo de cada una. No dejes que el modelo cambie la hora: la hora sale del calendario, no de la redacción.

Si alguien pide mover la cita, que lo resuelva una persona.', array['operaciones']::text[], array['Google Calendar', 'WhatsApp Business', 'Correo']::text[], 'facil', null, true),
  ('alerta-de-stock-bajo', 'Aviso cuando un producto se está acabando', 'Lee una hoja de inventario simple y lista lo que está bajo el mínimo que tú definiste.', 'El quiebre de stock se nota cuando el cliente ya preguntó. La hoja de inventario a veces sí tenía el dato.

El asistente compara existencia y mínimo, y devuelve una lista: qué reponer, cuántas unidades faltan para el mínimo y qué no se puede calcular porque la celda está vacía.

Mantén columnas estables: código, nombre, existencia y mínimo. Revisa la lista antes de hacer un pedido a un proveedor.

No conectes esto a una compra automática al principio. Primero tiene que fallar en voz alta, no en un pedido equivocado.', array['operaciones']::text[], array['Google Sheets', 'Excel', 'ChatGPT']::text[], 'medio', null, true),
  ('ordenar-gastos-del-mes', 'Ordenar gastos del mes para el cierre', 'Agrupa movimientos de un extracto en categorías que tú definas y marca los que no logra clasificar.', 'El cierre se alarga porque el extracto llega como una lista larga y alguien lo pasa a mano a categorías.

El asistente propone una categoría por movimiento usando tu lista (arriendo, insumos, sueldos, comisiones, otros). Separa lo que clasificó seguro de lo que tiene duda.

Exporta el mes en CSV o en una hoja. Incluye fecha, descripción e importe. No le pidas que “cuadre” contra la contabilidad: solo agrupa.

Alguien que conozca los gastos tiene que mirar la columna de dudas antes de usar los totales.', array['finanzas']::text[], array['Extracto bancario', 'Google Sheets', 'ChatGPT']::text[], 'medio', null, true),
  ('borradores-de-cobranza', 'Borradores de cobranza con tono respetuoso', 'Escribe un mensaje de cobro según los días de atraso, sin amenazas ni promesas que no autorizaste.', 'Cobrar por mensaje se vuelve incómodo y, por eso, se posterga. El texto sale distinto según quién lo escriba.

Define tres momentos: recordatorio amable, segundo aviso y aviso de pausa del servicio. El asistente rellena nombre, número de documento, monto y fecha con los datos de tu lista. No agrega intereses si no están en la regla.

Parte de una hoja con facturas vencidas. Lee cada borrador. Tú decides si se envía.

No automatices el corte de un servicio sin una revisión humana.', array['finanzas', 'ventas']::text[], array['Hoja de facturas', 'Correo', 'WhatsApp Business']::text[], 'facil', null, true),
  ('datos-de-facturas-en-pdf', 'Sacar datos de facturas en PDF', 'Lee facturas de proveedores y arma una tabla con emisor, fecha, número e importe para pegar en tu hoja.', 'Las facturas llegan en PDF al correo y alguien las vuelve a escribir en la hoja de gastos.

El asistente extrae emisor, fecha, número de documento, importe e impuesto si aparece. Si un campo no se lee, deja la celda vacía en lugar de adivinar.

Prueba con diez facturas de proveedores distintos. Compara contra el PDF. Cuando falle un formato, guarda ese archivo como ejemplo de lo que hay que mirar a mano.

Esto no sustituye al sistema contable. Solo evita el copiado inicial.', array['finanzas', 'administracion']::text[], array['PDF', 'Correo', 'Google Sheets']::text[], 'medio', null, true),
  ('ingreso-de-alguien-nuevo', 'Checklist para el ingreso de alguien nuevo', 'Arma la lista de la primera semana de una persona nueva según el rol, con accesos, tareas y a quién preguntar.', 'Cuando entra alguien, el conocimiento está en la cabeza de quien ya está. La primera semana se vuelve una cadena de mensajes.

El asistente ordena un checklist a partir de un documento base: accesos, herramientas, primeras tareas y las tres personas de contacto. Puedes tener una versión para el local y otra para quien trabaja en remoto.

Escribe el documento base una vez. Cada ingreso, indica el rol y la fecha de inicio para que arme la lista de esa persona.

No pongas contraseñas en el chat del asistente. Los accesos se entregan por el canal seguro que ya uses.', array['equipo']::text[], array['Google Docs', 'Notion', 'ChatGPT']::text[], 'facil', null, true),
  ('dudas-internas-del-equipo', 'Responder dudas internas del equipo', 'El equipo pregunta por horarios, descuentos y procesos, y el asistente contesta solo con el manual interno.', 'Las mismas dudas llegan por chat interno: cómo se hace un cambio, qué descuento está permitido, a qué hora cierra la caja.

Cargas el manual y el asistente responde con la sección de donde salió la respuesta. Si el manual no lo dice, responde “no está escrito” y no completa el hueco.

Mantén el manual corto y con dueño. Una persona avisa cuando una regla cambia.

Úsalo dentro del equipo. No lo publiques como atención al cliente sin revisarlo.', array['equipo', 'operaciones']::text[], array['Manual interno', 'Slack', 'ChatGPT']::text[], 'facil', null, true),
  ('fichas-en-otro-idioma', 'Pasar fichas de producto a otro idioma', 'Traduce fichas manteniendo medidas, nombres propios y advertencias, para un segundo mercado o para clientes que escriben en otra lengua.', 'Quieres vender en otro idioma y el catálogo solo está en uno. Traducir a mano frena la publicación.

El asistente traduce la ficha y deja intactos números, tallas, ingredientes y nombres de marca. Marca las frases que son legales o de seguridad para que un hablante nativo las mire.

Haz una primera tanda de veinte fichas, no del catálogo entero. Compara con alguien que hable el idioma de tus clientes.

No publiques advertencias de uso traducidas a ciegas.', array['marketing']::text[], array['Hoja de catálogo', 'ChatGPT', 'Claude']::text[], 'facil', null, true),
  ('guion-de-visita-comercial', 'Guion breve para una visita comercial', 'Con lo que ya sabes del cliente, prepara tres preguntas, un objetivo de la visita y un siguiente paso.', 'Antes de una visita, el tiempo se va en buscar notas viejas en el correo.

Pegas esas notas. El asistente devuelve una página: quién es el cliente, qué quedó pendiente, tres preguntas y el siguiente paso que tú quieres proponer. No inventa una historia de la empresa.

Guarda las notas de cada cuenta en el mismo lugar, aunque sea una hoja. Pide el guion el día anterior.

El guion no es un discurso para leer en voz alta. Es una lista para no olvidar lo importante.', array['ventas']::text[], array['Notas de clientes', 'Correo', 'ChatGPT']::text[], 'facil', null, true),
  ('recompra-de-pedidos-habituales', 'Detectar pedidos que se pueden repetir', 'Mira el historial de pedidos y señala clientes que suelen comprar en ciclo y todavía no reponen.', 'Algunos clientes compran el mismo insumo cada mes. Si nadie mira el historial, el pedido se va a otro proveedor.

El asistente agrupa por cliente y producto, estima el ritmo solo si hay varias compras, y lista a quién valdría escribir esta semana. Si hay una sola compra, no inventa un ciclo.

Necesitas una exportación con fecha, cliente y producto. Tú escribes el mensaje. El asistente solo propone la lista.

No llames “cliente perdido” a quien compró una vez hace un año.', array['ventas', 'operaciones']::text[], array['Historial de pedidos', 'Google Sheets', 'ChatGPT']::text[], 'medio', null, true),
  ('revision-de-contrato-corto', 'Primera lectura de un contrato corto', 'Lista plazos, montos, renovación y obligaciones de un contrato breve para que llegues a la revisión legal con preguntas concretas.', 'Los contratos de arriendo, de un proveedor o de un freelance se firman con prisa y después nadie encuentra la fecha de aviso.

El asistente lee el PDF y extrae: partes, vigencia, cómo se renueva, montos, y qué pasa si una parte quiere salir. Cita el número de cláusula. Si no encuentra un punto, lo dice.

Úsalo para llegar mejor preparado a quien te asesora, o para armar tu propia lista de fechas. No lo uses como única lectura de un contrato grande o de algo que no entiendes.

Esto no es asesoría legal. No firmes solo porque el resumen se ve ordenado.', array['administracion']::text[], array['PDF', 'Claude', 'ChatGPT']::text[], 'medio', null, true),
  ('informe-de-lo-que-ya-mediste', 'Informe de la semana con números que ya exportaste', 'Redacta un informe corto a partir de una exportación de visitas, mensajes o ventas. No calcula una campaña que no mediste.', 'Tienes una exportación de la tienda, del correo o de las redes, y nadie la convierte en un párrafo para el equipo.

El asistente describe solo lo que viene en el archivo: qué subió, qué bajó y qué dato falta. No explica el “porqué” si el archivo no lo trae. No compara contra un benchmark inventado.

Pide siempre la misma estructura: tres observaciones y una pregunta para la próxima semana. Guarda el archivo de origen junto al texto.

Si la exportación está incompleta, el informe también lo está. El asistente no completa huecos.', array['marketing', 'finanzas']::text[], array['Exportación CSV', 'Google Sheets', 'ChatGPT']::text[], 'facil', null, true),
  ('leer-audios-de-clientes', 'Leer los audios de clientes sin escucharlos', 'La transcripción de WhatsApp pasa el audio de un cliente a texto para anotar el pedido o la pregunta.', 'Los clientes dejan el pedido o la duda en un audio de WhatsApp. Escuchar cada nota de voz frena anotar lo que pidieron.

WhatsApp puede mostrar ese audio como texto. La transcripción viene apagada. Se activa en Ajustes, en Chats, en Transcripciones de mensajes de voz. Se genera en el dispositivo. El español está entre los idiomas que admite la ayuda oficial.

El texto puede equivocarse. Revisa montos, cantidades y direcciones antes de confirmar un pedido. Si algo no cierra, pide el dato por escrito.

Quien envía el audio no ve la transcripción. La lees tú en el chat donde llegó.', array['atencion', 'ventas']::text[], array['WhatsApp', 'WhatsApp Business']::text[], 'facil', 'https://faq.whatsapp.com/241617298315321/?cms_platform=android&locale=es_ES', false),
  ('preguntar-manuales-de-proveedores', 'Preguntar a los manuales de tus proveedores', 'Subes fichas, catálogos o manuales de un proveedor y preguntas sobre esos documentos, no sobre el manual interno.', 'A veces la respuesta no está en el manual del equipo. Está en la ficha técnica, el catálogo o el manual de un proveedor.

En NotebookLM armas un cuaderno y subes esos archivos. Sirven PDF y documentos de Google Drive. La ayuda indica que el modelo usa las fuentes que cargaste para responder. Pregunta por un dato concreto, como una medida o un modo de uso, y contrasta la frase con el archivo antes de repetirla.

No subas un documento si no tienes derecho a usarlo. Esta ficha no reemplaza las dudas internas del equipo: aquí las fuentes son de un tercero.', array['operaciones', 'equipo']::text[], array['NotebookLM', 'Google Drive', 'PDF']::text[], 'facil', 'https://support.google.com/notebooklm/answer/16215270', false),
  ('fondo-limpio-fotos-de-producto', 'Fondo limpio para fotos de producto', 'Quitas el fondo de las fotos del catálogo en Canva, también en una carpeta de hasta 50 imágenes.', 'Las fotos de producto a veces traen la mesa, el piso u otro fondo. En el catálogo se ven distintas entre sí.

Canva puede quitar ese fondo. En el editor eliges la foto y usas Quitar fondo. En Proyectos también puedes aplicarlo a una carpeta: la ayuda dice que una carpeta con más de 50 imágenes no ofrece esa opción. Al terminar, Canva deja las fotos originales y crea una carpeta con el resultado.

La función está en planes de pago. La ayuda indica que se puede probar una vez sin pagar. Mira el recorte antes de publicar. Si Canva no distingue el producto, esa foto puede quedar sin cambio.

Esto no cambia el precio ni la descripción. Solo la imagen.', array['marketing']::text[], array['Canva']::text[], 'facil', 'https://www.canva.com/help/background-remover/', false),
  ('resumir-respuestas-abiertas', 'Resumir las respuestas abiertas de una encuesta', 'Gemini resume las respuestas de texto de un formulario cuando hay entre 3 y 200, y puede agrupar temas en una hoja.', 'Las preguntas abiertas de una encuesta dejan muchas frases. Leerlas una por una retrasa ver de qué hablan los clientes.

En Google Forms, Gemini resume esas respuestas de texto cuando hay entre 3 y 200. No arma ese resumen si el formulario está marcado como cuestionario. Desde el resumen puedes agrupar temas y abrirlos en Google Sheets.

Hace falta un plan elegible de Google Workspace o de Google AI. La ayuda indica que, por ahora, la función está en la computadora y en inglés. El resumen no queda guardado solo: cópialo si lo quieres conservar.

No trates el texto generado como un dato que la encuesta no trae.', array['atencion', 'marketing']::text[], array['Google Forms', 'Google Sheets']::text[], 'medio', 'https://support.google.com/docs/answer/16231981', false)
on conflict (slug) do nothing;
