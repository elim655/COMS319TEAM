function searchArtist(e) {
    if((e && e.keyCode == 13) || e == 0) {
        var mainContainer = document.getElementById("display");

        fetch("./data.json")
            .then(response => response.json())
            .then(myArtists => loadSearchedArtist(myArtists));

        function loadSearchedArtist(myArtists) {

            let inputArtistName = document.forms["my_form"]["inputArtistName"].value;

            

            mainContainer.innerHTML = "";

            for (var i = 0; i < myArtists.artists.length; i++) {
                let card = "card-body" + i.toString();
                let name = myArtists.artists[i].artist_name;
                let genre = myArtists.artists[i].genre_of_music;
                let url = myArtists.artists[i].picture;
                let event = myArtists.artists[i].upcoming_events;

                if (name === inputArtistName) {

                    let AddCardArtist = document.createElement("div");

                    AddCardArtist.innerHTML = `
                <div class="card shadow-sm">
                    <h1 class="text-center"><strong>${name}</strong></h1>
                    <h4 class="text-center">${genre}</h4>
                    <img src=${url} class="card-img-top" alt="${name}" ></img>
                    <div style="padding-top: 20px">
                        <h2 style="float: left"><strong>E V E N T S </strong></h2>
                        <h3 style="text-indent: 7px; margin-top: 3px"> - ${event.length} RESULTS</h3>
                    </div>
                    <div id=${card} class="card-body">
                    
                    </div>
                </div>`;
                    mainContainer.appendChild(AddCardArtist);

                    for (var j = 0; j < event.length; j++) {
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
        }
    }
}