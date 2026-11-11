import type { Locale } from "./config";

/** Each row: [en, tr, ar, es, fr]. */
type Row = [string, string, string, string, string];
const ORDER: Locale[] = ["en", "tr", "ar", "es", "fr"];
function pick(rows: Record<string, Row>, loc: Locale): Record<string, string> {
  const i = ORDER.indexOf(loc);
  return Object.fromEntries(Object.entries(rows).map(([k, v]) => [k, v[i]]));
}

const fields: Record<string, Row> = {
  name: ["Full name", "Ad soyad", "الاسم الكامل", "Nombre completo", "Nom complet"],
  email: ["Email", "E-posta", "البريد الإلكتروني", "Correo electrónico", "E-mail"],
  phone: ["Phone (optional)", "Telefon (isteğe bağlı)", "الهاتف (اختياري)", "Teléfono (opcional)", "Téléphone (facultatif)"],
  topic: ["Topic", "Konu", "الموضوع", "Tema", "Sujet"],
  message: ["Message", "Mesaj", "الرسالة", "Mensaje", "Message"],
  consent: ["I agree that this information may be stored to reply to my request.", "Talebime yanıt verilmesi için bu bilgilerin saklanmasını kabul ediyorum.", "أوافق على حفظ هذه المعلومات للرد على طلبي.", "Acepto que se guarde esta información para responder a mi solicitud.", "J’accepte que ces informations soient conservées afin de répondre à ma demande."],
  businessName: ["Business name", "İşletme adı", "اسم النشاط التجاري", "Nombre del negocio", "Nom de l’entreprise"],
  category: ["Category", "Kategori", "الفئة", "Categoría", "Catégorie"],
  contactPerson: ["Contact person", "İletişim kişisi", "الشخص المسؤول", "Persona de contacto", "Personne à contacter"],
  website: ["Website (optional)", "Web sitesi (isteğe bağlı)", "الموقع الإلكتروني (اختياري)", "Sitio web (opcional)", "Site web (facultatif)"],
  description: ["Describe your business", "İşletmenizi tanıtın", "صِف نشاطك التجاري", "Describe tu negocio", "Décrivez votre activité"],
  requestType: ["Type of request", "Talep türü", "نوع الطلب", "Tipo de solicitud", "Type de demande"],
  travelers: ["Number of travelers", "Yolcu sayısı", "عدد المسافرين", "Número de viajeros", "Nombre de voyageurs"],
  preferredDate: ["Preferred date (optional)", "Tercih edilen tarih (isteğe bağlı)", "التاريخ المفضل (اختياري)", "Fecha preferida (opcional)", "Date souhaitée (facultatif)"],
  notes: ["Details", "Ayrıntılar", "التفاصيل", "Detalles", "Détails"],
  serviceType: ["Service type", "Hizmet türü", "نوع الخدمة", "Tipo de servicio", "Type de service"],
  sourceLanguage: ["From language", "Kaynak dil", "من اللغة", "Idioma de origen", "Langue source"],
  targetLanguage: ["To language", "Hedef dil", "إلى اللغة", "Idioma de destino", "Langue cible"],
  deadline: ["Deadline (optional)", "Son tarih (isteğe bağlı)", "الموعد النهائي (اختياري)", "Fecha límite (opcional)", "Échéance (facultatif)"],
  requestKind: ["Request", "Talep", "الطلب", "Solicitud", "Demande"],
  origin: ["From (optional)", "Kalkış (isteğe bağlı)", "من (اختياري)", "Origen (opcional)", "Départ (facultatif)"],
  destination: ["Destination", "Varış noktası", "الوجهة", "Destino", "Destination"],
  departDate: ["Departure date (optional)", "Gidiş tarihi (isteğe bağlı)", "تاريخ المغادرة (اختياري)", "Fecha de salida (opcional)", "Date de départ (facultatif)"],
  returnDate: ["Return date (optional)", "Dönüş tarihi (isteğe bağlı)", "تاريخ العودة (اختياري)", "Fecha de regreso (opcional)", "Date de retour (facultatif)"],
  country: ["Country", "Ülke", "الدولة", "País", "Pays"],
  city: ["City", "Şehir", "المدينة", "Ciudad", "Ville"],
  address: ["Delivery address", "Teslimat adresi", "عنوان التسليم", "Dirección de entrega", "Adresse de livraison"],
  organization: ["Organization (optional)", "Kuruluş (isteğe bağlı)", "الجهة (اختياري)", "Organización (opcional)", "Organisation (facultatif)"],
};
const options: Record<string, Record<string, Row>> = {
  topic: {
    general: ["General question", "Genel soru", "استفسار عام", "Consulta general", "Question générale"],
    business: ["Business or investment", "İş veya yatırım", "أعمال أو استثمار", "Negocios o inversión", "Affaires ou investissement"],
    listing: ["Listing my business", "İşletmemi eklemek", "إدراج نشاطي", "Registrar mi negocio", "Inscrire mon activité"],
    store: ["Store", "Mağaza", "المتجر", "Tienda", "Boutique"],
    translation: ["Translation", "Çeviri", "الترجمة", "Traducción", "Traduction"],
    other: ["Other", "Diğer", "أخرى", "Otro", "Autre"],
  },
  category: {
    "travel-tourism": ["Travel & tourism", "Seyahat ve turizm", "السفر والسياحة", "Viajes y turismo", "Voyage et tourisme"],
    "real-estate": ["Real estate", "Gayrimenkul", "العقارات", "Inmobiliaria", "Immobilier"],
    shopping: ["Shopping", "Alışveriş", "التسوق", "Compras", "Shopping"],
    "business-investment": ["Business & investment", "İş ve yatırım", "الأعمال والاستثمار", "Negocios e inversión", "Affaires et investissement"],
    education: ["Education", "Eğitim", "التعليم", "Educación", "Éducation"],
    "health-wellness": ["Health & wellness", "Sağlık ve zindelik", "الصحة والعافية", "Salud y bienestar", "Santé et bien-être"],
    other: ["Other", "Diğer", "أخرى", "Otro", "Autre"],
  },
  requestType: {
    trip: ["Trip planning", "Gezi planlama", "تخطيط رحلة", "Planificación de viaje", "Organisation de voyage"],
    transport: ["Transport", "Ulaşım", "النقل", "Transporte", "Transport"],
    stay: ["Accommodation", "Konaklama", "الإقامة", "Alojamiento", "Hébergement"],
    experience: ["Guided experience", "Rehberli deneyim", "تجربة مع مرشد", "Experiencia guiada", "Expérience guidée"],
    other: ["Other", "Diğer", "أخرى", "Otro", "Autre"],
  },
  translationType: {
    written: ["Written translation", "Yazılı çeviri", "ترجمة تحريرية", "Traducción escrita", "Traduction écrite"],
    interpreting: ["Interpreting", "Sözlü çeviri", "ترجمة فورية", "Interpretación", "Interprétation"],
    assistance: ["Language assistance", "Dil desteği", "مساعدة لغوية", "Asistencia lingüística", "Assistance linguistique"],
    certified: ["Certified (sworn) translation", "Yeminli çeviri", "ترجمة معتمدة (محلّفة)", "Traducción jurada", "Traduction assermentée"],
  },
  requestKind: {
    flight: ["Flights", "Uçuş", "طيران", "Vuelos", "Vols"],
    hotel: ["Hotels", "Otel", "فنادق", "Hoteles", "Hôtels"],
  },
};
const errors: Record<string, Row> = {
  required: ["This field is required", "Bu alan zorunludur", "هذا الحقل مطلوب", "Este campo es obligatorio", "Ce champ est obligatoire"],
  tooShort: ["Too short", "Çok kısa", "قصير جداً", "Demasiado corto", "Trop court"],
  tooLong: ["Too long", "Çok uzun", "طويل جداً", "Demasiado largo", "Trop long"],
  email: ["Enter a valid email address", "Geçerli bir e-posta girin", "أدخل بريداً إلكترونياً صحيحاً", "Introduce un correo válido", "Saisissez un e-mail valide"],
  url: ["Enter a valid web address (https://…)", "Geçerli bir adres girin (https://…)", "أدخل رابطاً صحيحاً (https://…)", "Introduce una dirección válida (https://…)", "Saisissez une adresse valide (https://…)"],
  phone: ["Enter a valid phone number", "Geçerli bir telefon girin", "أدخل رقم هاتف صحيحاً", "Introduce un teléfono válido", "Saisissez un numéro valide"],
  invalid: ["Invalid value", "Geçersiz değer", "قيمة غير صالحة", "Valor no válido", "Valeur invalide"],
  pastDate: ["The date cannot be in the past", "Tarih geçmişte olamaz", "لا يمكن أن يكون التاريخ في الماضي", "La fecha no puede ser pasada", "La date ne peut pas être passée"],
  range: ["Enter a whole number in the allowed range", "İzin verilen aralıkta bir tam sayı girin", "أدخل عدداً صحيحاً ضمن النطاق المسموح", "Introduce un número entero válido", "Saisissez un nombre entier valide"],
  consent: ["Please accept to continue", "Devam etmek için onaylayın", "يرجى الموافقة للمتابعة", "Acepta para continuar", "Veuillez accepter pour continuer"],
  sameLanguage: ["Choose two different languages", "İki farklı dil seçin", "اختر لغتين مختلفتين", "Elige dos idiomas distintos", "Choisissez deux langues différentes"],
  lines: ["Your cart is empty or contains an item that is no longer available", "Sepetiniz boş veya artık mevcut olmayan bir ürün içeriyor", "سلتك فارغة أو تحتوي على منتج لم يعد متاحاً", "Tu carrito está vacío o contiene un artículo que ya no está disponible", "Votre panier est vide ou contient un article qui n’est plus disponible"],
  dateOrder: ["Return date must be after departure", "Dönüş tarihi gidişten sonra olmalı", "يجب أن يكون تاريخ العودة بعد المغادرة", "La vuelta debe ser posterior a la salida", "Le retour doit suivre le départ"],
};
const ui: Record<string, Row> = {
  select: ["Select…", "Seçin…", "اختر…", "Selecciona…", "Sélectionner…"],
  commonLanguages: ["Common languages", "Yaygın diller", "لغات شائعة", "Idiomas habituales", "Langues courantes"],
  otherLanguages: ["All languages", "Tüm diller", "كل اللغات", "Todos los idiomas", "Toutes les langues"],
  otherLanguage: ["Other language", "Başka dil", "لغة أخرى", "Otro idioma", "Autre langue"],
  summaryTitle: ["Please fix the following", "Lütfen şunları düzeltin", "يرجى تصحيح ما يلي", "Corrige lo siguiente", "Veuillez corriger ce qui suit"],
  submitting: ["Sending…", "Gönderiliyor…", "جارٍ الإرسال…", "Enviando…", "Envoi…"],
  successTitle: ["Request received", "Talep alındı", "تم استلام طلبك", "Solicitud recibida", "Demande reçue"],
  successBody: ["We recorded your request. This does not create a booking, order or payment.", "Talebinizi kaydettik. Bu bir rezervasyon, sipariş veya ödeme oluşturmaz.", "سجّلنا طلبك. هذا لا يُنشئ حجزاً ولا طلب شراء ولا دفعاً.", "Hemos registrado tu solicitud. Esto no crea una reserva, pedido ni pago.", "Nous avons enregistré votre demande. Cela ne crée ni réservation, ni commande, ni paiement."],
  requestId: ["Reference", "Referans", "الرقم المرجعي", "Referencia", "Référence"],
  another: ["Send another", "Yeni talep", "طلب آخر", "Enviar otra", "Envoyer une autre"],
  serverError: ["We could not save your request. Please try again.", "Talebiniz kaydedilemedi. Lütfen tekrar deneyin.", "تعذّر حفظ طلبك. حاول مرة أخرى.", "No pudimos guardar tu solicitud. Inténtalo de nuevo.", "Impossible d’enregistrer votre demande. Réessayez."],
  networkError: ["Network problem. Check your connection and try again.", "Ağ sorunu. Bağlantınızı kontrol edip tekrar deneyin.", "مشكلة في الشبكة. تحقق من اتصالك وحاول مجدداً.", "Problema de red. Revisa tu conexión e inténtalo de nuevo.", "Problème réseau. Vérifiez votre connexion et réessayez."],
  rateLimited: ["Too many requests. Please wait a few minutes.", "Çok fazla istek. Lütfen birkaç dakika bekleyin.", "طلبات كثيرة. يرجى الانتظار بضع دقائق.", "Demasiadas solicitudes. Espera unos minutos.", "Trop de demandes. Patientez quelques minutes."],
  notSent: ["Not sent", "Gönderilemedi", "لم يُرسَل", "No enviado", "Non envoyé"],
  retry: ["Try again", "Tekrar dene", "حاول مجدداً", "Reintentar", "Réessayer"],
  "submit.contact": ["Send message", "Mesaj gönder", "أرسل الرسالة", "Enviar mensaje", "Envoyer le message"],
  "submit.listing": ["Send listing request", "Listeleme talebi gönder", "أرسل طلب الإدراج", "Enviar solicitud", "Envoyer la demande"],
  "submit.tourism": ["Send request", "Talep gönder", "أرسل الطلب", "Enviar solicitud", "Envoyer la demande"],
  "submit.translation": ["Send request", "Talep gönder", "أرسل الطلب", "Enviar solicitud", "Envoyer la demande"],
  "submit.travelAssist": ["Send request", "Talep gönder", "أرسل الطلب", "Enviar solicitud", "Envoyer la demande"],
  "submit.order": ["Send order request", "Sipariş talebi gönder", "أرسل طلب الشراء", "Enviar solicitud de pedido", "Envoyer la demande de commande"],
  "submit.premium": ["Join the early-access list", "Erken erişim listesine katıl", "سجّل في قائمة الوصول المبكر", "Unirme a la lista de acceso anticipado", "Rejoindre la liste d’accès anticipé"],
};
export const pageIntro: Record<string, Row> = {
  contact: ["Write to us. We reply by email.", "Bize yazın. E-posta ile yanıtlarız.", "راسلنا. نردّ عبر البريد الإلكتروني.", "Escríbenos. Respondemos por correo.", "Écrivez-nous. Nous répondons par e-mail."],
  listing: ["Ask to list your business in the Istanbul directory. Listings are reviewed before they appear.", "İşletmenizin İstanbul rehberinde yer almasını isteyin. Listeler yayından önce incelenir.", "اطلب إدراج نشاطك في دليل إسطنبول. تُراجَع الطلبات قبل ظهورها.", "Solicita incluir tu negocio en el directorio de Estambul. Las fichas se revisan antes de publicarse.", "Demandez à inscrire votre activité dans l’annuaire d’Istanbul. Les fiches sont vérifiées avant publication."],
  premium: ["Market intelligence for investors and entrepreneurs, prepared with the parent company’s modelling team. Nothing here is on sale yet; join the early-access list.", "Yatırımcılar ve girişimciler için pazar istihbaratı; ana şirketin modelleme ekibiyle hazırlanır. Burada henüz satışa sunulan bir şey yok; erken erişim listesine katılın.", "معلومات السوق للمستثمرين ورواد الأعمال، يعدّها فريق النمذجة في الشركة الأم. لا شيء هنا معروض للبيع بعد؛ سجّل في قائمة الوصول المبكر.", "Inteligencia de mercado para inversores y emprendedores, preparada con el equipo de modelización de la empresa matriz. Aún no hay nada a la venta; únete a la lista de acceso anticipado.", "Intelligence de marché pour investisseurs et entrepreneurs, préparée avec l’équipe de modélisation de la société mère. Rien n’est encore en vente ; rejoignez la liste d’accès anticipé."],
  travel: ["Tell us what you need for your trip. We record the request; no booking or payment is made here.", "Geziniz için neye ihtiyacınız olduğunu yazın. Talebi kaydederiz; burada rezervasyon veya ödeme yapılmaz.", "أخبرنا بما تحتاجه لرحلتك. نسجّل الطلب فقط؛ لا حجز ولا دفع هنا.", "Cuéntanos qué necesitas para tu viaje. Registramos la solicitud; aquí no se hace ninguna reserva ni pago.", "Dites-nous ce dont vous avez besoin pour votre voyage. Nous enregistrons la demande ; aucune réservation ni paiement ici."],
  translation: ["Request translation or language help. We record the request; availability of certified (sworn) translation is confirmed with you case by case.", "Çeviri veya dil desteği isteyin. Talebi kaydederiz; yeminli çeviri imkânı her talep için sizinle ayrıca teyit edilir.", "اطلب ترجمة أو مساعدة لغوية. نسجّل الطلب، ويُؤكَّد معك توفّر الترجمة المعتمدة (المحلّفة) في كل حالة على حدة.", "Solicita traducción o ayuda lingüística. Registramos la solicitud; la disponibilidad de traducción jurada se confirma contigo caso por caso.", "Demandez une traduction ou une aide linguistique. Nous enregistrons la demande ; la disponibilité d’une traduction assermentée est confirmée avec vous au cas par cas."],
  flights: ["Ask for help with flights or hotels. There are no live bookings, prices or availability on this site.", "Uçuş veya otel için yardım isteyin. Bu sitede canlı rezervasyon, fiyat veya müsaitlik bilgisi yoktur.", "اطلب المساعدة في الطيران أو الفنادق. لا توجد على هذا الموقع حجوزات ولا أسعار ولا توفّر مباشر.", "Pide ayuda con vuelos u hoteles. Este sitio no ofrece reservas, precios ni disponibilidad en tiempo real.", "Demandez de l’aide pour des vols ou des hôtels. Ce site n’affiche ni réservation, ni prix, ni disponibilité en direct."],
};

export type FormsDict = {
  fields: Record<string, string>;
  options: Record<string, Record<string, string>>;
  errors: Record<string, string>;
  ui: Record<string, string>;
};
export function getFormsDict(locale: Locale): FormsDict {
  return {
    fields: pick(fields, locale),
    options: Object.fromEntries(Object.entries(options).map(([g, rows]) => [g, pick(rows, locale)])),
    errors: pick(errors, locale),
    ui: pick(ui, locale),
  };
}
export function getIntro(key: string, locale: Locale): string {
  return pageIntro[key][ORDER.indexOf(locale)];
}
