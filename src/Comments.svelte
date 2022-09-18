<script>
  export let id = 0;
  import M from "materialize-css";

  // Components
  import Loader from "./Loader.svelte";

  // Initialize firebase
  import { auth, microsoftProvider, db } from "./firebase";
  import { signInWithPopup, OAuthProvider } from "firebase/auth";
  import {
    doc,
    addDoc,
    collection,
    onSnapshot,
    query,
    where,
  } from "firebase/firestore";

  // Comment Class
  import { Comment, commentConverter } from "./Comment";

  // To display
  let comments = [];
  const q = query(collection(db, "Comments"), where("article", "==", id));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    let comments_batch = [];
    querySnapshot.forEach((doc) => {
      comments_batch.push(doc.data());
    });
    comments = comments_batch.map(
      (comment) =>
        new Comment(
          comment.user,
          comment.body,
          new Date(comment.date.seconds * 1000),
          comment.article
        )
    ).sort((a, b) => a.date - b.date);
    console.log(comments);
  });

  // New guy
  let newComment = new Comment({},"", new Date(), id);

  /**
   * Sign in with Microsoft
   */
  async function signin() {
    // Login using firebase auth
    console.log("Signing in using firebase 🔥");
    return signInWithPopup(auth, microsoftProvider)
      .then((result) => {
        // User is signed in.
        // IdP data available in result.additionalUserInfo.profile.

        console.log("User signed in");
        console.table(result.user.displayName, result.user.email);

        let user = {
          name: result.user.displayName,
          email: result.user.email,
        };
        localStorage.setItem("user", JSON.stringify(user));
        M.toast({ html: "Signed in successfully" });
        return user;

        // Get the OAuth access token and ID Token
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
      })
      .catch((error) => {
        // Handle error.
        console.error("Caught error while signing in", error);
      });
  }

  /**
   * Add a comment to the database
   */
  async function addComment() {
    let user = !localStorage.getItem("user")
      ? await signin()
      : JSON.parse(localStorage.getItem("user"));

    // Add comment to firebase
    console.log("Adding comment to firebase 🔥");

    console.log("User", user);
    let comment = new Comment(user, newComment.body, new Date(), id);

    // TODO: Add comment to firebase
    console.log(
      await addDoc(
        collection(db, "Comments"),
        commentConverter.toFirestore(comment)
      )
    );

    // Clear the comment
    newComment = new Comment({},"", new Date(), id);
  }

  /**
   * Helper Fn.
   * @param text
   */
  function formattedDate(text) {
    let date = new Date(text);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  }
</script>

<h4>Comments</h4>
<ul class="collection">
  <li class="collection-item row">
    <form on:submit|preventDefault={addComment}>
      <div class="input-field col s10">
        <i class="material-icons prefix">comments</i>
        <textarea
          id="comment"
          class="materialize-textarea"
          bind:value={newComment.body}
        />
        <label for="comment">Comment</label>
      </div>
      <div class="input-field col s2">
        <button class="btn waves-effect waves-light">Submit</button>
      </div>
    </form>
  </li>

  <!-- Comments synced with firestore -->
  {#each comments as comment}
    <li class="collection-item row">
      <div class="col s12 l3 m3 center">
        <a href="mailto:{comment.user.email}">
          <b>{comment.user.name}</b>
        </a>
        <p>{formattedDate(comment.date)}</p>
      </div>
      <div class="col s12 l9 m9">
        <p>{comment.body}</p>
      </div>
    </li>
  {/each}
</ul>
