// AniList GraphQL API를 사용하여 캐릭터 이미지 가져오기
// 사용법: node fetch-anime-images.js

const fs = require('fs');

// GraphQL 쿼리
const query = `
query ($search: String) {
  Character(search: $search) {
    name {
      full
      native
    }
    image {
      large
      medium
    }
  }
}
`;

// 캐릭터 이름 매핑 (영어명)
const characterSearchNames = {
  1: "Naruto Uzumaki",
  2: "Sasuke Uchiha",
  3: "Sakura Haruno",
  4: "Monkey D. Luffy",
  5: "Roronoa Zoro",
  6: "Nami",
  7: "Son Goku",
  8: "Vegeta",
  9: "Eren Yeager",
  10: "Mikasa Ackerman",
  11: "Armin Arlert",
  12: "Ichigo Kurosaki",
  13: "Rukia Kuchiki",
  14: "Edward Elric",
  15: "Alphonse Elric",
  16: "Levi",
  17: "Taki Tachibana",
  18: "Mitsuha Miyamizu",
  19: "Taiga Aisaka",
  20: "Ryuuji Takasu",
  21: "Kirito",
  22: "Asuna Yuuki",
  23: "Shinobu Kocho",
  24: "Kamado Tanjirou",
  25: "Nezuko Kamado",
  26: "Rengoku Kyoujurou",
  27: "Tomioka Giyuu",
  28: "Zenitsu Agatsuma",
  29: "Inosuke Hashibira",
  30: "Saitama",
  31: "Genos",
  32: "Kageyama Shigeo",
  33: "Reigen Arataka",
  34: "Midoriya Izuku",
  35: "Bakugou Katsuki",
  36: "Todoroki Shouto",
  37: "Yagi Toshinori",
  38: "Hatake Kakashi",
  39: "Hyuuga Hinata",
  40: "Gaara",
  41: "Sanji",
  42: "Nico Robin",
  43: "Tony Tony Chopper",
  44: "Portgas D. Ace",
  45: "Yagami Light",
  46: "L",
  47: "Hirasawa Yui",
  48: "Akiyama Mio",
  49: "Ichijou Hotaru",
  50: "Miyauchi Renge",
  51: "Kurisu Makise",
  52: "Okabe Rintarou",
  53: "Kamina",
  54: "Simon",
  55: "Spike Spiegel",
  56: "Lelouch vi Britannia",
  57: "C.C.",
  58: "Kamijou Touma",
  59: "Misaka Mikoto",
  60: "Accelerator",
  61: "Emilia",
  62: "Subaru Natsuki",
  63: "Rem",
  64: "Ram",
  65: "Rintarou Okabe",
  66: "Mayuri Shiina",
  67: "Dio Brando",
  68: "Jotaro Kujo",
  69: "Joseph Joestar",
  70: "Killua Zoldyck",
  71: "Gon Freecss",
  72: "Hisoka Morow",
  73: "Kuroko Tetsuya",
  74: "Kagami Taiga",
  75: "Hachiman Hikigaya",
  76: "Yukino Yukinoshita",
  77: "Yui Yuigahama",
  78: "Shouya Ishida",
  79: "Shouko Nishimiya",
  80: "Violet Evergarden",
  81: "Anya Forger",
  82: "Loid Forger",
  83: "Yor Forger",
  84: "Ai Hoshino",
  85: "Aqua Hoshino",
  86: "Ruby Hoshino",
  87: "Denji",
  88: "Power",
  89: "Makima",
  90: "Satoru Gojo",
  91: "Yuji Itadori",
  92: "Megumi Fushiguro",
  93: "Nobara Kugisaki",
  94: "Sukuna",
  95: "Thorfinn",
  96: "Askeladd",
  97: "Senku Ishigami",
  98: "Taiju Ooki",
  99: "Yuzuriha Ogawa",
  100: "Megumin",
  101: "Satoru Gojo",
  102: "Yuji Itadori",
  103: "Megumi Fushiguro",
  104: "Nobara Kugisaki",
  105: "Denji",
  106: "Power",
  107: "Makima",
  108: "Anya Forger",
  109: "Loid Forger",
  110: "Yor Forger",
  111: "Ai Hoshino",
  112: "Aqua Hoshino",
  113: "Ruby Hoshino",
  114: "Thorfinn",
  115: "Askeladd",
  116: "Senku Ishigami",
  117: "Killua Zoldyck",
  118: "Gon Freecss",
  119: "Hisoka Morow",
  120: "Leorio Paradinight",
  121: "Kurapika",
  122: "Dio Brando",
  123: "Jotaro Kujo",
  124: "Joseph Joestar",
  125: "Giorno Giovanna",
  126: "Lelouch vi Britannia",
  127: "C.C.",
  128: "Genos",
  129: "Shigeo Kageyama",
  130: "Reigen Arataka",
  131: "Violet Evergarden",
  132: "Hachiman Hikigaya",
  133: "Yukino Yukinoshita",
  134: "Yui Yuigahama",
  135: "Shouya Ishida",
  136: "Shouko Nishimiya",
  137: "Tetsuya Kuroko",
  138: "Taiga Kagami",
  139: "Mikoto Misaka",
  140: "Touma Kamijou",
  141: "Accelerator",
  142: "Shoyo Hinata",
  143: "Tobio Kageyama",
  144: "Draken",
  145: "Takemichi Hanagaki",
  146: "Mikasa Ackerman",
  147: "Emma",
  148: "Norman",
  149: "Ray",
  150: "Tanya Degurechaff"
};

async function fetchCharacterImage(characterName) {
  const url = 'https://graphql.anilist.co';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: { search: characterName }
      })
    });

    const data = await response.json();

    if (data.data && data.data.Character) {
      return data.data.Character.image.large;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch ${characterName}:`, error.message);
    return null;
  }
}

async function updateCharacterImages() {
  // 기존 JSON 파일 읽기
  const jsonPath = './anime-characters.json';
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  console.log('🔍 Fetching character images from AniList...\n');

  for (let i = 0; i < data.characters.length && i < 150; i++) {
    const character = data.characters[i];
    const searchName = characterSearchNames[character.id];

    if (!searchName) {
      console.log(`⏭️  Skipping ${character.name} - no search name`);
      continue;
    }

    console.log(`📥 Fetching: ${searchName}...`);
    const imageUrl = await fetchCharacterImage(searchName);

    if (imageUrl) {
      character.image = imageUrl;
      console.log(`✅ ${searchName}: ${imageUrl}\n`);
    } else {
      console.log(`❌ ${searchName}: Not found\n`);
    }

    // API rate limit 방지 (1초 대기)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 업데이트된 JSON 저장
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  console.log('✅ anime-characters.json updated!');
}

// 실행
updateCharacterImages().catch(console.error);
