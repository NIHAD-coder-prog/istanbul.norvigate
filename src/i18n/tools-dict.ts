import type { Locale } from "./config";
type Row = [string, string, string, string, string];
const ORDER: Locale[] = ["en", "tr", "ar", "es", "fr"];
const rows: Record<string, Row> = {
  cvTitle: ["Currency converter", "Döviz çevirici", "محوّل العملات", "Conversor de divisas", "Convertisseur de devises"],
  prTitle: ["Prayer times in Istanbul", "İstanbul namaz vakitleri", "أوقات الصلاة في إسطنبول", "Horarios de oración en Estambul", "Heures de prière à Istanbul"],
  wxTitle: ["Weather in Istanbul", "İstanbul hava durumu", "الطقس في إسطنبول", "Clima en Estambul", "Météo à Istanbul"],
  amount: ["Amount", "Tutar", "المبلغ", "Importe", "Montant"],
  from: ["From", "Kaynak", "من", "De", "De"],
  to: ["To", "Hedef", "إلى", "A", "Vers"],
  swap: ["Swap currencies", "Para birimlerini değiştir", "تبديل العملتين", "Intercambiar monedas", "Inverser les devises"],
  popular: ["Common currencies", "Yaygın para birimleri", "عملات شائعة", "Monedas habituales", "Devises courantes"],
  all: ["All currencies", "Tüm para birimleri", "كل العملات", "Todas las monedas", "Toutes les devises"],
  result: ["Result", "Sonuç", "النتيجة", "Resultado", "Résultat"],
  rate: ["Rate", "Kur", "السعر", "Cambio", "Taux"],
  loading: ["Loading rates…", "Kurlar yükleniyor…", "جارٍ تحميل الأسعار…", "Cargando cambios…", "Chargement des taux…"],
  unavailTitle: ["Rates are unavailable right now", "Kurlara şu an ulaşılamıyor", "الأسعار غير متاحة الآن", "Los cambios no están disponibles ahora", "Les taux sont indisponibles pour le moment"],
  unavailText: ["We do not show made-up numbers. Please try again later.", "Uydurma değer göstermiyoruz. Lütfen daha sonra tekrar deneyin.", "لا نعرض أرقاماً مختلَقة. يرجى المحاولة لاحقاً.", "No mostramos cifras inventadas. Inténtalo más tarde.", "Nous n’affichons pas de chiffres inventés. Réessayez plus tard."],
  retry: ["Retry", "Tekrar dene", "حاول مجدداً", "Reintentar", "Réessayer"],
  updated: ["Provider update", "Sağlayıcı güncellemesi", "آخر تحديث لدى المزوّد", "Actualización del proveedor", "Mise à jour du fournisseur"],
  stale: ["Showing the last saved rates; live rates could not be fetched.", "Son kaydedilen kurlar gösteriliyor; canlı kurlara ulaşılamadı.", "نعرض آخر أسعار محفوظة؛ تعذّر جلب الأسعار الحية.", "Mostramos los últimos cambios guardados; no se pudieron obtener los actuales.", "Derniers taux enregistrés affichés ; les taux actuels n’ont pu être récupérés."],
  disclaimer: ["Indicative daily rates, not the rate a bank or exchange office will give you.", "Günlük gösterge kurlardır; banka veya döviz bürosunun uygulayacağı kur değildir.", "أسعار يومية إرشادية، وليست السعر الذي سيعطيك إياه مصرف أو مكتب صرافة.", "Cambios diarios orientativos, no el que te dará un banco o casa de cambio.", "Taux quotidiens indicatifs, pas celui d’une banque ou d’un bureau de change."],
  fajr: ["Fajr", "İmsak", "الفجر", "Fajr", "Fajr"],
  sunrise: ["Sunrise", "Güneş", "الشروق", "Amanecer", "Lever du soleil"],
  dhuhr: ["Dhuhr", "Öğle", "الظهر", "Dhuhr", "Dhouhr"],
  asr: ["Asr", "İkindi", "العصر", "Asr", "Asr"],
  maghrib: ["Maghrib", "Akşam", "المغرب", "Magrib", "Maghrib"],
  isha: ["Isha", "Yatsı", "العشاء", "Isha", "Isha"],
  prMethod: ["Calculated for Istanbul (UTC+3) with Fajr at 18° and Isha at 17°, the angles published by Diyanet. Official timetables may differ by a few minutes.", "İstanbul için (UTC+3) İmsak 18° ve Yatsı 17° açısıyla hesaplanmıştır (Diyanet açıları). Resmî takvimlerle birkaç dakika fark olabilir.", "محسوبة لإسطنبول (UTC+3) بزاويتي الفجر 18° والعشاء 17° اللتين تعتمدهما رئاسة الشؤون الدينية التركية. قد تختلف التقاويم الرسمية بضع دقائق.", "Calculado para Estambul (UTC+3) con ángulos de 18° (Fajr) y 17° (Isha), los que publica Diyanet. Los horarios oficiales pueden diferir unos minutos.", "Calculé pour Istanbul (UTC+3) avec Fajr à 18° et Isha à 17°, les angles publiés par la Diyanet. Les horaires officiels peuvent différer de quelques minutes."],
  calc: ["Calculated", "Hesaplanmış", "محسوب", "Calculado", "Calculé"],
  wxLoading: ["Loading weather…", "Hava durumu yükleniyor…", "جارٍ تحميل الطقس…", "Cargando el clima…", "Chargement de la météo…"],
  wxError: ["Weather is unavailable right now.", "Hava durumuna şu an ulaşılamıyor.", "الطقس غير متاح الآن.", "El clima no está disponible ahora.", "La météo est indisponible pour le moment."],
  feels: ["Feels like", "Hissedilen", "المحسوس", "Sensación", "Ressenti"],
  wind: ["Wind", "Rüzgâr", "الرياح", "Viento", "Vent"],
  humidity: ["Humidity", "Nem", "الرطوبة", "Humedad", "Humidité"],
  nextDays: ["Next days", "Önümüzdeki günler", "الأيام القادمة", "Próximos días", "Jours suivants"],
  source: ["Source", "Kaynak", "المصدر", "Fuente", "Source"],
  clear: ["Clear", "Açık", "صافٍ", "Despejado", "Dégagé"],
  partly: ["Partly cloudy", "Parçalı bulutlu", "غائم جزئياً", "Parcialmente nublado", "Partiellement nuageux"],
  fog: ["Fog", "Sisli", "ضباب", "Niebla", "Brouillard"],
  rain: ["Rain", "Yağmurlu", "ممطر", "Lluvia", "Pluie"],
  snow: ["Snow", "Karlı", "ثلج", "Nieve", "Neige"],
  storm: ["Thunderstorm", "Fırtına", "عاصفة رعدية", "Tormenta", "Orage"],
};
export type ToolsDict = Record<string, string>;
export function getToolsDict(locale: Locale): ToolsDict {
  const i = ORDER.indexOf(locale);
  return Object.fromEntries(Object.entries(rows).map(([k, v]) => [k, v[i]]));
}
