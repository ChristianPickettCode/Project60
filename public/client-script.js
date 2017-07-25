

var currentUser = {};

function signOut() {
  // Sign out
  firebase.auth().signOut();
  console.log("Signed Out");
  window.location.href = "/";
};

// Listen to auth state changes
firebase.auth().onAuthStateChanged(function(user) {

  // Not login in
  if (!user) {
    window.location.href = "/"
  }

  currentUser = user;
  //console.log('user', currentUser);
  //console.log('user uid', currentUser.uid);

  if (user) {

    if (window.location.pathname ==  "/favs") {

      //console.log(currentUser)

      var thisEpTitle = $(this).attr('title');
      var showName = $(this).attr('name')
      //console.log(thisEpTitle)

      var currentUserRef = firebase.database().ref('users/' + currentUser.uid);

      var favShowsRef = currentUserRef.child('favShows');
      favShowsRef.once('value')
        .then(function(snap) {
          //console.log(snap.val())
          var favShowAreadyInDB = false;
          for (key in snap.val()) {
            var name = snap.val()[key].name

            var fixedTitle = findAndReplace(name, "-", " ");
            var fixedCapTitle = toTitleCase(fixedTitle);

            $("#favContainer ul").append("<li class='collection-item' id='" + name + "'><a href='/" + name + "'>" + fixedCapTitle + "</a><button class='right' id='" + name + "' class='removeFromFav' onclick='removeFromFav(this.id);'>Remove</button></li>")
            //console.log(name)
          }
        });

    }

    if (window.location.pathname ==  "/recents" || window.location.pathname ==  "/home") {

      //console.log(currentUser)

      var thisEpTitle = $(this).attr('title');
      var showName = $(this).attr('name')
      //console.log(thisEpTitle)

      var currentUserRef = firebase.database().ref('users/' + currentUser.uid);

      if (window.location.pathname ==  "/home") {
        var favShowsRef = currentUserRef.child('recents').limitToLast(20);
      } else {
        var favShowsRef = currentUserRef.child('recents');
      }


      favShowsRef.once('value')
        .then(function(snap) {
          //console.log(snap.val())
          var favShowAreadyInDB = false;

          var recentsArr = [];

          for (key in snap.val()) {
            var name = snap.val()[key].name

            var fixedTitle = findAndReplace(name, "-", " ");
            var fixedCapTitle = toTitleCase(fixedTitle);

            // $("#recentsContainer ul").append("<li><a href='/Ep/" + name + "'>" + fixedCapTitle + "</a></li>");
            recentsArr.push("<li class='collection-item'><a href='/Ep/" + name + "'>" + fixedCapTitle + "</a></li>")
            //console.log(name)
          }

          recentsArr.reverse();

          for (var i = 0; i < recentsArr.length; i++) {
            $("#recentsContainer ul").append(recentsArr[i])
            //console.log(recentsArr[i])
          }

        });
    }

  }


});

//var epTitle = document.querySelector('#ep').title;

$('#ep a').click(function(e) {
  e.preventDefault();
  //console.log("ok")

  var thisEpTitle = $(this).attr('title').replace("/", "");
  var thisHref = $(this).attr('href');
  //console.log(thisEpTitle)

  var currentUserRef = firebase.database().ref('users/' + currentUser.uid);

  var recentShowRef = currentUserRef.child('recents');

  recentShowRef.once('value')
    .then(function(snap) {
      //console.log(snap.val())
      var recentShowAreadyInDB = false;
      for (key in snap.val()) {
        if (snap.val()[key].name == thisEpTitle) {
          recentShowAreadyInDB = true;
        }
      }

      if (!recentShowAreadyInDB) {
        recentShowRef.push({
          name: thisEpTitle
        })
        window.location = thisHref;
      } else {
        window.location = thisHref;
      }
    });
});

$('button').click( function(e) {
  
  if (this.className.indexOf("favBtn") > -1) {

    var thisEpTitle = $(this).attr('title');
    var showName = $(this).attr('name')

    var currentUserRef = firebase.database().ref('users/' + currentUser.uid);

    var favShowsRef = currentUserRef.child('favShows');

    favShowsRef.once('value')
      .then(function(snap) {
        var favShowAreadyInDB = false;
        for (key in snap.val()) {
          if (snap.val()[key].name == thisEpTitle) {
            favShowAreadyInDB = true;
          }
        }

        if (!favShowAreadyInDB) {
          favShowsRef.push({
            name: thisEpTitle,
            views : 1
          })
          alert ("Added " + showName + " to favs")
        } else {
          alert (showName + " is aready a fav")
        }
      })
  }
} );

function removeFromFav(id) {

  var currentUserRef = firebase.database().ref('users/' + currentUser.uid);

  var favShowsRef = currentUserRef.child('favShows');

  favShowsRef.once('value')
    .then(function(snap) {
      for (key in snap.val()) {
        if (snap.val()[key].name == id) {
          var confirmDelete = confirm("Do you want to delete " + id + "?")

          if (confirmDelete) {
            favShowsRef.child(key).remove();
            document.getElementById(id).remove();
          }
        }
      }
    })
}

function findAndReplace(string, target, replacement) {
  var i = 0, length = string.length;
  for (i; i < length; i++) {
    string = string.replace(target, replacement);
  }
  return string;
}

function toTitleCase(str){
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

let filterInput = document.getElementById("filterInput");
if (filterInput) {
  filterInput.addEventListener('keyup', filterNames);
}


function filterNames() {
  let filterValue = document.getElementById("filterInput").value.toUpperCase();
  let ul = document.getElementById("showsUl");
  let li = ul.querySelectorAll('li.collection-item');

  for(let i = 0; i < li.length; i++) {
    let a = li[i].getElementsByTagName('a')[0];

    if (a.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
      li[i].style.display = '';
    } else {
      li[i].style.display = 'none';
    }
  }
}
