/** Case-, diacritic- and script-insensitive normalisation covering Latin, Turkish, Spanish and Arabic text. */
export function normalize(input: string): string {
  return input
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // Latin combining marks (ş ğ ö ü ç, dotted İ, Spanish accents)
    .replace(/ı/g, "i") // dotless i
    .replace(/[ً-ٰٟـ]/g, "") // Arabic diacritics and tatweel
    .replace(/[إأآٱ]/g, "ا") // alef variants -> alef
    .replace(/ى/g, "ي") // alef maqsura -> yeh
    .replace(/ة/g, "ه") // teh marbuta -> heh
    .replace(/\s+/g, " ")
    .trim();
}
