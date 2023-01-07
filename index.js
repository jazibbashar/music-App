// variable initialisation
// const url = `https://api.napster.com/v2.1/tracks/top?apikey=MzE2OWNmYmYtMDhiMS00MmY3LWE3ZmQtYjI0MjA5OTRlOGI2`;
const url=`https://api.napster.com/v2.1/tracks/top?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm`;
const music = document.getElementById('music');
const masterPlayButton = document.getElementById('masterPlay');
const songItem = Array.from(document.getElementsByClassName('songName'));
const container = document.getElementById('container');
const seekBar = document.getElementById('rangeBar');
const forwardBtn = document.getElementById('forward');
const backwardBtn = document.getElementById('backward');
const timeStamp = document.getElementById('timeStamp');
const masterSongName = document.getElementById('masterSongName')
const queueBtn = document.getElementById('Queue');
const queueContainer = document.getElementById('queueContainer');
const shuffle = document.getElementById('shuffle');
 
let seek_slider = document.querySelector(".seek_slider");
// let volume_slider = document.querySelector(".volume_slider");


const next = document.getElementById('next')
const previous = document.getElementById('previous')
let volume_slider = document.querySelector(".volume_slider");
// console.log(songItem)

// Bottom Play Button
masterPlayButton.addEventListener('click', () => {
    if (music.paused || music.currentTime <= 0) {
        music.play();
        masterPlayButton.classList.remove('fa-circle-play');
        masterPlayButton.classList.add('fa-circle-pause');
        masterSongName.innerText = 'Line Without a Hook';
    } else {
        music.pause();
        masterPlayButton.classList.add('fa-circle-play');
        masterPlayButton.classList.remove('fa-circle-pause');
    }
});

   
// from here system js
let namesArr=[]
// Api data and playing from container
const musicData = async () => {
    const response = await fetch(url);
    const data = await response.json();
    const list = data.tracks;

    const element = list.map(item => {
        // console.log(item);
        const htmlData = `
        <div class="songList">
            <p class="songName" data-preview-url="${item.previewURL}" name="${item.name}" >${item.name}</p>
        </div>`;
        return htmlData;
    }).join('');

    container.insertAdjacentHTML('beforeend', element);
     songNames = document.querySelectorAll('.songName');
    // console.log(songNames);
    songNames.forEach(name => {
        const nameAttr = name.getAttribute('name')

        name.addEventListener('click', () => {
            const previewUrl = name.getAttribute('data-preview-url');
            music.src = previewUrl;
            music.play();
            masterSongName.innerText = nameAttr
            masterPlayButton.classList.remove('fa-circle-play');
            masterPlayButton.classList.add('fa-circle-pause');
        });
        namesArr.push(nameAttr)
    });
    // console.log(namesArr);
    const searchResults = document.getElementById('search-results');

    search.addEventListener('click', () => {
        searchBar.style.display = 'block';
    });

    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredResults = namesArr.filter(name => name.toLowerCase().includes(searchTerm));

        searchResults.innerHTML = ''; // Clear previous search results
        filteredResults.forEach(name => {
            const resultElement = document.createElement('div');
            resultElement.innerText = name;
            searchResults.appendChild(resultElement);
        });
    });

    // showing search div when search focus
    searchBar.addEventListener('focus', () => {
        searchResults.style.display = 'block';
    });

    // hiding search div when search focus
    searchBar.addEventListener('blur', () => {
        searchResults.style.display = 'none';
    });

};

musicData();

// seekBar Update and time update also the variable 
seekBar.addEventListener('input', () => {
    music.currentTime = (seekBar.value / 100) * music.duration;
});

music.addEventListener('timeupdate', () => {
    let progress = parseInt((music.currentTime / music.duration) * 100);
    seekBar.value = progress;
    let currentMinutes = Math.floor(music.currentTime / 60);
    let currentSeconds = Math.floor(music.currentTime % 60);
    let totalMinutes = Math.floor(music.duration / 60);
    let totalSeconds = Math.floor(music.duration % 60);
    timeStamp.innerText = `${currentMinutes}:${currentSeconds} / ${totalMinutes}:${totalSeconds}`;
});

// music.addEventListener('ended',()=>{
//     masterPlayButton.classList.remove('fa-circle-pause');
//     masterPlayButton.classList.add('fa-circle-play');
// })

// forward 5sec
forwardBtn.addEventListener('click',()=>{
    music.currentTime += 5;
})

// backward 5 sec
backwardBtn.addEventListener('click',()=>{
    music.currentTime -= 5;
})

// Keep track of current song index
let currentSongIndex = 0;

