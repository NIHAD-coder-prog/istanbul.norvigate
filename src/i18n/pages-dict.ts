import type { Locale } from "./config";
type Row = [string, string, string, string, string];
const ORDER: Locale[] = ["en", "tr", "ar", "es", "fr"];
const rows: Record<string, Row> = {
  // shared labels
  editorial: ["Editorial draft", "Editoryal taslak", "مسودة تحريرية", "Borrador editorial", "Brouillon éditorial"],
  lastUpdated: ["Last updated", "Son güncelleme", "آخر تحديث", "Última actualización", "Dernière mise à jour"],
  reviewed: ["Reviewed", "Gözden geçirildi", "روجع في", "Revisado", "Révisé le"],
  checked: ["Checked on", "Kontrol tarihi", "تاريخ التحقق", "Comprobado el", "Vérifié le"],
  all: ["All", "Tümü", "الكل", "Todos", "Tous"],
  back: ["Back", "Geri", "رجوع", "Volver", "Retour"],
  timeSensitive: ["Time-sensitive: verify before relying on it", "Zamana duyarlı: güvenmeden önce doğrulayın", "حساس للوقت: تحقق قبل الاعتماد عليه", "Sensible al tiempo: verifica antes de fiarte", "Sensible au temps : vérifiez avant de vous y fier"],
  officialLinks: ["Official links", "Resmî bağlantılar", "روابط رسمية", "Enlaces oficiales", "Liens officiels"],
  newTab: ["opens in a new tab", "yeni sekmede açılır", "يُفتح في تبويب جديد", "se abre en una pestaña nueva", "s’ouvre dans un nouvel onglet"],
  // services
  svcLead: ["Browse sample service providers by category. Profiles show only what is known; nothing here is verified.", "Örnek hizmet sağlayıcılarını kategoriye göre inceleyin. Profiller yalnızca bilinenleri gösterir; burada hiçbir şey doğrulanmış değildir.", "تصفّح مزوّدي خدمات تجريبيين حسب الفئة. تعرض الملفات ما هو معروف فقط؛ ولا شيء هنا موثّق.", "Explora proveedores de servicios de muestra por categoría. Los perfiles muestran solo lo conocido; nada aquí está verificado.", "Parcourez des prestataires de services d’exemple par catégorie. Les profils n’affichent que ce qui est connu ; rien ici n’est vérifié."],
  count: ["Listings: {n}", "İlan sayısı: {n}", "عدد الإدراجات: {n}", "Fichas: {n}", "Fiches : {n}"],
  noListings: ["No listings in this category yet.", "Bu kategoride henüz ilan yok.", "لا توجد إدراجات في هذه الفئة بعد.", "Aún no hay fichas en esta categoría.", "Aucune fiche dans cette catégorie pour l’instant."],
  area: ["Area", "Bölge", "الحي", "Zona", "Quartier"],
  serviceArea: ["Service area", "Hizmet bölgesi", "منطقة الخدمة", "Zona de servicio", "Zone de service"],
  languages: ["Languages", "Diller", "اللغات", "Idiomas", "Langues"],
  accessibility: ["Accessibility", "Erişilebilirlik", "إمكانية الوصول", "Accesibilidad", "Accessibilité"],
  noContact: ["This sample has no contact details. Send an enquiry through the contact form.", "Bu örneğin iletişim bilgisi yok. İletişim formundan talep gönderin.", "لا توجد بيانات اتصال لهذا المثال. أرسل استفساراً عبر نموذج الاتصال.", "Este ejemplo no tiene datos de contacto. Envía una consulta por el formulario de contacto.", "Cet exemple n’a pas de coordonnées. Envoyez une demande via le formulaire de contact."],
  // experiences + guide + faq + flights
  expLead: ["General descriptions of well-known places. Visiting rules and hours change; always check the official source.", "Tanınmış yerlerin genel tanıtımları. Ziyaret kuralları ve saatler değişir; her zaman resmî kaynağa bakın.", "أوصاف عامة لأماكن معروفة. تتغير قواعد الزيارة والمواعيد؛ راجع دائماً المصدر الرسمي.", "Descripciones generales de lugares conocidos. Las normas y horarios de visita cambian; consulta siempre la fuente oficial.", "Descriptions générales de lieux connus. Les règles et horaires de visite changent ; consultez toujours la source officielle."],
  duration: ["Duration", "Süre", "المدة", "Duración", "Durée"],
  guideLead: ["Practical, deliberately general information. Anything time-sensitive is flagged; confirm with the official links.", "Pratik ve bilinçli olarak genel tutulmuş bilgiler. Zamana duyarlı olan her şey işaretlenmiştir; resmî bağlantılardan doğrulayın.", "معلومات عملية وعامة عن قصد. كل ما هو حساس للوقت موسوم؛ تأكد من الروابط الرسمية.", "Información práctica y deliberadamente general. Todo lo sensible al tiempo está señalado; confirma con los enlaces oficiales.", "Informations pratiques et volontairement générales. Tout ce qui est sensible au temps est signalé ; confirmez avec les liens officiels."],
  faqLead: ["Short answers about what this site is and is not.", "Bu sitenin ne olduğu ve ne olmadığı hakkında kısa yanıtlar.", "إجابات قصيرة عمّا هو هذا الموقع وما ليس هو.", "Respuestas breves sobre lo que este sitio es y no es.", "Réponses courtes sur ce que ce site est et n’est pas."],
  flightsH: ["Flights", "Uçuşlar", "الطيران", "Vuelos", "Vols"],
  hotelsH: ["Hotels", "Oteller", "الفنادق", "Hoteles", "Hôtels"],
  extNote: ["These are plain links to other websites. We have no partnership or affiliate arrangement with them, and no prices or availability are shown here. Each link was checked on the date shown.", "Bunlar diğer web sitelerine giden düz bağlantılardır. Onlarla ortaklık veya komisyon anlaşmamız yoktur; burada fiyat veya müsaitlik gösterilmez. Her bağlantı gösterilen tarihte kontrol edilmiştir.", "هذه روابط عادية إلى مواقع أخرى. لا نملك شراكة ولا اتفاق عمولة معها، ولا تُعرض هنا أسعار أو توفّر. فُحص كل رابط في التاريخ المبيّن.", "Son enlaces simples a otros sitios web. No tenemos acuerdo de colaboración ni de afiliación con ellos y aquí no se muestran precios ni disponibilidad. Cada enlace se comprobó en la fecha indicada.", "Ce sont de simples liens vers d’autres sites. Nous n’avons ni partenariat ni accord d’affiliation avec eux, et aucun prix ni disponibilité n’est affiché ici. Chaque lien a été vérifié à la date indiquée."],
  askHelp: ["Or ask us for help", "Veya bizden yardım isteyin", "أو اطلب مساعدتنا", "O pídenos ayuda", "Ou demandez-nous de l’aide"],
  // search
  searchHint: ["Type a word to search services, experiences, the city guide and the store.", "Hizmetlerde, deneyimlerde, şehir rehberinde ve mağazada aramak için bir sözcük yazın.", "اكتب كلمة للبحث في الخدمات والتجارب ودليل المدينة والمتجر.", "Escribe una palabra para buscar en servicios, experiencias, la guía de la ciudad y la tienda.", "Saisissez un mot pour chercher dans les services, expériences, le guide de la ville et la boutique."],
  results: ["{n} results for “{q}”", "“{q}” için {n} sonuç", "{n} نتيجة عن «{q}»", "{n} resultados para «{q}»", "{n} résultats pour « {q} »"],
  noResults: ["No results. Try another word.", "Sonuç yok. Başka bir sözcük deneyin.", "لا نتائج. جرّب كلمة أخرى.", "Sin resultados. Prueba con otra palabra.", "Aucun résultat. Essayez un autre mot."],
  tProvider: ["Services", "Hizmetler", "الخدمات", "Servicios", "Services"],
  tExperience: ["Things to do", "Deneyimler", "أنشطة وتجارب", "Qué hacer", "Activités"],
  tProduct: ["Store", "Mağaza", "المتجر", "Tienda", "Boutique"],
  tGuide: ["City guide", "Şehir rehberi", "دليل المدينة", "Guía de la ciudad", "Guide de la ville"],
  // store
  storeLead: ["A side module of the gate. Everything here is sample content: browse, fill a cart and send an order request. Nothing is charged, reserved or shipped.", "Kapının yan bir modülü. Buradaki her şey örnektir: göz atın, sepet oluşturun ve sipariş talebi gönderin. Hiçbir ücret alınmaz, ayrılmaz veya gönderilmez.", "وحدة جانبية في البوابة. كل ما هنا محتوى تجريبي: تصفّح واملأ السلة وأرسل طلب شراء. لا يُخصم أي مبلغ ولا يُحجز ولا يُشحن شيء.", "Un módulo complementario de la puerta. Todo aquí es contenido de muestra: explora, llena un carrito y envía una solicitud de pedido. No se cobra, reserva ni envía nada.", "Un module complémentaire de la porte. Tout ici est du contenu d’exemple : parcourez, remplissez un panier et envoyez une demande de commande. Rien n’est facturé, réservé ni expédié."],
  searchProducts: ["Search products", "Ürün ara", "ابحث في المنتجات", "Buscar productos", "Rechercher des produits"],
  sort: ["Sort", "Sırala", "الترتيب", "Ordenar", "Trier"],
  sortRelevance: ["Relevance", "İlgi", "الصلة", "Relevancia", "Pertinence"],
  sortNameAsc: ["Name A–Z", "Ad A–Z", "الاسم أ–ي", "Nombre A–Z", "Nom A–Z"],
  sortPriceAsc: ["Price: low to high", "Fiyat: artan", "السعر: من الأقل", "Precio: de menor a mayor", "Prix croissant"],
  sortPriceDesc: ["Price: high to low", "Fiyat: azalan", "السعر: من الأعلى", "Precio: de mayor a menor", "Prix décroissant"],
  from: ["From", "Başlangıç", "ابتداءً من", "Desde", "À partir de"],
  size: ["Size", "Boyut", "الحجم", "Tamaño", "Format"],
  qty: ["Quantity", "Adet", "الكمية", "Cantidad", "Quantité"],
  addToCart: ["Add to cart", "Sepete ekle", "أضف إلى السلة", "Añadir al carrito", "Ajouter au panier"],
  added: ["Added to cart", "Sepete eklendi", "أُضيف إلى السلة", "Añadido al carrito", "Ajouté au panier"],
  cart: ["Cart", "Sepet", "السلة", "Carrito", "Panier"],
  cartEmpty: ["Your cart is empty.", "Sepetiniz boş.", "سلتك فارغة.", "Tu carrito está vacío.", "Votre panier est vide."],
  remove: ["Remove", "Kaldır", "إزالة", "Quitar", "Retirer"],
  subtotal: ["Sample subtotal", "Örnek ara toplam", "المجموع الفرعي التجريبي", "Subtotal de muestra", "Sous-total d’exemple"],
  weight: ["Weight", "Ağırlık", "الوزن", "Peso", "Poids"],
  continueShop: ["Continue browsing", "Alışverişe devam et", "تابع التصفح", "Seguir explorando", "Continuer vos achats"],
  orderNote: ["This records an order request only. No payment is taken and nothing is reserved or shipped.", "Bu yalnızca bir sipariş talebi kaydeder. Ödeme alınmaz; hiçbir şey ayrılmaz veya gönderilmez.", "هذا يسجّل طلب شراء فقط. لا يُؤخذ أي دفع ولا يُحجز ولا يُشحن شيء.", "Esto solo registra una solicitud de pedido. No se cobra ni se reserva ni se envía nada.", "Cela enregistre seulement une demande de commande. Aucun paiement n’est pris et rien n’est réservé ni expédié."],
  ingredients: ["Ingredients", "İçindekiler", "المكوّنات", "Ingredientes", "Ingrédients"],
  allergens: ["Allergens", "Alerjenler", "مسببات الحساسية", "Alérgenos", "Allergènes"],
  allergensUnverified: ["Not verified for this sample.", "Bu örnek için doğrulanmamıştır.", "غير موثّق لهذا المثال.", "No verificado para este ejemplo.", "Non vérifié pour cet exemple."],
  storage: ["Storage", "Saklama", "التخزين", "Conservación", "Conservation"],
  shipping: ["Shipping", "Gönderim", "الشحن", "Envío", "Expédition"],
  shippingNone: ["Shipping is not enabled for any destination.", "Hiçbir varış noktası için gönderim etkin değil.", "الشحن غير مفعّل لأي وجهة.", "El envío no está habilitado para ningún destino.", "L’expédition n’est activée pour aucune destination."],
  previewOn: ["Owner preview: you can see every feature. Visitors see only the selected level.", "Sahip önizlemesi: tüm özellikleri görüyorsunuz. Ziyaretçiler yalnızca seçilen düzeyi görür.", "معاينة المالك: ترى كل المزايا. أما الزوار فيرون المستوى المحدَّد فقط.", "Vista previa del propietario: ves todas las funciones. Los visitantes ven solo el nivel elegido.", "Aperçu propriétaire : vous voyez toutes les fonctions. Les visiteurs ne voient que le niveau choisi."],
  previewOff: ["Exit preview", "Önizlemeden çık", "إنهاء المعاينة", "Salir de la vista previa", "Quitter l’aperçu"],
  // about
  aboutLead: ["NORVIGATE is a city-gateway company. Istanbul International Gate is its first gate.", "NORVIGATE bir şehir geçidi şirketidir. İstanbul Uluslararası Kapısı onun ilk kapısıdır.", "نورفيغيت شركة بوابات مدن. وبوابة إسطنبول العالمية هي أولى بواباتها.", "NORVIGATE es una empresa de puertas de entrada a ciudades. La Puerta Internacional de Estambul es su primera puerta.", "NORVIGATE est une entreprise de portes d’entrée vers les villes. La Porte internationale d’Istanbul est sa première porte."],
  aboutGates: ["Two gates in one site", "Tek sitede iki kapı", "بوابتان في موقع واحد", "Dos puertas en un solo sitio", "Deux portes dans un seul site"],
  aboutGatesText: ["A free gate for visitors (travel, services, experiences, guide and tools) and a Premium gate for investors and entrepreneurs, which is still planned. The store is a side module.", "Ziyaretçiler için ücretsiz bir kapı (seyahat, hizmetler, deneyimler, rehber ve araçlar) ve yatırımcılar ile girişimciler için henüz planlama aşamasında olan bir Premium kapı. Mağaza yan bir modüldür.", "بوابة مجانية للزائر (سفر وخدمات وتجارب ودليل وأدوات) وبوابة مميزة للمستثمرين ورواد الأعمال لا تزال ضمن خارطة الطريق. والمتجر وحدة جانبية.", "Una puerta gratuita para visitantes (viajes, servicios, experiencias, guía y herramientas) y una puerta Premium para inversores y emprendedores, que aún está en planificación. La tienda es un módulo complementario.", "Une porte gratuite pour les visiteurs (voyage, services, expériences, guide et outils) et une porte Premium pour les investisseurs et entrepreneurs, encore en projet. La boutique est un module complémentaire."],
  aboutName: ["The name", "Ad", "الاسم", "El nombre", "Le nom"],
  nor: ["Direction: we set your destination.", "Yön: varış noktanızı biz belirleriz.", "الاتجاه — نحدّد لك وجهتك.", "Dirección: marcamos tu destino.", "Direction : nous fixons votre destination."],
  vigi: ["Insight: we see the whole picture and watch what matters to you.", "Öngörü: resmin tamamını görür, sizin için önemli olana göz kulak oluruz.", "البصيرة — نرى الصورة كاملة ونتنبّه لما يهمّك.", "Visión: vemos el panorama completo y vigilamos lo que te importa.", "Perspicacité : nous voyons le tableau complet et veillons à ce qui compte pour vous."],
  gate: ["Your trusted entrance to the city.", "Şehre güvenilir girişiniz.", "البوابة — مدخلك الموثوق إلى المدينة.", "Tu entrada de confianza a la ciudad.", "Votre entrée de confiance dans la ville."],
  founder: ["Founder and CEO", "Kurucu ve CEO", "المؤسس والرئيس التنفيذي", "Fundador y CEO", "Fondateur et PDG"],
  sister: ["A company of NORVIGIQ", "NORVIGIQ şirketi", "شركة تابعة لمجموعة", "Una empresa de NORVIGIQ", "Une société de NORVIGIQ"],
};
export type PagesDict = Record<string, string>;
export function getPagesDict(locale: Locale): PagesDict {
  const i = ORDER.indexOf(locale);
  return Object.fromEntries(Object.entries(rows).map(([k, v]) => [k, v[i]]));
}
