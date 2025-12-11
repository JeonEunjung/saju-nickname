// 시드 기반 랜덤 생성기 (생년월일을 시드로 사용하여 동일 사주도 다른 별명 생성)
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
        this.m = 2147483647;
        this.a = 48271;
        this.c = 0;
        this.state = seed % this.m;
        if (this.state <= 0) this.state += this.m - 1;
    }

    // 0~1 사이의 랜덤 숫자 생성
    next() {
        this.state = (this.state * this.a + this.c) % this.m;
        return this.state / this.m;
    }

    // 배열에서 랜덤 선택
    choice(array) {
        const index = Math.floor(this.next() * array.length);
        return array[index];
    }

    // min ~ max 사이의 정수 반환
    randint(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    // 배열 섞기 (Fisher-Yates)
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(this.next() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
}

// 생년월일로부터 시드 생성
function generateSeedFromBirthdate(year, month, day, hour) {
    return year * 10000 + month * 100 + day * 1 + hour * 100000;
}
