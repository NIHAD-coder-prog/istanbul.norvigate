import type { Locale } from "./config";
type Row = [string, string, string, string, string];
const ORDER: Locale[] = ["en", "tr", "ar", "es", "fr"];
const i = (l: Locale) => ORDER.indexOf(l);

export const draftBanner: Row = [
  "Draft: not yet reviewed by a lawyer. This is not legal advice.",
  "Taslak: henüz bir avukat tarafından incelenmedi. Hukuki tavsiye değildir.",
  "مسودة: لم يراجعها محامٍ بعد. وليست استشارة قانونية.",
  "Borrador: aún no revisado por un abogado. No es asesoramiento jurídico.",
  "Projet : pas encore relu par un avocat. Ceci n’est pas un avis juridique.",
];
type Doc = { title: Row; sections: [Row, Row][] };
export const legalDocs: Record<string, Doc> = {
  privacy: {
    title: ["Privacy notice (KVKK)", "Gizlilik bildirimi (KVKK)", "إشعار الخصوصية (قانون حماية البيانات التركي)", "Aviso de privacidad (KVKK)", "Notice de confidentialité (KVKK)"],
    sections: [
      [["Who we are", "Biz kimiz", "من نحن", "Quiénes somos", "Qui sommes-nous"],
       ["NORVIGATE Istanbul is a pre-launch project run by Nihad Aldos in Istanbul. It is not yet a registered company.", "NORVIGATE Istanbul, İstanbul’da Nihad Aldos tarafından yürütülen, henüz yayında olmayan bir projedir. Henüz tescilli bir şirket değildir.", "هذا مشروع قبل الإطلاق يديره نهاد الدوس في إسطنبول، وليس شركة مسجَّلة بعد.", "NORVIGATE Istanbul es un proyecto previo al lanzamiento dirigido por Nihad Aldos en Estambul. Todavía no es una empresa registrada.", "NORVIGATE Istanbul est un projet pré-lancement dirigé par Nihad Aldos à Istanbul. Ce n’est pas encore une société enregistrée."]],
      [["What we collect", "Ne topluyoruz", "ما نجمعه", "Qué recopilamos", "Ce que nous collectons"],
       ["Only what you type into a form: for example name, email, phone, message and, for order requests, address and cart contents. We do not store IP addresses. No analytics or advertising cookies are used.", "Yalnızca bir forma yazdıklarınızı: örneğin ad, e-posta, telefon, mesaj ve sipariş taleplerinde adres ile sepet içeriği. IP adresi saklamıyoruz. Analiz veya reklam çerezi kullanılmıyor.", "فقط ما تكتبه في النماذج: مثل الاسم والبريد والهاتف والرسالة، وفي طلبات الشراء العنوان ومحتوى السلة. لا نحفظ عناوين IP. ولا نستخدم ملفات تعريف ارتباط للتحليلات أو الإعلانات.", "Solo lo que escribes en un formulario: por ejemplo nombre, correo, teléfono, mensaje y, en las solicitudes de pedido, dirección y contenido del carrito. No guardamos direcciones IP. No se usan cookies de análisis ni de publicidad.", "Uniquement ce que vous saisissez dans un formulaire : par exemple nom, e-mail, téléphone, message et, pour les demandes de commande, adresse et contenu du panier. Nous ne conservons pas les adresses IP. Aucun cookie d’analyse ou de publicité n’est utilisé."]],
      [["Why and how long", "Neden ve ne kadar süre", "لماذا ومدة الاحتفاظ", "Para qué y por cuánto tiempo", "Pourquoi et combien de temps"],
       ["To answer your request. We keep it only as long as needed to handle it; write to us to ask for deletion.", "Talebinizi yanıtlamak için. Yalnızca talebi ele almak için gerektiği kadar saklarız; silinmesini istemek için bize yazın.", "للرد على طلبك. نحتفظ بها فقط بالقدر اللازم لمعالجة الطلب؛ راسلنا إن أردت حذفها.", "Para responder a tu solicitud. La conservamos solo el tiempo necesario para gestionarla; escríbenos para pedir su eliminación.", "Pour répondre à votre demande. Nous ne la conservons que le temps nécessaire à son traitement ; écrivez-nous pour demander sa suppression."]],
      [["Other services", "Diğer hizmetler", "خدمات أخرى", "Otros servicios", "Autres services"],
       ["The weather box loads data from Open-Meteo in your browser, and currency rates are fetched by our server from the Exchange Rate API. The weather provider can see technical data, such as your IP address, when your browser contacts it.", "Hava durumu kutusu verileri tarayıcınızda Open-Meteo’dan yükler; döviz kurlarını ise sunucumuz Exchange Rate API’den alır. Hava durumu sağlayıcısı, tarayıcınız ona bağlandığında IP adresiniz gibi teknik verileri görebilir.", "يحمّل صندوق الطقس بياناته من Open-Meteo عبر متصفحك، ويجلب خادمنا أسعار العملات من Exchange Rate API. ويستطيع مزوّد الطقس رؤية بيانات تقنية مثل عنوان IP عند اتصال متصفحك به.", "El cuadro del tiempo carga datos de Open-Meteo en tu navegador, y nuestro servidor obtiene los tipos de cambio de Exchange Rate API. El proveedor del tiempo puede ver datos técnicos, como tu dirección IP, cuando tu navegador lo contacta.", "Le module météo charge ses données depuis Open-Meteo dans votre navigateur, et notre serveur récupère les taux de change auprès d’Exchange Rate API. Le fournisseur météo peut voir des données techniques, comme votre adresse IP, lorsque votre navigateur le contacte."]],
      [["Your rights", "Haklarınız", "حقوقك", "Tus derechos", "Vos droits"],
       ["Under Turkish data-protection law (KVKK) you may ask what data we hold, have it corrected or deleted. Use the contact form.", "Türk kişisel verilerin korunması mevzuatı (KVKK) kapsamında hangi verileri tuttuğumuzu sorabilir, düzeltilmesini veya silinmesini isteyebilirsiniz. İletişim formunu kullanın.", "بموجب قانون حماية البيانات الشخصية التركي (KVKK) يمكنك أن تسأل عمّا نحتفظ به من بياناتك وأن تطلب تصحيحها أو حذفها. استخدم نموذج الاتصال.", "Según la ley turca de protección de datos (KVKK) puedes preguntar qué datos tenemos y pedir que se corrijan o eliminen. Usa el formulario de contacto.", "Selon la loi turque de protection des données (KVKK), vous pouvez demander quelles données nous détenons, les faire corriger ou supprimer. Utilisez le formulaire de contact."]],
    ],
  },
  terms: {
    title: ["Terms of use", "Kullanım koşulları", "شروط الاستخدام", "Condiciones de uso", "Conditions d’utilisation"],
    sections: [
      [["What this site is", "Bu site nedir", "ما هو هذا الموقع", "Qué es este sitio", "Ce qu’est ce site"],
       ["A guide and an early platform. Most content is sample data or an editorial draft, and it is labelled as such.", "Bir rehber ve erken aşamada bir platformdur. İçeriğin çoğu örnek veri veya editoryal taslaktır ve bu şekilde etiketlenmiştir.", "دليل ومنصة في مرحلة مبكرة. معظم المحتوى بيانات تجريبية أو مسودة تحريرية، وهو موسوم بذلك.", "Una guía y una plataforma en fase inicial. La mayor parte del contenido son datos de muestra o borradores editoriales, y está señalado como tal.", "Un guide et une plateforme à un stade précoce. L’essentiel du contenu est composé de données d’exemple ou de brouillons éditoriaux, et il est signalé comme tel."]],
      [["No bookings or payments", "Rezervasyon veya ödeme yok", "لا حجوزات ولا مدفوعات", "Sin reservas ni pagos", "Ni réservations ni paiements"],
       ["Forms and order requests only record a request. No booking, order, contract or payment is created.", "Formlar ve sipariş talepleri yalnızca bir talep kaydeder. Rezervasyon, sipariş, sözleşme veya ödeme oluşturulmaz.", "النماذج وطلبات الشراء تسجّل طلباً فقط. ولا يُنشأ حجز ولا طلب شراء ولا عقد ولا دفع.", "Los formularios y las solicitudes de pedido solo registran una solicitud. No se crea ninguna reserva, pedido, contrato ni pago.", "Les formulaires et demandes de commande enregistrent seulement une demande. Aucune réservation, commande, contrat ni paiement n’est créé."]],
      [["Links and third parties", "Bağlantılar ve üçüncü taraflar", "الروابط والأطراف الثالثة", "Enlaces y terceros", "Liens et tiers"],
       ["We link to external websites without any partnership. We are not responsible for their content, prices or availability.", "Harici sitelere herhangi bir ortaklık olmaksızın bağlantı veriyoruz. İçeriklerinden, fiyatlarından veya müsaitliklerinden sorumlu değiliz.", "نربط بمواقع خارجية دون أي شراكة معها، ولسنا مسؤولين عن محتواها أو أسعارها أو توفّرها.", "Enlazamos a sitios externos sin ninguna colaboración. No somos responsables de su contenido, precios ni disponibilidad.", "Nous renvoyons vers des sites externes sans aucun partenariat. Nous ne sommes pas responsables de leur contenu, de leurs prix ni de leur disponibilité."]],
      [["Accuracy", "Doğruluk", "الدقة", "Exactitud", "Exactitude"],
       ["Information may be incomplete or out of date. Check official sources, especially for entry rules, visas, opening hours and prices.", "Bilgiler eksik veya güncel olmayabilir. Özellikle giriş kuralları, vize, çalışma saatleri ve fiyatlar için resmî kaynakları kontrol edin.", "قد تكون المعلومات ناقصة أو قديمة. راجع المصادر الرسمية، خصوصاً لقواعد الدخول والتأشيرات ومواعيد العمل والأسعار.", "La información puede estar incompleta o desactualizada. Consulta las fuentes oficiales, sobre todo para normas de entrada, visados, horarios y precios.", "Les informations peuvent être incomplètes ou périmées. Consultez les sources officielles, surtout pour les règles d’entrée, les visas, les horaires et les prix."]],
      [["Changes and applicable law", "Değişiklikler ve uygulanacak hukuk", "التعديلات والقانون المعمول به", "Cambios y ley aplicable", "Modifications et droit applicable"],
       ["We may change the site and these terms. Applicable law and jurisdiction will be stated when the company is registered.", "Siteyi ve bu koşulları değiştirebiliriz. Uygulanacak hukuk ve yetki, şirket tescil edildiğinde belirtilecektir.", "قد نغيّر الموقع وهذه الشروط. وسيُحدَّد القانون المعمول به والاختصاص القضائي عند تسجيل الشركة.", "Podemos modificar el sitio y estas condiciones. La ley aplicable y la jurisdicción se indicarán cuando la empresa esté registrada.", "Nous pouvons modifier le site et ces conditions. Le droit applicable et la juridiction seront précisés lorsque la société sera enregistrée."]],
    ],
  },
  shipping: {
    title: ["Shipping and returns", "Gönderim ve iade", "الشحن والإرجاع", "Envíos y devoluciones", "Livraison et retours"],
    sections: [
      [["Current status", "Mevcut durum", "الوضع الحالي", "Estado actual", "Situation actuelle"],
       ["No shipping or delivery is enabled for any destination. The store takes order requests only.", "Hiçbir varış noktası için gönderim veya teslimat etkin değildir. Mağaza yalnızca sipariş talebi alır.", "لا يوجد شحن أو توصيل مفعّل لأي وجهة. يستقبل المتجر طلبات شراء فقط.", "No hay envío ni entrega habilitados para ningún destino. La tienda solo recibe solicitudes de pedido.", "Aucune expédition ni livraison n’est activée. La boutique reçoit uniquement des demandes de commande."]],
      [["When sales start", "Satışlar başladığında", "عند بدء البيع", "Cuando empiecen las ventas", "Au début des ventes"],
       ["A shipping and returns policy, with delivery times and costs, will be published before any real sale.", "Gerçek bir satıştan önce, teslimat süreleri ve ücretleriyle birlikte bir gönderim ve iade politikası yayımlanacaktır.", "ستُنشر سياسة شحن وإرجاع، بمواعيد التوصيل وتكاليفه، قبل أي عملية بيع حقيقية.", "Antes de cualquier venta real se publicará una política de envíos y devoluciones, con plazos y costes de entrega.", "Une politique de livraison et de retours, avec délais et coûts, sera publiée avant toute vente réelle."]],
      [["Food products", "Gıda ürünleri", "المنتجات الغذائية", "Productos alimentarios", "Produits alimentaires"],
       ["Perishable food is normally excluded from the 14-day right of withdrawal in distance sales; this will be confirmed with a lawyer before sales start.", "Çabuk bozulabilen gıdalar, mesafeli satışlarda normalde 14 günlük cayma hakkının dışındadır; satışlar başlamadan önce bu bir avukatla teyit edilecektir.", "الأغذية سريعة التلف تُستثنى عادةً من حق العدول خلال 14 يوماً في البيع عن بُعد؛ وسيُؤكَّد ذلك مع محامٍ قبل بدء البيع.", "Los alimentos perecederos suelen quedar excluidos del derecho de desistimiento de 14 días en la venta a distancia; esto se confirmará con un abogado antes de empezar a vender.", "Les denrées périssables sont normalement exclues du droit de rétractation de 14 jours en vente à distance ; cela sera confirmé avec un avocat avant le début des ventes."]],
    ],
  },
  cookies: {
    title: ["Cookie notice", "Çerez bildirimi", "إشعار ملفات تعريف الارتباط", "Aviso de cookies", "Notice relative aux cookies"],
    sections: [
      [["What we store", "Ne saklıyoruz", "ما نحفظه", "Qué guardamos", "Ce que nous conservons"],
       ["Only what the site needs: your language and display currency (small cookies) and your cart (browser storage).", "Yalnızca sitenin ihtiyaç duyduğunu: dilinizi ve görüntüleme para biriminizi (küçük çerezler) ve sepetinizi (tarayıcı depolaması).", "فقط ما يحتاجه الموقع: لغتك وعملة العرض (ملفا ارتباط صغيران) وسلتك (تخزين المتصفح).", "Solo lo que el sitio necesita: tu idioma y moneda de visualización (cookies pequeñas) y tu carrito (almacenamiento del navegador).", "Uniquement ce dont le site a besoin : votre langue et votre devise d’affichage (petits cookies) et votre panier (stockage du navigateur)."]],
      [["What we do not use", "Ne kullanmıyoruz", "ما لا نستخدمه", "Qué no usamos", "Ce que nous n’utilisons pas"],
       ["No analytics, advertising or tracking cookies.", "Analiz, reklam veya takip çerezi yok.", "لا ملفات تعريف ارتباط للتحليلات أو الإعلانات أو التتبّع.", "Ninguna cookie de análisis, publicidad o seguimiento.", "Aucun cookie d’analyse, de publicité ou de suivi."]],
      [["Control", "Kontrol", "التحكم", "Control", "Contrôle"],
       ["You can clear them in your browser settings at any time.", "Tarayıcı ayarlarınızdan istediğiniz zaman silebilirsiniz.", "يمكنك حذفها من إعدادات متصفحك في أي وقت.", "Puedes borrarlas en los ajustes de tu navegador en cualquier momento.", "Vous pouvez les supprimer à tout moment dans les paramètres de votre navigateur."]],
    ],
  },
};
export function legalBanner(l: Locale) { return draftBanner[i(l)]; }
export function legalDoc(key: string, l: Locale) {
  const d = legalDocs[key];
  return d ? { title: d.title[i(l)], sections: d.sections.map(([h, t]) => ({ heading: h[i(l)], text: t[i(l)] })) } : null;
}
export const legalTitle = (key: string, l: Locale) => legalDocs[key].title[i(l)];
