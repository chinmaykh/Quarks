var app = angular.module("quarks", []);

// Article Class
class Article {
  constructor(title, author = chance.name(), url = chance.url(), words = 3) {
    if (!title) this.title = chance.sentence({ words });
    this.title = chance.sentence({ words: words });
    this.author = author;
    this.url = url;
  }
}

app.controller("homeController", [
  "$scope",
  "$http",
  ($scope, $http) => {
    console.log("Quarks Controller Loaded...");

    // Generate 20 Articles Inline
    $scope.articles = [];
    for (let i = 0; i < 20; i++) {
      let words = Math.floor(Math.random()*5);
      console.log(words);
      $scope.articles.push(new Article(words = 3));
    }

    $scope.main_articles = $scope.articles.slice(0, 3);
    $scope.side_articles = $scope.articles.slice(4, 16);

    $http({
      method: "GET",
      url: "https://www.googleapis.com/blogger/v3/blogs/6405308807706472057/posts",
      params: {
        key: "AIzaSyCHz4IbV1hPghJomm9OPibseRtVrHSo7AI",
        fields:"items(title,author,url,id)",
      },
    }).then(
      (res) => {
        // $scope.articles = res.data.items.map((blogger_article) => {
        //   console.table(blogger_article);
        //   return new Article(
        //     title= blogger_article.title,
        //     author= blogger_article.author.displayName,
        //     url= `/article.html?id=${blogger_article.id}`,
        //   )
        // });
        console.log($scope.articles);
        
        // Layouting
        $scope.SPM = 6;
        
        // Initiate JS controlled CSS after entire page loads

        var parallax_elems = document.querySelectorAll('.parallax');
        var parallax_instances = M.Parallax.init(parallax_elems, {});

        var scrollspy_elems = document.querySelectorAll('.scrollspy');
        var scrollspy_instances = M.ScrollSpy.init(scrollspy_elems, {});


      },
      (err) => {
        alert("Unable to fetch data!");
      }
    );

    $scope.getSideArticles = (index) => {
      let SPM = $scope.SPM;
      return $scope.side_articles.slice(SPM * index, SPM * (index + 1));
    };
  },
]);

app.controller("articleController", [
  "$scope",
  "$http",
  "$sce",
  ($scope, $http, $sce) => {
    console.log("Article Controller Loaded...");

    // Get Article ID from URL
    let id = window.location.href.split("?")[1].split("=")[1];
    console.log(id);

    $http({
      method: "GET",
      url: "https://www.googleapis.com/blogger/v3/blogs/6405308807706472057/posts/" + id,
      params: {
        key: "AIzaSyCHz4IbV1hPghJomm9OPibseRtVrHSo7AI",
      },
    }).then(
      (res) => {
        console.table(res.data);
        // Lets work with one article... We shall sanitize and inject the html
        $scope.article = res.data;
        $scope.article.body = $sce.trustAsHtml($scope.article.content);
      },
      (err) => {
        console.log("%j", err.data);
      }
    );
  },
]);

// What CSS cannot do

// Make navbar visible after scrolling only
window.onscroll = () => {
  // Make opacity propotional to scroll position
  let opacity = (window.scrollY/ window.innerHeight).toFixed(2);
  document.getElementById("toc").style.opacity = opacity;
  document.querySelector("nav").style.opacity = opacity;
};
