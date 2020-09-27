
import crypto from 'crypto';

const serects = {

    aes: 'aes-256-cbc'
}

export default class cryptoUtil {

    static aesDecode(cryptkey: string, iv: string, secretdata: string, aesType?: string) {

        aesType = !aesType ? serects.aes : aesType;
        let decipher = crypto.createDecipheriv(aesType, cryptkey, iv);
        let decoded = decipher.update(secretdata, 'base64', 'utf8');

        decoded += decipher.final('utf8');
        return decoded;
    }

    static aesEncode(cryptkey: string, iv: string, cleardata: string, aesType?: string) {

        aesType = !aesType ? serects.aes : aesType;
        let encipher = crypto.createCipheriv(serects.aes, cryptkey, iv);
        let encoded = encipher.update(cleardata, 'utf8', 'base64');

        encoded += encipher.final('base64');
        return encoded;
    }
}