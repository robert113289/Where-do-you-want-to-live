
function loadData() {
    event.preventDefault();
    var $body = $("body");
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $("#nytimes-header");
    var $nytElem = $("#nytimes-articles");
    var $greeting = $("#greeting");
    var $form = $('.form-container')

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ", " + city;
        
    $greeting.text('So, you want to live at ' + address + '?');

    let streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');
    
    // load new york times
   // Built by LucyBot. www.lucybot.com
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
    'api-key': "ps9ssPLJkAt28k4SzIuoovCdCpbFgl7i",
    'q': city,
    'sort': "newest",
    'fl': "web_url, snippet, headline"
    });

    $.ajax({
    url: url,
    method: 'GET',
    }).done(function (result) {        
        let articles = result.response.docs;
        let articleElem = document.getElementById("nytimes-articles");
        for (let i = 0; i < articles.length; i++){
            let li = document.createElement("li"); 
            let a = document.createElement("a");
            a.setAttribute("href", articles[i].web_url);
            a.innerText = articles[i].headline.main;
            let p = document.createElement("p");
            p.textContent = articles[i].snippet;
            li.appendChild(a);
            li.appendChild(p);
            articleElem.appendChild(li);
        }
        
        }).fail(function (err) {
            let NytHeader = document.getElementById("nytimes-header");
            NytHeader.innerText = "New York Times Articles Could Not Be Loaded."
        });
    
      // load wikipedia data
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function( response ) {
            var articleList = response[1];

            for (let i = 0; i < articleList.length; i++) {
                let articleStr = articleList[i];
                let url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};



$("#form-container").submit(loadData);
