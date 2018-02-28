const wrapper = document.querySelector(".input-wrapper"),
      textInput = document.querySelector("input[type='text']");

textInput.addEventListener("keyup", event => {
  wrapper.setAttribute("data-text", event.target.value);
});

var client = new $.es.Client({
    hosts: 'https://search-cerebro-xg6oa5f4gmcispwqp3kn3p6mta.us-west-2.es.amazonaws.com'
});

var transliterate = (
    function() {
        var
        rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
        eng = "shh sh ch cz yu ya yo zh `` y e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g)
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

var input = document.body.children[0];
input.oninput = function() {
    if ($('input').val() != "")
    search($('input').val());
    else
    $('#my').text('')
};

function search(name) {
    name = "*"+transliterate(name)+"* OR *"+transliterate(transliterate(name), true)+"*"
    client.search({
        index: 'skoltech',
        type: 'professora',
        body: {
            query: {
                query_string: {
                    fields: ["name^5", "lastname^4", "position^3", "center^2", "bio"],
                    query: name
                }
            }
        }
    }).then(function (resp) {
        if (resp.hits.total != 0) {
            $('#my').createTable(resp.hits.hits.map(function(name, i) {
                delete resp.hits.hits[i]._source.crei
                resp.hits.hits[i]._source.name += ' ' + resp.hits.hits[i]._source.lastname
                delete resp.hits.hits[i]._source.lastname
                return resp.hits.hits[i]._source;
            }));
        } else {
            $('#my').text('No results');
            $('#my').attr('style', 'text-align: center; color: white;');
        }
    }, function (err) {
        console.trace(err.message);
    });
}
