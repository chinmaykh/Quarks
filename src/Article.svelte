<script>
  import { Article } from "./Article";
  import Comments from "./Comments.svelte";
  import { getArticleById } from "./fetcher";
  import Loader from "./Loader.svelte";

  let id = window.location.href.split("?")[1].split("=")[1];
  console.log(id);

  let article = new Promise((resolve, reject) => {
    getArticleById(id).then((data) => {
      resolve(data);
    });
  });
</script>

{#await article}
<Loader></Loader>
{:then article}
  <div class="section" style="padding: 0px;">
    <img src={article.image} alt="Banner" style="width: 100vw; height: 300px" />
  </div>

  <div class="container">
    <div class="section article-heading">
      <h1>{article.title}</h1>
      <!-- Author Name and Dates -->
      <div class="row">
        <div class="col s12">
          <h5>
            Author: {article.author} &middot; Published: {article.published}
          </h5>
        </div>
      </div>
    </div>
    <div class="section article-body flow-text">
      {@html article.body}
      <!-- <div class="flow-text" bind:innerHTML="{article.body}">
        </div> -->
    </div>

    <div class="divider black" />

    <div class="section">
      <div class="row">
        <div class="col s6">
          <h5>{article.author}</h5>
          <p class="flow-text">
            {article.author_bio}
          </p>
        </div>
        <div class="col s6">
          <h5>Something on the same hierarchy as my name</h5>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <Comments id={id}></Comments>
  </div>
  <style>
    img[title="Title"] {
      display: none;
    }
  </style>

{/await}
