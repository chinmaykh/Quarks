var app = angular.module("quarks", []);

// Article Class
class Article {
  constructor(title, author, url, col_width) {
    this.title = title;
    this.author = author;
    this.url = url;
    this.col_width = col_width;
  }
}

app.controller("homeController", [
  "$scope",
  "$http",
  ($scope, $http) => {
    console.log("Quarks Controller Loaded...");

    $scope.articles = [
      new Article(
        "The Evolution of JavaScript",
        "John Resig",
        "http://ejohn.org/blog/the-evolution-of-javascript/",
        6
      ),
      new Article(
        "A Beginner's Guide to ES6",
        "John Resig",
        "https://johnresig.com/blog/es6-in-depth/",
        6
      ),
      new Article(
        "JavaScript Performance",
        "John Resig",
        "http://ejohn.org/blog/javascript-performance/",
        6
      ),
      new Article(
        "Why We Don't Use 'new'",
        "John Resig",
        "http://ejohn.org/blog/why-we-dont-use-new-for-javascript/",
        6
      ),
      new Article(
        "The Rise of ES6",
        "John Resig",
        "http://ejohn.org/blog/the-rise-of-es6-part-1/",
        6
      ),
      new Article(
        "The Rise of ES6",
        "John Resig",
        "http://ejohn.org/blog/the-rise-of-es6-part-2/",
        6
      ),
      new Article(
        "The Rise of ES6",
        "John Resig",
        "http://ejohn.org/blog/the-rise-of-es6-part-3/",
        6
      ),
    ];
  },
]);

app.controller("articleController", [
  "$scope",
  "$http",
  "$sce",
  ($scope, $http, $sce) => {
    console.log("Article Controller Loaded...");

    $http({
      method: "GET",
      url: "https://www.googleapis.com/blogger/v3/blogs/6405308807706472057/posts",
      params: {
        key: "AIzaSyCHz4IbV1hPghJomm9OPibseRtVrHSo7AI",
      },
    }).then(
      (res) => {
        console.table(res.data.items);
        // Lets work with one article... We shall sanitize and inject the html
        $scope.article = res.data.items[1];
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
window.onscroll = ()=>{
  // Make opacity propotional to scroll position
  let opacity = (window.scrollY / window.innerHeight).toFixed(2);
  document.querySelector("nav").style.opacity = opacity;  
}