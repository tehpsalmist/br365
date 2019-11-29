import { Injectable } from '@angular/core'


export interface Book {
  chapters: number
  value: string
  abbrev: string
  start: number
}
@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  chapters = ['Genesis1', 'Genesis2', 'Genesis3', 'Genesis4', 'Genesis5', 'Genesis6', 'Genesis7', 'Genesis8', 'Genesis9', 'Genesis10', 'Genesis11', 'Genesis12', 'Genesis13', 'Genesis14', 'Genesis15', 'Genesis16', 'Genesis17', 'Genesis18', 'Genesis19', 'Genesis20', 'Genesis21', 'Genesis22', 'Genesis23', 'Genesis24', 'Genesis25', 'Genesis26', 'Genesis27', 'Genesis28', 'Genesis29', 'Genesis30', 'Genesis31', 'Genesis32', 'Genesis33', 'Genesis34', 'Genesis35', 'Genesis36', 'Genesis37', 'Genesis38', 'Genesis39', 'Genesis40', 'Genesis41', 'Genesis42', 'Genesis43', 'Genesis44', 'Genesis45', 'Genesis46', 'Genesis47', 'Genesis48', 'Genesis49', 'Genesis50', 'Exodus1', 'Exodus2', 'Exodus3', 'Exodus4', 'Exodus5', 'Exodus6', 'Exodus7', 'Exodus8', 'Exodus9', 'Exodus10', 'Exodus11', 'Exodus12', 'Exodus13', 'Exodus14', 'Exodus15', 'Exodus16', 'Exodus17', 'Exodus18', 'Exodus19', 'Exodus20', 'Exodus21', 'Exodus22', 'Exodus23', 'Exodus24', 'Exodus25', 'Exodus26', 'Exodus27', 'Exodus28', 'Exodus29', 'Exodus30', 'Exodus31', 'Exodus32', 'Exodus33', 'Exodus34', 'Exodus35', 'Exodus36', 'Exodus37', 'Exodus38', 'Exodus39', 'Exodus40', 'Leviticus1', 'Leviticus2', 'Leviticus3', 'Leviticus4', 'Leviticus5', 'Leviticus6', 'Leviticus7', 'Leviticus8', 'Leviticus9', 'Leviticus10', 'Leviticus11', 'Leviticus12', 'Leviticus13', 'Leviticus14', 'Leviticus15', 'Leviticus16', 'Leviticus17', 'Leviticus18', 'Leviticus19', 'Leviticus20', 'Leviticus21', 'Leviticus22', 'Leviticus23', 'Leviticus24', 'Leviticus25', 'Leviticus26', 'Leviticus27', 'Numbers1', 'Numbers2', 'Numbers3', 'Numbers4', 'Numbers5', 'Numbers6', 'Numbers7', 'Numbers8', 'Numbers9', 'Numbers10', 'Numbers11', 'Numbers12', 'Numbers13', 'Numbers14', 'Numbers15', 'Numbers16', 'Numbers17', 'Numbers18', 'Numbers19', 'Numbers20', 'Numbers21', 'Numbers22', 'Numbers23', 'Numbers24', 'Numbers25', 'Numbers26', 'Numbers27', 'Numbers28', 'Numbers29', 'Numbers30', 'Numbers31', 'Numbers32', 'Numbers33', 'Numbers34', 'Numbers35', 'Numbers36', 'Deuteronomy1', 'Deuteronomy2', 'Deuteronomy3', 'Deuteronomy4', 'Deuteronomy5', 'Deuteronomy6', 'Deuteronomy7', 'Deuteronomy8', 'Deuteronomy9', 'Deuteronomy10', 'Deuteronomy11', 'Deuteronomy12', 'Deuteronomy13', 'Deuteronomy14', 'Deuteronomy15', 'Deuteronomy16', 'Deuteronomy17', 'Deuteronomy18', 'Deuteronomy19', 'Deuteronomy20', 'Deuteronomy21', 'Deuteronomy22', 'Deuteronomy23', 'Deuteronomy24', 'Deuteronomy25', 'Deuteronomy26', 'Deuteronomy27', 'Deuteronomy28', 'Deuteronomy29', 'Deuteronomy30', 'Deuteronomy31', 'Deuteronomy32', 'Deuteronomy33', 'Deuteronomy34', 'Joshua1', 'Joshua2', 'Joshua3', 'Joshua4', 'Joshua5', 'Joshua6', 'Joshua7', 'Joshua8', 'Joshua9', 'Joshua10', 'Joshua11', 'Joshua12', 'Joshua13', 'Joshua14', 'Joshua15', 'Joshua16', 'Joshua17', 'Joshua18', 'Joshua19', 'Joshua20', 'Joshua21', 'Joshua22', 'Joshua23', 'Joshua24', 'Judges1', 'Judges2', 'Judges3', 'Judges4', 'Judges5', 'Judges6', 'Judges7', 'Judges8', 'Judges9', 'Judges10', 'Judges11', 'Judges12', 'Judges13', 'Judges14', 'Judges15', 'Judges16', 'Judges17', 'Judges18', 'Judges19', 'Judges20', 'Judges21', 'Ruth1', 'Ruth2', 'Ruth3', 'Ruth4', '1Samuel1', '1Samuel2', '1Samuel3', '1Samuel4', '1Samuel5', '1Samuel6', '1Samuel7', '1Samuel8', '1Samuel9', '1Samuel10', '1Samuel11', '1Samuel12', '1Samuel13', '1Samuel14', '1Samuel15', '1Samuel16', '1Samuel17', '1Samuel18', '1Samuel19', '1Samuel20', '1Samuel21', '1Samuel22', '1Samuel23', '1Samuel24', '1Samuel25', '1Samuel26', '1Samuel27', '1Samuel28', '1Samuel29', '1Samuel30', '1Samuel31', '2Samuel1', '2Samuel2', '2Samuel3', '2Samuel4', '2Samuel5', '2Samuel6', '2Samuel7', '2Samuel8', '2Samuel9', '2Samuel10', '2Samuel11', '2Samuel12', '2Samuel13', '2Samuel14', '2Samuel15', '2Samuel16', '2Samuel17', '2Samuel18', '2Samuel19', '2Samuel20', '2Samuel21', '2Samuel22', '2Samuel23', '2Samuel24', '1Kings1', '1Kings2', '1Kings3', '1Kings4', '1Kings5', '1Kings6', '1Kings7', '1Kings8', '1Kings9', '1Kings10', '1Kings11', '1Kings12', '1Kings13', '1Kings14', '1Kings15', '1Kings16', '1Kings17', '1Kings18', '1Kings19', '1Kings20', '1Kings21', '1Kings22', '2Kings1', '2Kings2', '2Kings3', '2Kings4', '2Kings5', '2Kings6', '2Kings7', '2Kings8', '2Kings9', '2Kings10', '2Kings11', '2Kings12', '2Kings13', '2Kings14', '2Kings15', '2Kings16', '2Kings17', '2Kings18', '2Kings19', '2Kings20', '2Kings21', '2Kings22', '2Kings23', '2Kings24', '2Kings25', '1Chronicles1', '1Chronicles2', '1Chronicles3', '1Chronicles4', '1Chronicles5', '1Chronicles6', '1Chronicles7', '1Chronicles8', '1Chronicles9', '1Chronicles10', '1Chronicles11', '1Chronicles12', '1Chronicles13', '1Chronicles14', '1Chronicles15', '1Chronicles16', '1Chronicles17', '1Chronicles18', '1Chronicles19', '1Chronicles20', '1Chronicles21', '1Chronicles22', '1Chronicles23', '1Chronicles24', '1Chronicles25', '1Chronicles26', '1Chronicles27', '1Chronicles28', '1Chronicles29', '2Chronicles1', '2Chronicles2', '2Chronicles3', '2Chronicles4', '2Chronicles5', '2Chronicles6', '2Chronicles7', '2Chronicles8', '2Chronicles9', '2Chronicles10', '2Chronicles11', '2Chronicles12', '2Chronicles13', '2Chronicles14', '2Chronicles15', '2Chronicles16', '2Chronicles17', '2Chronicles18', '2Chronicles19', '2Chronicles20', '2Chronicles21', '2Chronicles22', '2Chronicles23', '2Chronicles24', '2Chronicles25', '2Chronicles26', '2Chronicles27', '2Chronicles28', '2Chronicles29', '2Chronicles30', '2Chronicles31', '2Chronicles32', '2Chronicles33', '2Chronicles34', '2Chronicles35', '2Chronicles36', 'Ezra1', 'Ezra2', 'Ezra3', 'Ezra4', 'Ezra5', 'Ezra6', 'Ezra7', 'Ezra8', 'Ezra9', 'Ezra10', 'Nehemiah1', 'Nehemiah2', 'Nehemiah3', 'Nehemiah4', 'Nehemiah5', 'Nehemiah6', 'Nehemiah7', 'Nehemiah8', 'Nehemiah9', 'Nehemiah10', 'Nehemiah11', 'Nehemiah12', 'Nehemiah13', 'Esther1', 'Esther2', 'Esther3', 'Esther4', 'Esther5', 'Esther6', 'Esther7', 'Esther8', 'Esther9', 'Esther10', 'Job1', 'Job2', 'Job3', 'Job4', 'Job5', 'Job6', 'Job7', 'Job8', 'Job9', 'Job10', 'Job11', 'Job12', 'Job13', 'Job14', 'Job15', 'Job16', 'Job17', 'Job18', 'Job19', 'Job20', 'Job21', 'Job22', 'Job23', 'Job24', 'Job25', 'Job26', 'Job27', 'Job28', 'Job29', 'Job30', 'Job31', 'Job32', 'Job33', 'Job34', 'Job35', 'Job36', 'Job37', 'Job38', 'Job39', 'Job40', 'Job41', 'Job42', 'Psalms1', 'Psalms2', 'Psalms3', 'Psalms4', 'Psalms5', 'Psalms6', 'Psalms7', 'Psalms8', 'Psalms9', 'Psalms10', 'Psalms11', 'Psalms12', 'Psalms13', 'Psalms14', 'Psalms15', 'Psalms16', 'Psalms17', 'Psalms18', 'Psalms19', 'Psalms20', 'Psalms21', 'Psalms22', 'Psalms23', 'Psalms24', 'Psalms25', 'Psalms26', 'Psalms27', 'Psalms28', 'Psalms29', 'Psalms30', 'Psalms31', 'Psalms32', 'Psalms33', 'Psalms34', 'Psalms35', 'Psalms36', 'Psalms37', 'Psalms38', 'Psalms39', 'Psalms40', 'Psalms41', 'Psalms42', 'Psalms43', 'Psalms44', 'Psalms45', 'Psalms46', 'Psalms47', 'Psalms48', 'Psalms49', 'Psalms50', 'Psalms51', 'Psalms52', 'Psalms53', 'Psalms54', 'Psalms55', 'Psalms56', 'Psalms57', 'Psalms58', 'Psalms59', 'Psalms60', 'Psalms61', 'Psalms62', 'Psalms63', 'Psalms64', 'Psalms65', 'Psalms66', 'Psalms67', 'Psalms68', 'Psalms69', 'Psalms70', 'Psalms71', 'Psalms72', 'Psalms73', 'Psalms74', 'Psalms75', 'Psalms76', 'Psalms77', 'Psalms78', 'Psalms79', 'Psalms80', 'Psalms81', 'Psalms82', 'Psalms83', 'Psalms84', 'Psalms85', 'Psalms86', 'Psalms87', 'Psalms88', 'Psalms89', 'Psalms90', 'Psalms91', 'Psalms92', 'Psalms93', 'Psalms94', 'Psalms95', 'Psalms96', 'Psalms97', 'Psalms98', 'Psalms99', 'Psalms100', 'Psalms101', 'Psalms102', 'Psalms103', 'Psalms104', 'Psalms105', 'Psalms106', 'Psalms107', 'Psalms108', 'Psalms109', 'Psalms110', 'Psalms111', 'Psalms112', 'Psalms113', 'Psalms114', 'Psalms115', 'Psalms116', 'Psalms117', 'Psalms118', 'Psalms119', 'Psalms120', 'Psalms121', 'Psalms122', 'Psalms123', 'Psalms124', 'Psalms125', 'Psalms126', 'Psalms127', 'Psalms128', 'Psalms129', 'Psalms130', 'Psalms131', 'Psalms132', 'Psalms133', 'Psalms134', 'Psalms135', 'Psalms136', 'Psalms137', 'Psalms138', 'Psalms139', 'Psalms140', 'Psalms141', 'Psalms142', 'Psalms143', 'Psalms144', 'Psalms145', 'Psalms146', 'Psalms147', 'Psalms148', 'Psalms149', 'Psalms150', 'Proverbs1', 'Proverbs2', 'Proverbs3', 'Proverbs4', 'Proverbs5', 'Proverbs6', 'Proverbs7', 'Proverbs8', 'Proverbs9', 'Proverbs10', 'Proverbs11', 'Proverbs12', 'Proverbs13', 'Proverbs14', 'Proverbs15', 'Proverbs16', 'Proverbs17', 'Proverbs18', 'Proverbs19', 'Proverbs20', 'Proverbs21', 'Proverbs22', 'Proverbs23', 'Proverbs24', 'Proverbs25', 'Proverbs26', 'Proverbs27', 'Proverbs28', 'Proverbs29', 'Proverbs30', 'Proverbs31', 'Ecclesiastes1', 'Ecclesiastes2', 'Ecclesiastes3', 'Ecclesiastes4', 'Ecclesiastes5', 'Ecclesiastes6', 'Ecclesiastes7', 'Ecclesiastes8', 'Ecclesiastes9', 'Ecclesiastes10', 'Ecclesiastes11', 'Ecclesiastes12', 'SongofSolomon1', 'SongofSolomon2', 'SongofSolomon3', 'SongofSolomon4', 'SongofSolomon5', 'SongofSolomon6', 'SongofSolomon7', 'SongofSolomon8', 'Isaiah1', 'Isaiah2', 'Isaiah3', 'Isaiah4', 'Isaiah5', 'Isaiah6', 'Isaiah7', 'Isaiah8', 'Isaiah9', 'Isaiah10', 'Isaiah11', 'Isaiah12', 'Isaiah13', 'Isaiah14', 'Isaiah15', 'Isaiah16', 'Isaiah17', 'Isaiah18', 'Isaiah19', 'Isaiah20', 'Isaiah21', 'Isaiah22', 'Isaiah23', 'Isaiah24', 'Isaiah25', 'Isaiah26', 'Isaiah27', 'Isaiah28', 'Isaiah29', 'Isaiah30', 'Isaiah31', 'Isaiah32', 'Isaiah33', 'Isaiah34', 'Isaiah35', 'Isaiah36', 'Isaiah37', 'Isaiah38', 'Isaiah39', 'Isaiah40', 'Isaiah41', 'Isaiah42', 'Isaiah43', 'Isaiah44', 'Isaiah45', 'Isaiah46', 'Isaiah47', 'Isaiah48', 'Isaiah49', 'Isaiah50', 'Isaiah51', 'Isaiah52', 'Isaiah53', 'Isaiah54', 'Isaiah55', 'Isaiah56', 'Isaiah57', 'Isaiah58', 'Isaiah59', 'Isaiah60', 'Isaiah61', 'Isaiah62', 'Isaiah63', 'Isaiah64', 'Isaiah65', 'Isaiah66', 'Jeremiah1', 'Jeremiah2', 'Jeremiah3', 'Jeremiah4', 'Jeremiah5', 'Jeremiah6', 'Jeremiah7', 'Jeremiah8', 'Jeremiah9', 'Jeremiah10', 'Jeremiah11', 'Jeremiah12', 'Jeremiah13', 'Jeremiah14', 'Jeremiah15', 'Jeremiah16', 'Jeremiah17', 'Jeremiah18', 'Jeremiah19', 'Jeremiah20', 'Jeremiah21', 'Jeremiah22', 'Jeremiah23', 'Jeremiah24', 'Jeremiah25', 'Jeremiah26', 'Jeremiah27', 'Jeremiah28', 'Jeremiah29', 'Jeremiah30', 'Jeremiah31', 'Jeremiah32', 'Jeremiah33', 'Jeremiah34', 'Jeremiah35', 'Jeremiah36', 'Jeremiah37', 'Jeremiah38', 'Jeremiah39', 'Jeremiah40', 'Jeremiah41', 'Jeremiah42', 'Jeremiah43', 'Jeremiah44', 'Jeremiah45', 'Jeremiah46', 'Jeremiah47', 'Jeremiah48', 'Jeremiah49', 'Jeremiah50', 'Jeremiah51', 'Jeremiah52', 'Lamentations1', 'Lamentations2', 'Lamentations3', 'Lamentations4', 'Lamentations5', 'Ezekiel1', 'Ezekiel2', 'Ezekiel3', 'Ezekiel4', 'Ezekiel5', 'Ezekiel6', 'Ezekiel7', 'Ezekiel8', 'Ezekiel9', 'Ezekiel10', 'Ezekiel11', 'Ezekiel12', 'Ezekiel13', 'Ezekiel14', 'Ezekiel15', 'Ezekiel16', 'Ezekiel17', 'Ezekiel18', 'Ezekiel19', 'Ezekiel20', 'Ezekiel21', 'Ezekiel22', 'Ezekiel23', 'Ezekiel24', 'Ezekiel25', 'Ezekiel26', 'Ezekiel27', 'Ezekiel28', 'Ezekiel29', 'Ezekiel30', 'Ezekiel31', 'Ezekiel32', 'Ezekiel33', 'Ezekiel34', 'Ezekiel35', 'Ezekiel36', 'Ezekiel37', 'Ezekiel38', 'Ezekiel39', 'Ezekiel40', 'Ezekiel41', 'Ezekiel42', 'Ezekiel43', 'Ezekiel44', 'Ezekiel45', 'Ezekiel46', 'Ezekiel47', 'Ezekiel48', 'Daniel1', 'Daniel2', 'Daniel3', 'Daniel4', 'Daniel5', 'Daniel6', 'Daniel7', 'Daniel8', 'Daniel9', 'Daniel10', 'Daniel11', 'Daniel12', 'Hosea1', 'Hosea2', 'Hosea3', 'Hosea4', 'Hosea5', 'Hosea6', 'Hosea7', 'Hosea8', 'Hosea9', 'Hosea10', 'Hosea11', 'Hosea12', 'Hosea13', 'Hosea14', 'Joel1', 'Joel2', 'Joel3', 'Amos1', 'Amos2', 'Amos3', 'Amos4', 'Amos5', 'Amos6', 'Amos7', 'Amos8', 'Amos9', 'Obadiah1', 'Jonah1', 'Jonah2', 'Jonah3', 'Jonah4', 'Micah1', 'Micah2', 'Micah3', 'Micah4', 'Micah5', 'Micah6', 'Micah7', 'Nahum1', 'Nahum2', 'Nahum3', 'Habakkuk1', 'Habakkuk2', 'Habakkuk3', 'Zephaniah1', 'Zephaniah2', 'Zephaniah3', 'Haggai1', 'Haggai2', 'Zechariah1', 'Zechariah2', 'Zechariah3', 'Zechariah4', 'Zechariah5', 'Zechariah6', 'Zechariah7', 'Zechariah8', 'Zechariah9', 'Zechariah10', 'Zechariah11', 'Zechariah12', 'Zechariah13', 'Zechariah14', 'Malachi1', 'Malachi2', 'Malachi3', 'Malachi4', 'Matthew1', 'Matthew2', 'Matthew3', 'Matthew4', 'Matthew5', 'Matthew6', 'Matthew7', 'Matthew8', 'Matthew9', 'Matthew10', 'Matthew11', 'Matthew12', 'Matthew13', 'Matthew14', 'Matthew15', 'Matthew16', 'Matthew17', 'Matthew18', 'Matthew19', 'Matthew20', 'Matthew21', 'Matthew22', 'Matthew23', 'Matthew24', 'Matthew25', 'Matthew26', 'Matthew27', 'Matthew28', 'Mark1', 'Mark2', 'Mark3', 'Mark4', 'Mark5', 'Mark6', 'Mark7', 'Mark8', 'Mark9', 'Mark10', 'Mark11', 'Mark12', 'Mark13', 'Mark14', 'Mark15', 'Mark16', 'Luke1', 'Luke2', 'Luke3', 'Luke4', 'Luke5', 'Luke6', 'Luke7', 'Luke8', 'Luke9', 'Luke10', 'Luke11', 'Luke12', 'Luke13', 'Luke14', 'Luke15', 'Luke16', 'Luke17', 'Luke18', 'Luke19', 'Luke20', 'Luke21', 'Luke22', 'Luke23', 'Luke24', 'John1', 'John2', 'John3', 'John4', 'John5', 'John6', 'John7', 'John8', 'John9', 'John10', 'John11', 'John12', 'John13', 'John14', 'John15', 'John16', 'John17', 'John18', 'John19', 'John20', 'John21', 'Acts1', 'Acts2', 'Acts3', 'Acts4', 'Acts5', 'Acts6', 'Acts7', 'Acts8', 'Acts9', 'Acts10', 'Acts11', 'Acts12', 'Acts13', 'Acts14', 'Acts15', 'Acts16', 'Acts17', 'Acts18', 'Acts19', 'Acts20', 'Acts21', 'Acts22', 'Acts23', 'Acts24', 'Acts25', 'Acts26', 'Acts27', 'Acts28', 'Romans1', 'Romans2', 'Romans3', 'Romans4', 'Romans5', 'Romans6', 'Romans7', 'Romans8', 'Romans9', 'Romans10', 'Romans11', 'Romans12', 'Romans13', 'Romans14', 'Romans15', 'Romans16', '1Corinthians1', '1Corinthians2', '1Corinthians3', '1Corinthians4', '1Corinthians5', '1Corinthians6', '1Corinthians7', '1Corinthians8', '1Corinthians9', '1Corinthians10', '1Corinthians11', '1Corinthians12', '1Corinthians13', '1Corinthians14', '1Corinthians15', '1Corinthians16', '2Corinthians1', '2Corinthians2', '2Corinthians3', '2Corinthians4', '2Corinthians5', '2Corinthians6', '2Corinthians7', '2Corinthians8', '2Corinthians9', '2Corinthians10', '2Corinthians11', '2Corinthians12', '2Corinthians13', 'Galatians1', 'Galatians2', 'Galatians3', 'Galatians4', 'Galatians5', 'Galatians6', 'Ephesians1', 'Ephesians2', 'Ephesians3', 'Ephesians4', 'Ephesians5', 'Ephesians6', 'Philippians1', 'Philippians2', 'Philippians3', 'Philippians4', 'Colossians1', 'Colossians2', 'Colossians3', 'Colossians4', '1Thessalonians1', '1Thessalonians2', '1Thessalonians3', '1Thessalonians4', '1Thessalonians5', '2Thessalonians1', '2Thessalonians2', '2Thessalonians3', '1Timothy1', '1Timothy2', '1Timothy3', '1Timothy4', '1Timothy5', '1Timothy6', '2Timothy1', '2Timothy2', '2Timothy3', '2Timothy4', 'Titus1', 'Titus2', 'Titus3', 'Philemon1', 'Hebrews1', 'Hebrews2', 'Hebrews3', 'Hebrews4', 'Hebrews5', 'Hebrews6', 'Hebrews7', 'Hebrews8', 'Hebrews9', 'Hebrews10', 'Hebrews11', 'Hebrews12', 'Hebrews13', 'James1', 'James2', 'James3', 'James4', 'James5', '1Peter1', '1Peter2', '1Peter3', '1Peter4', '1Peter5', '2Peter1', '2Peter2', '2Peter3', '1John1', '1John2', '1John3', '1John4', '1John5', '2John1', '3John1', 'Jude1', 'Revelation1', 'Revelation2', 'Revelation3', 'Revelation4', 'Revelation5', 'Revelation6', 'Revelation7', 'Revelation8', 'Revelation9', 'Revelation10', 'Revelation11', 'Revelation12', 'Revelation13', 'Revelation14', 'Revelation15', 'Revelation16', 'Revelation17', 'Revelation18', 'Revelation19', 'Revelation20', 'Revelation21', 'Revelation22']

  books: Book[] = [
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


  timeZones = [
    { value: 'Etc/GMT+12', label: '(GMT - 12:00) International Date Line West' },
    { value: 'Pacific/Midway', label: '(GMT - 11:00) Midway Island, Samoa' },
    { value: 'Pacific/Honolulu', label: '(GMT - 10:00) Hawaii' },
    { value: 'US/Alaska', label: '(GMT - 09:00) Alaska' },
    { value: 'America/Los_Angeles', label: '(GMT - 08:00) Pacific Time (US & Canada)' },
    { value: 'America/Tijuana', label: '(GMT - 08:00) Tijuana, Baja California' },
    { value: 'US/Arizona', label: '(GMT - 07:00) Arizona' },
    { value: 'America/Chihuahua', label: '(GMT - 07:00) Chihuahua, La Paz, Mazatlan' },
    { value: 'US/Mountain', label: '(GMT - 07:00) Mountain Time (US & Canada)' },
    { value: 'America/Managua', label: '(GMT - 06:00) Central America' },
    { value: 'US/Central', label: '(GMT - 06:00) Central Time (US & Canada)' },
    { value: 'America/Mexico_City', label: '(GMT - 06:00) Guadalajara, Mexico City, Monterrey' },
    { value: 'Canada/Saskatchewan', label: '(GMT - 06:00) Saskatchewan' },
    { value: 'America/Bogota', label: '(GMT - 05:00) Bogota, Lima, Quito, Rio Branco' },
    { value: 'US/Eastern', label: '(GMT - 05:00) Eastern Time (US & Canada)' },
    { value: 'US/East-Indiana', label: '(GMT - 05:00) Indiana (East)' },
    { value: 'Canada/Atlantic', label: '(GMT - 04:00) Atlantic Time (Canada)' },
    { value: 'America/Caracas', label: '(GMT - 04:00) Caracas, La Paz' },
    { value: 'America/Manaus', label: '(GMT - 04:00) Manaus' },
    { value: 'America/Santiago', label: '(GMT - 04:00) Santiago' },
    { value: 'Canada/Newfoundland', label: '(GMT - 03:30) Newfoundland' },
    { value: 'America/Sao_Paulo', label: '(GMT - 03:00) Brasilia' },
    { value: 'America/Argentina/Buenos_Aires', label: '(GMT - 03:00) Buenos Aires, Georgetown' },
    { value: 'America/Godthab', label: '(GMT - 03:00) Greenland' },
    { value: 'America/Montevideo', label: '(GMT - 03:00) Montevideo' },
    { value: 'America/Noronha', label: '(GMT - 02:00) Mid - Atlantic' },
    { value: 'Atlantic/Cape_Verde', label: '(GMT - 01:00) Cape Verde Is.< /option' },
    { value: 'Atlantic/Azores', label: '(GMT - 01:00) Azores' },
    { value: 'Africa/Casablanca', label: '(GMT +00:00) Casablanca, Monrovia, Reykjavik' },
    { value: 'Etc/Greenwich', label: '(GMT +00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London' },
    { value: 'Europe/Amsterdam', label: '(GMT + 01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna' },
    { value: 'Europe/Belgrade', label: '(GMT + 01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague' },
    { value: 'Europe/Brussels', label: '(GMT + 01:00) Brussels, Copenhagen, Madrid, Paris' },
    { value: 'Europe/Sarajevo', label: '(GMT + 01:00) Sarajevo, Skopje, Warsaw, Zagreb' },
    { value: 'Africa/Lagos', label: '(GMT + 01:00) West Central Africa' },
    { value: 'Asia/Amman', label: '(GMT + 02:00) Amman' },
    { value: 'Europe/Athens', label: '(GMT + 02:00) Athens, Bucharest, Istanbul' },
    { value: 'Asia/Beirut', label: '(GMT + 02:00) Beirut' },
    { value: 'Africa/Cairo', label: '(GMT + 02:00) Cairo' },
    { value: 'Africa/Harare', label: '(GMT + 02:00) Harare, Pretoria' },
    { value: 'Europe/Helsinki', label: '(GMT + 02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius' },
    { value: 'Asia/Jerusalem', label: '(GMT + 02:00) Jerusalem' },
    { value: 'Europe/Minsk', label: '(GMT + 02:00) Minsk' },
    { value: 'Africa/Windhoek', label: '(GMT + 02:00) Windhoek' },
    { value: 'Asia/Kuwait', label: '(GMT + 03:00) Kuwait, Riyadh, Baghdad' },
    { value: 'Europe/Moscow', label: '(GMT + 03:00) Moscow, St.Petersburg, Volgograd' },
    { value: 'Africa/Nairobi', label: '(GMT + 03:00) Nairobi' },
    { value: 'Asia/Tbilisi', label: '(GMT + 03:00) Tbilisi' },
    { value: 'Asia/Tehran', label: '(GMT + 03:30) Tehran' },
    { value: 'Asia/Muscat', label: '(GMT + 04:00) Abu Dhabi, Muscat' },
    { value: 'Asia/Baku', label: '(GMT + 04:00) Baku' },
    { value: 'Asia/Yerevan', label: '(GMT + 04:00) Yerevan' },
    { value: 'Asia/Kabul', label: '(GMT + 04:30) Kabul' },
    { value: 'Asia/Yekaterinburg', label: '(GMT + 05:00) Yekaterinburg' },
    { value: 'Asia/Karachi', label: '(GMT + 05:00) Islamabad, Karachi, Tashkent' },
    { value: 'Asia/Calcutta', label: '(GMT + 05:30) Chennai, Kolkata, Mumbai, New Delhi' },
    { value: 'Asia/Calcutta', label: '(GMT + 05:30) Sri Jayawardenapura' },
    { value: 'Asia/Katmandu', label: '(GMT + 05: 45) Kathmandu' },
    { value: 'Asia/Almaty', label: '(GMT + 06:00) Almaty, Novosibirsk' },
    { value: 'Asia/Dhaka', label: '(GMT + 06:00) Astana, Dhaka' },
    { value: 'Asia/Rangoon', label: '(GMT + 06:30) Yangon (Rangoon)' },
    { value: 'Asia/Bangkok', label: '(GMT + 07:00) Bangkok, Hanoi, Jakarta' },
    { value: 'Asia/Krasnoyarsk', label: '(GMT + 07:00) Krasnoyarsk' },
    { value: 'Asia/Hong_Kong', label: '(GMT + 08:00) Beijing, Chongqing, Hong Kong, Urumqi' },
    { value: 'Asia/Kuala_Lumpur', label: '(GMT + 08:00) Kuala Lumpur, Singapore' },
    { value: 'Asia/Irkutsk', label: '(GMT + 08:00) Irkutsk, Ulaan Bataar' },
    { value: 'Australia/Perth', label: '(GMT + 08:00) Perth' },
    { value: 'Asia/Taipei', label: '(GMT + 08:00) Taipei' },
    { value: 'Asia/Tokyo', label: '(GMT + 09:00) Osaka, Sapporo, Tokyo' },
    { value: 'Asia/Seoul', label: '(GMT + 09:00) Seoul' },
    { value: 'Asia/Yakutsk', label: '(GMT + 09:00) Yakutsk' },
    { value: 'Australia/Adelaide', label: '(GMT + 09:30) Adelaide' },
    { value: 'Australia/Darwin', label: '(GMT + 09:30) Darwin' },
    { value: 'Australia/Brisbane', label: '(GMT + 10:00) Brisbane' },
    { value: 'Australia/Canberra', label: '(GMT + 10:00) Canberra, Melbourne, Sydney' },
    { value: 'Australia/Hobart', label: '(GMT + 10:00) Hobart' },
    { value: 'Pacific/Guam', label: '(GMT + 10:00) Guam, Port Moresby' },
    { value: 'Asia/Vladivostok', label: '(GMT + 10:00) Vladivostok' },
    { value: 'Asia/Magadan', label: '(GMT + 11:00) Magadan, Solomon Is., New Caledonia' },
    { value: 'Pacific/Auckland', label: '(GMT + 12:00) Auckland, Wellington' },
    { value: 'Pacific/Fiji', label: '(GMT + 12:00) Fiji, Kamchatka, Marshall Is.' },
    { value: 'Pacific/Tongatapu', label: '(GMT + 13:00) Nuku\'alofa' },
  ]

  translations = [
    {
      code: 'net',
      acronym: 'NET',
      fullText: 'NET Bible'
    },
    {
      code: 'esv',
      acronym: 'ESV',
      fullText: 'English Standard Version'
    },
    {
      code: 'kjv',
      acronym: 'KJV',
      fullText: 'King James Version'
    },
    {
      code: 'asv',
      acronym: 'ASV',
      fullText: 'American Standard Version'
    },
    {
      code: 'akjv',
      acronym: 'KJV Easy',
      fullText: 'KJV Easy Read'
    },
    {
      code: 'basicenglish',
      acronym: 'BEB',
      fullText: 'Basic English Bible'
    },
    {
      code: 'darby',
      acronym: 'Darby',
      fullText: 'Darby'
    },
    {
      code: 'ylt',
      acronym: 'YLT',
      fullText: 'Young\'s Literal Translation'
    },
    {
      code: 'web',
      acronym: 'WEB',
      fullText: 'World English Bible'
    },
    {
      code: 'wb',
      acronym: 'WB',
      fullText: 'Webster\'s Bible'
    },
    {
      code: 'douayrheims',
      acronym: 'DR',
      fullText: 'Douay Rheims'
    }
  ]

  carriers = {
    'message.alltel.com': 'Alltel',
    'txt.att.net': 'AT&T',
    'myboostmobile.com': 'Boost Mobile',
    'sms.cricketwireless.net': 'Cricket Wireless',
    'msg.fi.google.com': 'Project Fi',
    'text.republicwireless.com': 'Republic Wireless',
    'messaging.sprintpcs.com': 'Sprint',
    'tmomail.net': 'T-Mobile',
    'email.uscc.net': 'U.S. Cellular',
    'vtext.com': 'Verizon',
    'vmobl.com': 'Virgin Mobile'
  }

  constructor () { }

  getChapters (book) {
    return this.books.find(b => book === b.value).chapters
  }
}
