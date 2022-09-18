<script>
  import Footer from "./Footer.svelte";
  import Navbar from "./Navbar.svelte";

  import Home from "./Home.svelte";
  import Article from "./Article.svelte";

  import Router, { location, link } from "svelte-spa-router";

  let routes = {
    "/": Home,
    "/article": Article,
  };

  export let name;
</script>

<svelte:head>
  <title>{name}</title>
  <!-- Import MaterializeCSS -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
  />
  <!-- Import icons -->
  <link
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
    rel="stylesheet"
  />
</svelte:head>
<main>
  <!-- Fixed navbar -->
  <Navbar />
  <Router {routes} />
  <Footer />
</main>
