// 개선된 센스있는 부캐명 생성기
class AdvancedNicknameGenerator {
    constructor(saju, elementAnalysis, characteristics, gender) {
        this.saju = saju;
        this.elementAnalysis = elementAnalysis;
        this.characteristics = characteristics;
        this.gender = gender;
        this.dayMaster = saju.dayMaster;
        this.dayElement = FIVE_ELEMENTS[this.dayMaster];
    }

    // 오행별 센스있는 키워드 (게임, 영어, 한자, 밈 포함)
    getModernKeywords(element) {
        const keywords = {
            '목': {
                korean: ['푸름이', '나무꾼', '숲지기', '새싹', '가지', '잎새'],
                game: ['TreeLord', 'ForestKing', '그린마스터', 'WoodElf', '나뭇잎검사'],
                english: ['Green', 'Forest', 'Leaf', 'Branch', 'Root', 'Moss'],
                hanja: ['木神', '靑龍', '森林', '春風'],
                meme: ['초록불', '나무위키', '풀먹는하마', '초딩파워'],
                cool: ['에메랄드', '초록마왕', 'GreenFire', '숲의전사']
            },
            '화': {
                korean: ['불꽃', '태양신', '화염', '열정왕', '불새', '빛나리'],
                game: ['FireLord', 'FlameKing', '화염마법사', 'Inferno', '붉은악마'],
                english: ['Blaze', 'Flame', 'Phoenix', 'Solar', 'Heat', 'Spark'],
                hanja: ['火神', '赤龍', '烈火', '炎帝'],
                meme: ['핫도그', '불타오르네', '파이어족', '열받았어요'],
                cool: ['루비', '적마왕', 'RedDragon', '화염의검']
            },
            '토': {
                korean: ['대지', '황토', '산신령', '바위', '돌맹이', '흙이'],
                game: ['EarthLord', 'RockKing', '대지마법사', 'Terra', '황금거인'],
                english: ['Earth', 'Stone', 'Rock', 'Ground', 'Clay', 'Sand'],
                hanja: ['土神', '黃龍', '大地', '山靈'],
                meme: ['돌싱', '바위처럼', '뚱땅뚱땅', '든든이'],
                cool: ['토파즈', '황금왕', 'GoldStone', '대지의힘']
            },
            '금': {
                korean: ['은빛', '쇠칼', '금속', '철인', '강철', '은하수'],
                game: ['SteelLord', 'IronKing', '백금검사', 'Platinum', '은빛기사'],
                english: ['Silver', 'Metal', 'Iron', 'Steel', 'Blade', 'Chrome'],
                hanja: ['金神', '白虎', '銀河', '劍聖'],
                meme: ['철벽', '강철멘탈', '금사빠', '은밀한'],
                cool: ['플래티넘', '백은왕', 'SilverBlade', '강철의검']
            },
            '수': {
                korean: ['물결', '바다', '파도', '이슬', '빗물', '강물이'],
                game: ['WaterLord', 'OceanKing', '수신', 'Aqua', '파도타기'],
                english: ['Wave', 'Ocean', 'Flow', 'Rain', 'Dew', 'Aqua'],
                hanja: ['水神', '玄武', '滄海', '水龍'],
                meme: ['물어뜯', '파도파도', '흐르는대로', '물멍중'],
                cool: ['사파이어', '푸른마왕', 'DeepBlue', '바다의심장']
            }
        };
        return keywords[element] || keywords['목'];
    }

    // 일간별 특성 키워드 (현대적)
    getModernDayMasterKeywords(dayMaster) {
        const keywords = {
            '갑': {
                title: ['대장', '리더', '보스', 'Boss', '우두머리', '대빵'],
                style: ['카리스마', '선장', '지휘관', 'Commander', '팀장님']
            },
            '을': {
                title: ['예술가', '아티스트', '힐러', 'Healer', '치유사', '천사'],
                style: ['섬세함', '우아함', 'Artist', 'Grace', '미남/미녀']
            },
            '병': {
                title: ['스타', '태양', '연예인', 'Star', '빛', '인싸'],
                style: ['열정왕', '에너제틱', 'Energy', 'Sunny', '핵인싸']
            },
            '정': {
                title: ['감성', '시인', '달빛', 'Poet', '낭만', '무드등'],
                style: ['아티스트', '창작자', 'Creator', 'Moon', '감성충']
            },
            '무': {
                title: ['산', '탱커', '방패', 'Tank', '신뢰', '든든이'],
                style: ['포용자', '중재자', 'Defender', 'Shield', '어른이']
            },
            '기': {
                title: ['꼼꼼이', '실용가', '헌신자', 'Helper', '수확', '땅'],
                style: ['세심함', '완벽주의', 'Perfect', 'Care', '집사']
            },
            '경': {
                title: ['전사', '칼잡이', '의리', 'Warrior', '정의', '검사'],
                style: ['강철멘탈', '결단력', 'Justice', 'Blade', '무사']
            },
            '신': {
                title: ['보석', '귀족', '완벽', 'Noble', '품격', 'VIP'],
                style: ['엘레강스', '프리미엄', 'Luxury', 'Diamond', '도련님/아가씨']
            },
            '임': {
                title: ['현자', '철학자', '바다', 'Sage', '지혜', '멘토'],
                style: ['깊이', '포용', 'Wisdom', 'Ocean', '어르신']
            },
            '계': {
                title: ['순수', '영감', '이슬', 'Pure', '직관', '요정'],
                style: ['감성', '신비', 'Mystic', 'Fairy', '유리멘탈']
            }
        };
        return keywords[dayMaster] || keywords['갑'];
    }

