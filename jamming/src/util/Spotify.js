let accessToken;
const redirectURI = "http://localhost:3000/";
const clientID = "869275be15d74ccca6c03c907b64b0b9";

const Spotify = {
	getAccessToken() {
		if (accessToken) {
			return accessToken;
		}

		const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
		const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

		if (accessTokenMatch && expiresInMatch) {
			accessToken = accessTokenMatch[1];
			const expiresIn = expiresInMatch[1];
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
		} else {
			const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessUrl;
		}
	},

	search(searchTerm) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },

  savePlaylist(playlistName, trackURIs) {
  	if (!playlistName || !trackURIs.length) {
  		return;
  	}

  	const accessToken = Spotify.getAccessToken();
  	const headers = {Authorization: `Bearer ${accessToken}`};
    let userID;

    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
    	userID = jsonResponse.id;
    	return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
    		headers: headers,
    		method: 'POST',
    		body: JSON.stringify({name: playlistName})
    	}).then(response => response.json()
    	).then(jsonResponse => {
    		const playlistID = jsonResponse.id;
    		return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackURIs})
        });
    	});
    });
  }
};

export default Spotify;

















