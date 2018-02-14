var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(3000, function(){
    console.log('Server running on 3000...');
});

// function toTranslit(text) {
//     return text.replace(/([а-яё])|([\s_-])|([^a-z\d])/gi,
//     function (all, ch, space, words, i) {
//         if (space || words) {
//             return space ? '-' : '';
//         }
//         var code = ch.charCodeAt(0),
//             index = code == 1025 || code == 1105 ? 0 :
//                 code > 1071 ? code - 1071 : code - 1039,
//             t = ['yo', 'a', 'b', 'v', 'g', 'd', 'e', 'zh',
//                 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p',
//                 'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh',
//                 'shch', '', 'y', '', 'e', 'yu', 'ya'
//             ];
//         return t[index];
//     });
// }
// console.log(toTranslit('Дмитрий'));

var transliterate = (
    function() {
        var
            rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й й к л м н о п р с т у ф х ь".split(/ +/g),
            eng = "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i y j k l m n o p r s t u f x `".split(/ +/g)
        ;
        return function(text, engToRus) {
            var x;
            for(x = 0; x < rus.length; x++) {
                text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
                text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());
            }
            return text;
        }
    }
)();
var txt = "Dmitri";
console.log(transliterate(txt));
console.log(transliterate(transliterate(txt), true));
