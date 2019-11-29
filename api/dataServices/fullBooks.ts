interface Book {
  chapters: number
  value: string
  abbrev: string
  start: number
}

export const fullBooks: Book[] = [
  { chapters: 50, value: 'Genesis', abbrev: 'Gen', start: 0 },
  { chapters: 40, value: 'Exodus', abbrev: 'Exo', start: 50 },
  { chapters: 27, value: 'Leviticus', abbrev: 'Lev', start: 90 },
  { chapters: 36, value: 'Numbers', abbrev: 'Num', start: 117 },
  { chapters: 34, value: 'Deuteronomy', abbrev: 'Deut', start: 153 },
  { chapters: 24, value: 'Joshua', abbrev: 'Josh', start: 187 },
  { chapters: 21, value: 'Judges', abbrev: 'Judg', start: 211 },
  { chapters: 4, value: 'Ruth', abbrev: 'Ruth', start: 232 },
  { chapters: 31, value: '1Samuel', abbrev: '1Sam', start: 236 },
  { chapters: 24, value: '2Samuel', abbrev: '2Sam', start: 267 },
  { chapters: 22, value: '1Kings', abbrev: '1Kin', start: 291 },
  { chapters: 25, value: '2Kings', abbrev: '2Kin', start: 313 },
  { chapters: 29, value: '1Chronicles', abbrev: '1Chr', start: 338 },
  { chapters: 36, value: '2Chronicles', abbrev: '2Chr', start: 367 },
  { chapters: 10, value: 'Ezra', abbrev: 'Ezra', start: 403 },
  { chapters: 13, value: 'Nehemiah', abbrev: 'Neh', start: 413 },
  { chapters: 10, value: 'Esther', abbrev: 'Estr', start: 426 },
  { chapters: 42, value: 'Job', abbrev: 'Job', start: 436 },
  { chapters: 150, value: 'Psalms', abbrev: 'Psa', start: 478 },
  { chapters: 31, value: 'Proverbs', abbrev: 'Prov', start: 628 },
  { chapters: 12, value: 'Ecclesiastes', abbrev: 'Ecc', start: 659 },
  { chapters: 8, value: 'SongofSolomon', abbrev: 'SoS', start: 671 },
  { chapters: 66, value: 'Isaiah', abbrev: 'Isa', start: 679 },
  { chapters: 52, value: 'Jeremiah', abbrev: 'Jer', start: 745 },
  { chapters: 5, value: 'Lamentations', abbrev: 'Lam', start: 797 },
  { chapters: 48, value: 'Ezekiel', abbrev: 'Ezek', start: 802 },
  { chapters: 12, value: 'Daniel', abbrev: 'Dan', start: 850 },
  { chapters: 14, value: 'Hosea', abbrev: 'Hos', start: 862 },
  { chapters: 3, value: 'Joel', abbrev: 'Joel', start: 876 },
  { chapters: 9, value: 'Amos', abbrev: 'Amos', start: 879 },
  { chapters: 1, value: 'Obadiah', abbrev: 'Obad', start: 888 },
  { chapters: 4, value: 'Jonah', abbrev: 'Jon', start: 889 },
  { chapters: 7, value: 'Micah', abbrev: 'Mic', start: 893 },
  { chapters: 3, value: 'Nahum', abbrev: 'Nah', start: 900 },
  { chapters: 3, value: 'Habakkuk', abbrev: 'Hab', start: 903 },
  { chapters: 3, value: 'Zephaniah', abbrev: 'Zeph', start: 906 },
  { chapters: 2, value: 'Haggai', abbrev: 'Hag', start: 909 },
  { chapters: 14, value: 'Zechariah', abbrev: 'Zech', start: 911 },
  { chapters: 4, value: 'Malachi', abbrev: 'Mal', start: 925 },
  { chapters: 28, value: 'Matthew', abbrev: 'Matt', start: 929 },
  { chapters: 16, value: 'Mark', abbrev: 'Mark', start: 957 },
  { chapters: 24, value: 'Luke', abbrev: 'Luke', start: 973 },
  { chapters: 21, value: 'John', abbrev: 'John', start: 997 },
  { chapters: 28, value: 'Acts', abbrev: 'Acts', start: 1018 },
  { chapters: 16, value: 'Romans', abbrev: 'Rom', start: 1046 },
  { chapters: 16, value: '1Corinthians', abbrev: '1Cor', start: 1062 },
  { chapters: 13, value: '2Corinthians', abbrev: '2Cor', start: 1078 },
  { chapters: 6, value: 'Galatians', abbrev: 'Gal', start: 1091 },
  { chapters: 6, value: 'Ephesians', abbrev: 'Eph', start: 1097 },
  { chapters: 4, value: 'Philippians', abbrev: 'Phil', start: 1103 },
  { chapters: 4, value: 'Colossians', abbrev: 'Col', start: 1107 },
  { chapters: 5, value: '1Thessalonians', abbrev: '1Ths', start: 1111 },
  { chapters: 3, value: '2Thessalonians', abbrev: '2Ths', start: 1116 },
  { chapters: 6, value: '1Timothy', abbrev: '1Tim', start: 1119 },
  { chapters: 4, value: '2Timothy', abbrev: '2Tim', start: 1125 },
  { chapters: 3, value: 'Titus', abbrev: 'Tit', start: 1129 },
  { chapters: 1, value: 'Philemon', abbrev: 'Phlm', start: 1132 },
  { chapters: 13, value: 'Hebrews', abbrev: 'Heb', start: 1133 },
  { chapters: 5, value: 'James', abbrev: 'Jam', start: 1146 },
  { chapters: 5, value: '1Peter', abbrev: '1Pet', start: 1151 },
  { chapters: 3, value: '2Peter', abbrev: '2Pet', start: 1156 },
  { chapters: 5, value: '1John', abbrev: '1Jn', start: 1159 },
  { chapters: 1, value: '2John', abbrev: '2Jn', start: 1164 },
  { chapters: 1, value: '3John', abbrev: '3Jn', start: 1165 },
  { chapters: 1, value: 'Jude', abbrev: 'Jude', start: 1166 },
  { chapters: 22, value: 'Revelation', abbrev: 'Rev', start: 1167 }
]
