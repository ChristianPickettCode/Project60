
var ref = firebase.database().ref('cartoons');
var watchedCartoonsRef = ref.child('list-of-watched-cartoons');

var currentUser = {}

function signInWithGoogle() {
  // Sign in with Google
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  return firebase.auth().signInWithPopup(provider)
    .catch(function(error) {
      console.log('Google sign in error', error);
    });

};

function signInAnonymous() {
  // Sign in Anonymously
  firebase.auth().signInAnonymously()
    .catch(function(error) {
      console.log('Google sign in error', error);
    });
}

// Listen to auth state changes
firebase.auth().onAuthStateChanged(function(user) {

  currentUser = user;

  // login in
  if (user) {

    var UserRef = firebase.database().ref('users');
    UserRef.once("value")
      .then(function(snap) {
        var hasUser = snap.hasChild(currentUser.uid);

        //alert(hasUser)

        if (!hasUser) {
          var currentUserRef = firebase.database().ref('users/' + currentUser.uid);
          currentUserRef.set({
            displayName: currentUser.displayName,
            email: currentUser.email,
          });
        }

      });



    window.location.href = "/home"
  }


  console.log('user', currentUser);
});
