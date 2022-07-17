var app = angular.module("quarks", []);

// Article Class
class Article {
  constructor(
    title = chance.sentence({ words: Math.floor(Math.random() * 4)+1}),
    author = chance.name(),
    url = chance.url(),
    published = chance.date(),
    labels = [],
    image = `https://picsum.photos/1500/1000?random={${Math.floor(Math.random() * 10)}}`
  ) {
    this.title = title;
    this.author = author;
    this.url = url;
    this.image = image;
    this.labels = labels;
    this.published = published;
  }
}

app.controller("homeController", [
  "$scope",
  "$http",
  ($scope, $http) => {
    console.log("Quarks Controller Loaded...");

    // Layouting
    $scope.MPP = 3;
    $scope.SPM = 6;
    // Generate 20 Articles Inline
    $scope.articles = [];

    localStorage.setItem("base", window.localStorage.href)

    // GEt Articles From API
    $http({
      method: "GET",
      url: "https://www.googleapis.com/blogger/v3/blogs/5760681352035308881/posts?fetchImages=true",
      params: {
        key: "AIzaSyCHz4IbV1hPghJomm9OPibseRtVrHSo7AI",
        fields: "items(title,author,url,id,images,labels,published)",
        fetchImages: "true",
      },
    }).then(
      (res) => {
        // Here are the articles, make them into Article Objects
        let articles = []

        res.data.items.forEach((blogger_article) => {
          // If labels are not provided OR if labels are empty don't return anything
          if (
            !blogger_article.labels ||
            blogger_article.labels.length < 4
          ) {
            console.warn("No Labels:", blogger_article.title);
            // Skip this article
            return  
          }

          // Now, to construct the article
          
          // The authorname is that label which has the text "author: "
          let author = blogger_article.labels.find(
            (label) => {
              return label.startsWith("Author: ")
            }
          );

          if (!author) {
            console.warn("No author label:", blogger_article.title);
            // Skip this article
            return
          }

          console.log(window.location.href);

          articles.push(new Article(
            (title = blogger_article.title),
            (author = author.slice(8)),
            (url = window.location.href+`/Quarks/article.html?id=${blogger_article.id}`),
            (published = new Date(blogger_article.published)),
            (labels = blogger_article.labels),
            (image =
              blogger_article.images != undefined
                ? blogger_article.images[0].url
                : `https://picsum.photos/1500/1000?random=${Math.floor(Math.random() * 10)}`)
          ));
        });

        console.log("Articles:", articles);

        // For test
        // For generating random articles
        let dummys = [];
        for (let i = 0; i < 20; i++) {
          let words = Math.floor(Math.random() * 5);
          // console.log(words);
          dummys.push(new Article((words = 3)));
        }

        // Now the filtering
        // Filter articles by labels
        main_articles = articles.filter((article) => {
          return article.labels != undefined
            ? article.labels.includes("main")
            : false;
        });
        side_articles = articles.filter((article) => {
          return article.labels != undefined
            ? article.labels.includes("side")
            : false;
        });

        // Sort articles by date
        main_articles.sort((a, b) => {
          return b.published > a.published;
        });
        side_articles.sort((a, b) => {
          return b.published > a.published;
        });

        console.table(main_articles);
        console.table(side_articles);

        // Now the display arrays
        $scope.main_articles = [];
        $scope.side_articles = [];

        // Finally pull out the first main articles and side articles
        for (let i = 0; i < $scope.MPP; i++) {
          // Find the ith main article by the label called position
          ma_can = main_articles.find((article) => {
            // TODO: Add default case
            return article.labels.includes(`position:${i+1}`);
          })

          if (ma_can != undefined) {
            $scope.main_articles.push(ma_can);
          } else {
            $scope.main_articles.push(new Article());
          }

          for (let j = 0; j < $scope.SPM; j++) {
            // Find the jth side article by the label called position
            sa_pos = $scope.SPM * i + j;
            sa_pos_can = side_articles.find((article) => {
              // TODO: Add a default case
              return article.labels.includes(`position:${sa_pos+1}`);
            });
            if (sa_pos_can != undefined) {
              $scope.side_articles.push(sa_pos_can);
            } else{
              $scope.side_articles.push(new Article());
            }

          }
        }

        // Add all articles into a single array for the search
        $scope.articles = articles;
      },
      (err) => {
        alert("Unable to fetch data!");
      }
    );

    $scope.getSideArticles = (index) => {
      let SPM = $scope.SPM;
      return $scope.side_articles.slice(SPM * index, SPM * (index + 1));
    };

    $scope.initiate_parallax = (start) => {
      parallax_elems = document.querySelectorAll(".parallax");
      start ? M.Parallax.init(document.querySelectorAll(".parallax")) : null;
    };

    $scope.nav = (url) => {
      window.location.href = url;
    }
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

    $scope.base = localStorage.getItem("base") || "https://chinmaykh.github.io/Quarks/";

    $http({
      method: "GET",
      url:
        "https://www.googleapis.com/blogger/v3/blogs/5760681352035308881/posts/" +
        id,
      params: {
        key: "AIzaSyCHz4IbV1hPghJomm9OPibseRtVrHSo7AI",
        fetchImages: true,
      },
    }).then(
      (res) => {
        console.table(res.data);
        // Lets work with one article... We shall sanitize and inject the html
        $scope.article = res.data;
        $scope.banner =
          res.data.images != undefined
            ? res.data.images[0].url
            : "https://picsum.photos/2000/1000";
        $scope.article.body = $sce.trustAsHtml($scope.article.content);
        $scope.article.author.bio = res.data.labels.find((label) => {
          return label.startsWith("AD: ");
        }).slice(4)
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
  let opacity = (window.scrollY / window.innerHeight).toFixed(2);
  document.getElementById("toc").style.opacity = opacity;
  document.querySelector("nav").style.opacity = opacity;
};

/**
 * new Article(
              (title = "Default Title"),
              (author = "Default Author"),
              (url = "https://www.google.com"),
              (image = "https://picsum.photos/200/200"),
              (labels = ["side"]),
              (published = new Date())
            );
 */