// Set up event listeners for next and previous buttons
next.addEventListener('click', () => {
    // Increment current song index
    currentSongIndex++;

    // If current song index is greater than or equal to the length of the song names array, set it to 0
    if (currentSongIndex >= namesArr.length) {
        currentSongIndex = 0;
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      

    // Get preview URL for current song
    const previewUrl = songNames[currentSongIndex].getAttribute('data-preview-url');

    // Update music source and play music
    music.src = previewUrl;
    music.play();
    masterSongName.innerText = songNames[currentSongIndex].getAttribute('name');
});

previous.addEventListener('click', () => {
    // Decrement current song index
    currentSongIndex--;

    // If current song index is less than 0, set it to the last index in the song names array
    if (currentSongIndex < 0) {
        currentSongIndex = namesArr.length - 1;
    }

    // Get preview URL for current song
    const previewUrl = songNames[currentSongIndex].getAttribute('data-preview-url');

    // Update music source and play music
    music.src = previewUrl;
    music.play();
    masterSongName.innerText = songNames[currentSongIndex].getAttribute('name');
});



function addToQueue() {
    const currentSongName = masterSongName.innerText;
    const currentPreviewUrl = music.src;
    // Add the current song to the queue
    const html = `
  <div class="queuedSong">
    <p class="queuedSongName">${currentSongName}</p>
    <audio src="${currentPreviewUrl}" class="queuedSongAudio"></audio>
  </div>
`;
    queueContainer.insertAdjacentHTML('beforeend', html);

    // Check if shuffle is enabled
    if (shuffle.checked) {
        // Shuffle the queue
        shuffleQueue();
    }
}

function shuffleQueue() {
    // Get all the queuedSong elements and their audio elements
    const queueDiv = Array.from(document.querySelectorAll('.queuedSong'));
    const queueDivAudio = Array.from(document.querySelectorAll('.queuedSong audio'));
    // Randomize the order of the elements using the Fisher-Yates shuffle algorithm
    for (let i = queueDiv.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [queueDiv[i], queueDiv[j]] = [queueDiv[j], queueDiv[i]];
        [queueDivAudio[i], queueDivAudio[j]] = [queueDivAudio[j], queueDivAudio[i]];
    }
    // Clear the queueContainer
    queueContainer.innerHTML = '';
    // Append the elements to the queueContainer in the new randomized order
    queueDiv.forEach((queuedSong, index) => {
        queueContainer.appendChild(queuedSong);
    });
}


shuffle.addEventListener('click', () => {
    shuffleQueue();
});

// let queue = []

const playQueue = () => {
    const queueDiv = Array.from(document.querySelectorAll('.queuedSong'));
    const queueDivAudio = Array.from(document.querySelectorAll('.queuedSong audio'));
    const queDivText = Array.from(document.querySelectorAll('.queuedSong p'));
    const textQueue = queDivText.map(queuedSongName => queuedSongName.innerText);

    // shuffle the queue
    const shuffleQueue = (queue) => {
        for (let i = queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [queue[i], queue[j]] = [queue[j], queue[i]];
        }
        return queue;
    };
// queue div music play
    queueDiv.forEach((queuedSong, index) => {
        queuedSong.addEventListener('click', () => {
            music.src = queueDivAudio[index].src;
            music.play();
            masterSongName.innerText = textQueue[index];
            masterPlayButton.classList.remove('fa-circle-play');
            masterPlayButton.classList.add('fa-circle-pause');

            // Play next song in queue when current song ends
            music.addEventListener('ended', () => {
                // get the shuffled queue
                const shuffledQueue = shuffleQueue(queueDivAudio);
                const shuffledQueueText = shuffleQueue(textQueue);
                // find the current index in the shuffled queue
                const currentIndex = shuffledQueue.findIndex((song) => song.src === music.src);
                if (currentIndex + 1 < shuffledQueue.length) {
                    // Play next song in queue
                    masterSongName.innerText = shuffledQueueText[currentIndex + 1];
                    music.src = shuffledQueue[currentIndex + 1].src;
                    music.play();
                }
            });
        });
    });
}

// queue div show hide

queueBtn.addEventListener('click', () => {
    console.log('clicked');
    queueContainer.classList.toggle('show');
    container.classList.toggle('hide');

    playQueue()
});

// playliist implementation
const playlistAdd = document.querySelector('.playlistAdd');

playlistAdd.addEventListener('click', () => {
    // Get the current playing music
    const currentMusic = {
        name: masterSongName.innerText,
        url: music.src
    };

    // Check if there are any items in the playlist
    if (localStorage.getItem('playlist')) {
        // If there are, get the playlist array
        let playlist = JSON.parse(localStorage.getItem('playlist'));
        // Add the current music to the playlist array
        playlist.push(currentMusic);
        // Save the updated playlist array to local storage
        localStorage.setItem('playlist', JSON.stringify(playlist));
    } else {
        // If there are no items in the playlist, create a new array with the current music
        let playlist = [currentMusic];
        // Save the new playlist array to local storage
        localStorage.setItem('playlist', JSON.stringify(playlist));
    }
    showPlaylist();
});


const playLists = document.getElementById('playLists');
const playlistDiv = document.getElementById('playlistDiv');
const searchPlaylist = document.getElementById('searcIconPlaylist')
const searchPlaylistInput = document.getElementById('searchPlaylistInput');

playLists.addEventListener('click',()=>{
    playlistDiv.classList.toggle('show')
})

const showPlaylist = () => {
    const storedItems = localStorage.getItem('playlist');
    // Get the items from local storage
    playlistDiv.innerText = '';

    // parse items into an array
    const playlistArr = JSON.parse(storedItems);

 

    const playlistElements = playlistArr.map(item => {
        // console.log(item);
        return `<div>${item.name}</div>`;
    }).join('');

    // add the elements to the playlistDiv
    playlistDiv.insertAdjacentHTML('beforeend', playlistElements);

};

//  search playlist
searchPlaylist.addEventListener('click', () => {
    searchPlaylistInput.style.display = 'block';

})


searchPlaylistInput.addEventListener('input', () => {
    // Get search term from searchPlaylistInput element
    const searchTerm = searchPlaylistInput.value.toLowerCase();

    // Retrieve playlist array from local storage
    const playlist = JSON.parse(localStorage.getItem('playlist'));

    // Filter playlist array for names that include search term
    const filteredResults = playlist.filter(item => item.name.toLowerCase().includes(searchTerm));

    // Clear previous search results
    playlistDiv.innerHTML = '';

    // Display filtered results in searchDiv
    filteredResults.forEach(item => {
        const resultElement = document.createElement('div');
        resultElement.innerText = item.name;
        document.getElementById('playlistDiv').appendChild(resultElement);
    });
git });