    // 강점 극대화형 부캐명 생성
    generateEnhanceNicknames() {
        const elementKeys = this.getModernKeywords(this.dayElement);
        const masterKeys = this.getModernDayMasterKeywords(this.dayMaster);
        const nicknames = [];

        // 1. 게임스타일 (영어 + 한글)
        nicknames.push({
            name: `${this.pickRandom(elementKeys.english)}${this.pickRandom(masterKeys.title)}`,
            style: '게임스타일',
            reason: '당신의 강력한 에너지를 게임캐릭터처럼 표현했습니다'
        });

        // 2. 한자믹스
        nicknames.push({
            name: this.pickRandom(elementKeys.hanja),
            style: '한자스타일',
            reason: '동양적이면서도 강력한 느낌을 담았습니다'
        });

        // 3. 쿨한 영어
        nicknames.push({
            name: `${this.pickRandom(elementKeys.cool)}`,
            style: '쿨&시크',
            reason: '세련되고 임팩트 있는 이름입니다'
        });

        // 4. 한글 + 영어 조합
        nicknames.push({
            name: `${this.pickRandom(elementKeys.korean)}${this.pickRandom(masterKeys.style)}`,
            style: '한영믹스',
            reason: '친근하면서도 개성있는 조합입니다'
        });

        // 5. 밈 활용
        nicknames.push({
            name: this.pickRandom(elementKeys.meme),
            style: '밈스타일',
            reason: '재미있고 센스있는 인터넷문화를 담았습니다'
        });

        return nicknames;
    }

    // 균형/보완형 부캐명 생성
    generateBalanceNicknames() {
        const weakElement = this.elementAnalysis.weakest;
        const weakKeys = this.getModernKeywords(weakElement);
        const masterKeys = this.getModernDayMasterKeywords(this.dayMaster);
        const nicknames = [];

        // 1. 게임스타일 (부족한 오행)
        nicknames.push({
            name: `${this.pickRandom(weakKeys.game)}`,
            style: '게임스타일',
            reason: `부족한 ${ELEMENT_PROPERTIES[weakElement].name} 기운을 채워주는 이름입니다`
        });

        // 2. 한자믹스 (보완)
        nicknames.push({
            name: this.pickRandom(weakKeys.hanja),
            style: '한자스타일',
            reason: '부족한 기운을 강하게 보완합니다'
        });

        // 3. 영어 (보완)
        nicknames.push({
            name: `${this.pickRandom(weakKeys.english)}${this.pickRandom(masterKeys.style)}`,
            style: '영어믹스',
            reason: '균형잡힌 에너지를 만들어줍니다'
        });

        // 4. 한글 (보완)
        nicknames.push({
            name: `${this.pickRandom(weakKeys.korean)}${this.dayMaster}`,
            style: '한글스타일',
            reason: '당신에게 필요한 기운을 더해줍니다'
        });

        // 5. 쿨한 이름 (보완)
        nicknames.push({
            name: this.pickRandom(weakKeys.cool),
            style: '쿨&시크',
            reason: '부족한 면을 시크하게 채워줍니다'
        });

        return nicknames;
    }

    // 메인 부캐명 생성 (타입별)
    generateMainNickname(type) {
        if (type === 'enhance') {
            const elementKeys = this.getModernKeywords(this.dayElement);
            const options = [
                ...elementKeys.game,
                ...elementKeys.cool
            ];
            return this.pickRandom(options);
        } else {
            const weakElement = this.elementAnalysis.weakest;
            const weakKeys = this.getModernKeywords(weakElement);
            const options = [
                ...weakKeys.game,
                ...weakKeys.cool
            ];
            return this.pickRandom(options);
        }
    }

    // 메인 설명 생성
    generateDescription(type) {
        if (type === 'enhance') {
            return `당신의 강력한 ${ELEMENT_PROPERTIES[this.dayElement].name} 기운을 극대화! ${ELEMENT_PROPERTIES[this.dayElement].trait}을 마음껏 발휘하세요.`;
        } else {
            const weakElement = this.elementAnalysis.weakest;
            return `부족한 ${ELEMENT_PROPERTIES[weakElement].name} 기운을 채워서 완벽한 밸런스로! ${ELEMENT_PROPERTIES[weakElement].trait}을 보완합니다.`;
        }
    }

    // 랜덤 선택
    pickRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // 최종 생성
    generate(type) {
        const mainNickname = this.generateMainNickname(type);
        const alternatives = type === 'enhance'
            ? this.generateEnhanceNicknames()
            : this.generateBalanceNicknames();

        return {
            type: type,
            main: {
                name: mainNickname,
                description: this.generateDescription(type)
            },
            alternatives: alternatives
        };
    }
}
