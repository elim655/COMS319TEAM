fetch("./artists.json")
    .then(response => response.json())
    .then(myArtists => loadArtists(myArtists));

    function loadArtists(myArtists){
        var CardArtists = document.getElementById("col");
        for(var i=0; i<myArtists.artists.length; i++){
            let name = myArtists.artists[i].artist_name;
            let genre = myArtists.artists[i].genre_of_music;
            let url = myArtists.artists[i].picture;
            let event = myArtists.artists[i].upcoming_events;
    
            let AddCardArtist = document.createElement("div");
            AddCardArtist.classList.add("col");
            AddCardArtist.innerHTML = `
            <div class="card shadow-sm">
                <h3 class="text-center"><strong>${name}</strong></h3>
                <img src=${url} class="card-img-top" alt="${name}" ></img>
                <div class="card-body">
                  <p class="card-text">${genre}</p>
                  <div class="d-flex justify-content-between align-items-center">
                  </div>
                </div>
              </div>`;
              CardArtists.appendChild(AddCardArtist);
        }
    }