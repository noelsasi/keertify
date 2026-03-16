import type { Song, StreamingLink } from "@/types/song.types"

// Re-exported for pages that still use mock data (lyrics, favourites)
export { LANGUAGE_LABELS, CATEGORY_COLORS, STREAMING_ICONS } from "@/lib/constants"

export const MOCK_SONGS: Song[] = [
  {
    id: "1",
    slug: "aaradhana-adhika-sthothramu",
    title: "ఆరాధన అధిక స్తోత్రము",
    artist: "Various Artists",
    category: "Worship",
    language: "te",
    lyrics: ` ఆరాధన అధిక స్తోత్రము (2)
  నా యేసుకే నేనర్పింతును (2)
  నా యేసుకే నా సమస్తము (2)
  
  పరమ దూత సైన్యము నిన్ను కోరి స్తుతింపగా (2)
  వేనోళ్ళతో నే పాడెదన్ (2)
  నే పాపిని నన్ను చేకొనుమా
  
  కరుణ ధార రుధిరము నన్ను తాకి ప్రవహింపగా (2)
  నా పాపమంతయు తొలగిపోయెను (2)
  నా జీవితం నీకే అంకితం`,
    lyricsEnglish: `  Aaradhana adhika sthothramu (2)
  Naa Yesuke nenarpin thunu (2)
  Naa Yesuke naa samastamu (2)
  
  Parama dhoota sainyamu ninnu kori sthuthimpagaa (2)
  Venollato ne paadedan (2)
  Ne paapini nannu chekonumaa
  
  Karuna dhaara rudhiramu nannu thaaki pravahimpagaa (2)
  Naa paapamanhtayu tholagipoyenu (2)
  Naa jeevitham neeke ankitham`,
    canonicalSlug: "aaradhana-adhika-sthothramu",
    sourceUrl: "https://christiantelugulyrics.com",
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    slug: "yesu-naa-jeevitham",
    title: "యేసు నా జీవితం",
    artist: "Yesanna",
    category: "Praise",
    language: "te",
    lyrics: `[Verse 1]
యేసు నా జీవితం
ఆయన నా బలం
చీకటి లోపల వెలుగు
ఆయనే నా మార్గం

[Chorus]
ఆయన నా ధైర్యం
ఆయన నా ప్రాణం
హల్లెలూయా హల్లెలూయా
మహిమ మహిమ

[Verse 2]
ఆయన నా రక్షకుడు
ఆయన నా ప్రభువు
సంకటములలో నన్ను
కాపాడేవాడు

[Chorus]
ఆయన నా ధైర్యం
ఆయన నా ప్రాణం
హల్లెలూయా హల్లెలూయా
మహిమ మహిమ

[Bridge]
నేను భయపడను
ఆయన నాతో ఉన్నాడు
నిత్యకాలమూ
నన్ను నడిపిస్తాడు`,
    canonicalSlug: "yesu-naa-jeevitham",
    sourceUrl: "",
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    slug: "andaina-devuda",
    title: "అందైన దేవుడా",
    artist: "Burden Bearer",
    category: "Worship",
    language: "te",
    lyrics: `[Verse 1]
అందైన దేవుడా
నీ కృప చాలును
నీ ప్రేమ నన్ను చుట్టుకొని
నన్ను రక్షించింది

[Chorus]
నీ కృప చాలును నాకు
నీ బలమే నా బలం
బలహీనతలో నీవు
నన్ను బలపరచుతావు

[Verse 2]
నీ నామమే నా కోట
నీవే నా ఆశ్రయం
గాలివానలో నీవు
నన్ను దాచుకుంటావు

[Chorus]
నీ కృప చాలును నాకు
నీ బలమే నా బలం
బలహీనతలో నీవు
నన్ను బలపరచుతావు`,
    canonicalSlug: "andaina-devuda",
    sourceUrl: "",
    isActive: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    slug: "amazing-grace",
    title: "Amazing Grace",
    artist: "John Newton",
    category: "Thanksgiving",
    language: "en",
    lyrics: `[Verse 1]
Amazing grace, how sweet the sound
That saved a wretch like me
I once was lost, but now am found
Was blind, but now I see

[Verse 2]
'Twas grace that taught my heart to fear
And grace my fears relieved
How precious did that grace appear
The hour I first believed

[Verse 3]
Through many dangers, toils and snares
I have already come
'Tis grace hath brought me safe thus far
And grace will lead me home`,
    canonicalSlug: "amazing-grace",
    sourceUrl: "",
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    slug: "kalvari-skandham",
    title: "కల్వరి స్కందం",
    artist: "Various Artists",
    category: "Good Friday",
    language: "te",
    lyrics: `కల్వరి స్కందం మోసిన ప్రభువా (2)
నీ బాధలు చూసి మనసు నొచ్చెను (2)
నా పాపముల కొరకు మరణించిన నాథా
నీ ప్రేమకు కృతజ్ఞతలు (2)

నీ రక్తమే నన్ను కడిగెను (2)
నీ గాయమే నన్ను స్వస్థపరచెను (2)
నీ మరణమే నాకు జీవమిచ్చెను
నీకు స్తుతులు నీకు మహిమ ||కల్వరి||`,
    canonicalSlug: "kalvari-skandham",
    sourceUrl: "",
    isActive: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    slug: "unnaadu-unnaadu",
    title: "ఉన్నాడు ఉన్నాడు",
    artist: "Yesanna",
    category: "Easter",
    language: "te",
    lyrics: `ఉన్నాడు ఉన్నాడు యేసు ఉన్నాడు (2)
మరణించి లేచిన ప్రభువు ఉన్నాడు (2)
సమాధి జయించి వచ్చిన రాజు
ఉన్నాడు ఉన్నాడు నాతో ఉన్నాడు ||ఉన్నాడు||

హల్లెలూయా హల్లెలూయా (2)
ఆయన జీవించెను (2)
మృత్యువును జయించెను
ఆయన జీవించెను ||హల్లెలూయా||`,
    canonicalSlug: "unnaadu-unnaadu",
    sourceUrl: "",
    isActive: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    slug: "nee-daya-chalu",
    title: "నీ దయ చాలు",
    artist: "Burden Bearer",
    category: "Comfort",
    language: "te",
    lyrics: `నీ దయ చాలు నాకు ప్రభువా (2)
నీ కృప చాలు నాకు (2)
నీ శాంతి మించిన సంపద లేదు
నీవే నా సర్వస్వం ||నీ దయ||

స్తుతి స్తుతి స్తుతి (2)
నీకే స్తుతి (2)
వందన వందన వందన
నీకే వందన ||స్తుతి||`,
    canonicalSlug: "nee-daya-chalu",
    sourceUrl: "",
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    slug: "yesayya-nee-mahima",
    title: "యేసయ్యా నీ మహిమ",
    artist: "Kasi Viswanathan",
    category: "Christmas",
    language: "te",
    lyrics: `యేసయ్యా నీ మహిమ (2)
స్వర్గము నిండెను (2)
దేవదూతలు పాడిరి
ఆనందముతో ||యేసయ్యా||

బేత్లేహేము గ్రామమున (2)
పుట్టెను రాజు (2)
పశువుల పాకలో
పవళించెను ప్రభువు ||యేసయ్యా||`,
    canonicalSlug: "yesayya-nee-mahima",
    sourceUrl: "",
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const MOCK_STREAMING_LINKS: StreamingLink[] = [
  { id: "sl-1", songId: "1", platform: "youtube", url: "https://youtube.com" },
  {
    id: "sl-7",
    songId: "1",
    platform: "jiosaavn",
    url: "https://jiosaavn.com",
  },
  { id: "sl-8", songId: "1", platform: "spotify", url: "https://spotify.com" },
  { id: "sl-2", songId: "2", platform: "youtube", url: "https://youtube.com" },
  { id: "sl-3", songId: "2", platform: "spotify", url: "https://spotify.com" },
  { id: "sl-4", songId: "4", platform: "youtube", url: "https://youtube.com" },
  {
    id: "sl-5",
    songId: "4",
    platform: "apple",
    url: "https://music.apple.com",
  },
  { id: "sl-6", songId: "6", platform: "youtube", url: "https://youtube.com" },
]

