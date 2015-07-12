var data;
var myApp = angular.module('myApp', [])

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.audioObject = {}
  $scope.hideme = true

  // Gets songs that match what was typed in the input form
  $scope.getSongs = function() {
    $http.get('https://api.spotify.com/v1/search?type=track&query=' + $scope.track).success(function(response){
      data = $scope.tracks = response.tracks.items
    })
  }

  // Gets suggested tracks based on the given song, using the following algorithm:
  //1. Get artist of the song, 2. Get 5 related artists of this artist, 3. Get the top track of each related artist
  $scope.getSuggestedTracks = function(track) {
    $scope.selectedTrack = track
    var suggestedTracks = [];
    var suggestedArtists = [];
    //1. Get artist
    $http.get('https://api.spotify.com/v1/tracks/' + track.id).success(function(response1) {
      var artist = response1.artists[0]
      $scope.selectedArtist = artist
      //2. Get 5 related artsits
      $http.get('https://api.spotify.com/v1/artists/' + artist.id + '/related-artists').success(function(response2) {
        for (i = 0; i < 5; i++) {
          var relatedArtist = response2.artists[i]
          suggestedArtists.push(relatedArtist)
          //3. Get top track
          $http.get('https://api.spotify.com/v1/artists/' + relatedArtist.id + '/top-tracks?country=se').success(function(response3) {
            var topTrack = response3.tracks[0];
            suggestedTracks.push(topTrack)
          })
        }
        $scope.suggestedTracks = suggestedTracks
        $scope.suggestedArtists = suggestedArtists
      })
    })
  }

  // Shows the results of the song query
  $scope.showResults = function () {
    $scope.artistSelected = true;
  }

  // Allows another query to be made
  $scope.reload = function() {
    $scope.hideme = false;
  }

  // Plays a 30 second preview of the given song
  $scope.play = function(song) {
    if($scope.currentSong == song) {
      $scope.audioObject.pause()
      $scope.currentSong = false
      return
    }
    else {
      if($scope.audioObject.pause != undefined) $scope.audioObject.pause()
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play()  
      $scope.currentSong = song
    }
  }

  // Raises volume of the audio by 10%
  $scope.raiseVolume = function() {
    if ($scope.audioObject.volume >= 1) {
      alert("You have reached the maximum volume!")
    } else {
      $scope.audioObject.volume = $scope.audioObject.volume + 0.1;
    }
  }

  // Lowers volume of the audio by 10%
  $scope.lowerVolume = function() {
    if ($scope.audioObject.volume >= 0) {
      $scope.audioObject.volume = $scope.audioObject.volume - 0.1;
    } 
  }

})

// Adds tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});
