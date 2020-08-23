const logoutLink = document.querySelector('.logout');
const loginLinks = document.querySelectorAll('.login');

const display = (user) => {
  if (user) {
    logoutLink.style.display = "block";
    loginLinks.forEach(link => {
      link.style.display = "none"
    })
  } else {
    logoutLink.style.display = "none";
    loginLinks.forEach(link => {
      link.style.display = "block"
    })
  }
}

//signup
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const signupEmail = document.querySelector('#signup-email').value;
  const signupPassword = document.querySelector('#signup-password').value;

  auth
    .createUserWithEmailAndPassword(signupEmail, signupPassword)
    .then(userCredential => {
      //clear the form
      signupForm.reset();

      //close the modal
      $('#signupModal').modal('hide');

    })
});


//signin
const signinForm = document.querySelector('#signin-form');

signinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.querySelector('#signin-email').value;
  const password = document.querySelector('#signin-password').value;

  auth.signInWithEmailAndPassword(email, password)

    .then(
      userCredential => {
        //clear the form
        signinForm.reset();

        //close the form
        $('#signinModal').modal('hide');

        console.log(userCredential)
      })

    .catch(error => {
      console.log(error.message, error.code)
    });

});


//google signin
const googleSignin = document.querySelector('#googleSignin');

googleSignin.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(result => {
      const token = result.credential.accessToken;
      const user = result.user;
      console.log(token, user)
      //close modal
      $('#signinModal').modal('hide');

    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;

      console.log(errorCode, errorMessage, email, credential);
    });

});

//facebook signin
const facebookSignin = document.querySelector('#facebookSignin');

facebookSignin.addEventListener('click', e => {
  e.preventDefault();
  const provider = new firebase.auth.FacebookAuthProvider();

  auth.signInWithPopup(provider)
    .then(result => {
      const token = result.credential.accessToken;
      const user = result.user;
      console.log(token, user);
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;

      const email = error.email;
      const credential = error.credential;

      console.log(error.code, error.message, error.email, error.credential);
    })

  //close modal
  $('#signinModal').modal('hide')
});

//logout
const logout = document.querySelector('#logout');

logout.addEventListener('click', e => {
  e.preventDefault();
  auth.signOut()
    .then(() => {
      console.log('logout');
    })
});

//posts
const postList = document.querySelector('.posts');

//receives a firestore snapshot.docs, unpack, li, innerHTML
const setupPost = docs => {
  if (docs.length) {
    let html = '';
    docs.forEach(doc => {
      const post = doc.data();
      const li = `
      <li class="list-group-item list-group-item-action">
        <h3>${post.title}</h3>
        <p>${post.description}</p>
      </li>`;
      html = html + li;
    });
    postList.innerHTML = html;
  } else {
    postList.innerHTML = '<p class="text-center">There is no post.</p>';
  }
}


//events
//list for auth state changes

auth.onAuthStateChanged(user => {
  if (user) {
    firestore.collection('posts').get()
      .then(snapshot => {
        setupPost(snapshot.docs);
        display(user);
      })

  } else {
    postList.innerHTML = '<p class="text-center">Login to see the posts.</p>';
    display(user);
  }
})


