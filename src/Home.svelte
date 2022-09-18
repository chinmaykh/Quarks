<script>
  import SideArticle from "./SideArticle.svelte";
  import MainArticle from "./MainArticle.svelte";

  import M from "materialize-css";

  let MPP = 3;
  let SPM = 6;

  import { getMyArticles } from "./fetcher.js";

  //   let {main_articles, side_articles} =  getMyArticles();
  let main_articles = [];
  let side_articles = [];
  getMyArticles().then((articles) => {
    main_articles = articles.main_articles;
    side_articles = articles.side_articles;
  });

  function getSideArticles(index) {
    return side_articles.slice(SPM * index, SPM * (index + 1));
  }

  function init_parallax() {
    M.Parallax.init(document.querySelectorAll(".parallax"), {});
  }
</script>

<div id="landing_wrapper">
  <div class="hide-on-med-and-up">
    <h1 class="bodoni-moda">Quarks</h1>
    <h5 class="tagline big-caslon">
      <i> IISc's Undergraduate Media Body </i>
    </h5>
  </div>
  <div style="max-width: 70vw;" class="bodoni-moda hide-on-small-only">
    <h1 class="landing_heading">Quarks</h1>
    <h3 class="tagline big-caslon">
      <i> IISc's Undergraduate Media Body </i>
    </h3>
  </div>
</div>

<div class="grounded_wrapper row">
  <!-- Wrapper for the entire content -->
  <!-- Wrapper for the blogs -->
  <div id="bloglist_wrapper" />
  <!-- Await for main_articles -->
  {#await main_articles}
    <div class="progress">
      <div class="indeterminate" />
    </div>
  {:then}
    {#each main_articles as article, index}
      <!-- Main -->
      <MainArticle {article} /><!-- sidearticles container -->
      <div class="container side_article_wrapper">
        {#each getSideArticles(index) as side_article}
          <SideArticle article={side_article} />
        {/each}
      </div>
      <br /><br />

      {#if index == main_articles.length - 1}
        <div class="container divider" on:load={init_parallax()} />
      {/if}
    {/each}
  {/await}
  <!-- Archives -->
</div>

<style>
  @font-face {
    font-family: "Big Caslon";
    src: url("/public/fonts/Big Caslon/Big\ Caslon\ Medium.ttf");
  }

  .bodoni-moda {
    font-family: "Bodoni Moda", serif;
  }

  .big-caslon {
    font-family: "Big Caslon";
  }

  #landing_wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    /* background-image: url("/public/images/IMG_20190808_182527_264.jpg"); */
    background-size: contain;
    background-repeat: no-repeat;
    background-blend-mode: hue;
    /* scroll-snap-align: start; */
  }

  .side_article_wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 25vw));
    justify-content: space-evenly;
    column-gap: 20px;
    row-gap: 10px;
    border-radius: 20px;
  }

  * {
    outline: 1px solid forestgreen;
    background-color: rgba(34, 139, 34, 0.013);
  }

  .landing_heading {
    font-size: 8rem;
  }

  .container {
    width: 85%;
  }
</style>
