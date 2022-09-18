<script>
  import { Article } from "./Article.js";

  export let article = new Article();
  let sa = article;

  function nav() {
    console.log(sa.url);
    window.location.href = sa.url;
  }
</script>

<!-- side article -->
<div
  class="side_article card wanna_read scroll_stop z-depth-2"
  ng-repeat="sa in getSideArticles($index) track by $index"
  href={sa.url}
  on:click={nav}
>
  <div class="card-image">
    <!-- src="https://picsum.photos/200/150?random={{$parent.$index*SPM + $index}}" -->
    <img src={sa.image} alt="Image for {sa.title}" width="200" height="200" />
  </div>
  <div class="card-content">
    <span class="card-title sa_heading">
      <b>{sa.title}</b>
    </span>
  </div>
  <div class="card-action truncate sa_deets">
    <b>By </b>
    {sa.author}
    <a href="/#" class="tools"><i class="material-icons right">bookmark</i></a>
    <a href="/#" class="tools"
      ><i class="material-icons right">chat_bubble_outline</i></a
    >
  </div>
</div>



<style>
</style>
