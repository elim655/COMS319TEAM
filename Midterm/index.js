fetch("./data.json")
    .then(response => response.json())
    .then(myArtists => loadArtists(myArtists));

    function loadArtists(myArtists){
        var CardArtists = document.getElementById("col");
        for(var i=0; i<myArtists.artists.length; i++){
            let card = "card-body" + i.toString();
            let name = myArtists.artists[i].artist_name;
            let genre = myArtists.artists[i].genre_of_music;
            let url = myArtists.artists[i].picture;
            let event = myArtists.artists[i].upcoming_events;
    
            let AddCardArtist = document.createElement("div");
            AddCardArtist.classList.add("col");
            AddCardArtist.innerHTML = `
            <div class="card shadow-sm">
                <h2 class="text-center"><strong>${name}</strong></h2>
                <h4 class="text-center">${genre}</h4>
                <img src=${url} class="card-img-top" alt="${name}" ></img>
                <div id=${card} class="card-body">

                </div>
              </div>`;
              CardArtists.appendChild(AddCardArtist);

              for(var j=0; j< event.length; j++){
                var eventArtist = document.getElementById(card);
                let date = event[j].date;
                let time = event[j].time;
                let state = event[j].state;
                let city = event[j].city;
                let building = event[j].building;

                let AddEvent = document.createElement("div");
                AddEvent.innerHTML = `
                <p class="card-text"><strong>${date}</strong>, ${time} at ${building} ${city}, ${state}</p>
                `;
                eventArtist.appendChild(AddEvent);
              }
        }
    }