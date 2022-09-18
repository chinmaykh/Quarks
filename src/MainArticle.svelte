<script>
  import { Article } from "./Article.js";
  export let article = new Article();
  let ma = article;
</script>

<a
  href={ma.url}
  class="main_article wanna_read black-text scroll_stop"
  id={ma.title}
>
  <!-- Image Goes Here -->
  <div class="parallax-container scroll_stop">
    <div class="parallax">
      <img src={ma.image} alt="Image related to {ma.title}" />
    </div>
  </div>

  <div class="ma_deets_container">
    <div class="card-panel" style="border-radius: 10px;">
      <!-- <span ng-repeat="(key, value) in ma">{{key}} - {{value}} <br> </span> -->
      <h4 ng-class="ma_title">
        {ma.title}
      </h4>
      <!-- Tagline -->
      <div class="center" ng-if="ma.tagline">
        <i
          >"...And there he saw in the clearing, a site to be beheld only
          once..."</i
        >
        <br /><br />
      </div>
      <div ng-class="ma_deets">
        <b>By</b>
        {ma.author}
        <i class="material-icons right">chat_bubble_outline</i>
        <i class="material-icons right">bookmark</i>
      </div>
    </div>
  </div>
</a>

<style>
  
</style>