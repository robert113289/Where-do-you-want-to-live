
function loadData() {
    event.preventDefault();
    var $body = $("body");
    var $wikiElem = $("#wikipedia-links");
    var $nytHeaderElem = $("#nytimes-header");
    var $nytElem = $("#nytimes-articles");
    var $greeting = $("#greeting");
    var $form = $('.form-container')

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    
    let street = $form.find("#street").val();
    let city = $form.find("#city").val();
    let address = street + ", " + city;
    let streetView = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location=";
    let streetViewurl = streetView + address;
    let img = document.createElement("img");
    img.setAttribute("src", streetViewurl);
    img.setAttribute("class", "bgimg");
    document.body.appendChild(img);


    // load new york times
   // Built by LucyBot. www.lucybot.com
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
    'api-key': "0e498fa05a4a4e3aafaafa4d0cc65039",
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
    
    let wikiUrl = 'http://en.wikipedia.org/w/api.php';
    wikiUrl += '?' + $.param({
        "action": "opensearch",
	    "format": "json",
        "search": city,
        "origin": "*"
    });
    //load wiki links
    let settings = {
        url: wikiUrl,
        datatype: "json",
        crossDomain:true,
        success: function (response) {
            let articleList = response[1];
            
            for (let i = 0; i < articleList.length; i++){
                let articleStr = articleList[i];
                let url = 'Http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            }
        }
    };

    $.ajax(settings);
}


$("#form-container").submit(loadData);
