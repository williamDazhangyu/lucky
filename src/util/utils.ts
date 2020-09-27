
const rstr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export default class utils {

    static randomStr(num: number) {

        let str = "";
        let l = rstr.length;

        while (num > 0) {

            --num;

            let tempStr = rstr[Math.floor(l * Math.random())];

            str += Math.random() > 0.5 ? tempStr.toLowerCase() : tempStr;
        }

        return str;
    }
}