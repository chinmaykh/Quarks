import { Article } from "./Article";

let MPP = 3;
let SPM = 6;

export function getMyArticles() {
  return fetch(
    "https://www.googleapis.com/blogger/v3/blogs/5760681352035308881/posts?" +
      new URLSearchParams({
        fetchImages: "true",
        key: "AIzaSyCHz4IbV1hPghJomm9OPibseRtVrHSo7AI",
        fields: "items(title,author,url,id,images,labels,published)",
      })
  )
    .then((res) => res.json())
    .then((data) => {
      let articles = [];
      data.items.forEach((blogger_article) => {
        // If labels are not provided OR if labels are empty don't return anything
        if (!blogger_article.labels || blogger_article.labels.length < 4) {
          console.warn("No Labels:", blogger_article.title);
          // Skip this article
          return;
        }

        // Now, to construct the article

        // The authorname is that label which has the text "author: "
        let author = blogger_article.labels.find((label) => {
          return label.startsWith("Author: ");
        });

        let tagline =
          blogger_article.labels.find((label) => {
            return label.startsWith("TL: ");
          }) || "";

        if (!author) {
          console.warn("No author label:", blogger_article.title);
          // Skip this article
          return;
        }

        console.log(blogger_article.title);
        articles.push(
          new Article(
            blogger_article.title,
            author.slice(8),
            window.location.href + `#/article?id=${blogger_article.id}`,
            new Date(blogger_article.published),
            blogger_article.labels,
            blogger_article.images != undefined
              ? blogger_article.images[0].url
              : `https://picsum.photos/1500/1000?random=${Math.floor(
                  Math.random() * 10
                )}`
          )
        );
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
      let main_articles = articles.filter((article) => {
        return article.labels != undefined
          ? article.labels.includes("main")
          : false;
      });
      let side_articles = articles.filter((article) => {
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

      let $scope = {
        main_articles: [],
        side_articles: [],
      };

      // Finally pull out the first main articles and side articles
      for (let i = 0; i < MPP; i++) {
        // Find the ith main article by the label called position
        let ma_can = main_articles.find((article) => {
          // TODO: Add default case
          return article.labels.includes(`position:${i + 1}`);
        });

        if (ma_can != undefined) {
          $scope.main_articles.push(ma_can);
        } else {
          $scope.main_articles.push(new Article());
        }

        for (let j = 0; j < SPM; j++) {
          // Find the jth side article by the label called position
          let sa_pos = SPM * i + j;
          let sa_pos_can = side_articles.find((article) => {
            // TODO: Add a default case
            return article.labels.includes(`position:${sa_pos + 1}`);
          });
          if (sa_pos_can != undefined) {
            $scope.side_articles.push(sa_pos_can);
          } else {
            $scope.side_articles.push(new Article());
          }
        }
      }

      // Add all articles into a single array for the search
      $scope.articles = articles;

      return $scope;
    });
}

export function getArticleById(id) {
  return fetch(
    `https://www.googleapis.com/blogger/v3/blogs/5760681352035308881/posts/${id}?` +
      new URLSearchParams({
        key: "AIzaSyCHz4IbV1hPghJomm9OPibseRtVrHSo7AI",
        fetchImages: true,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      let author = data.labels.find((label) => label.startsWith("Author: "));
      let author_description = data.labels.find((label) =>
        label.startsWith("AD: ")
      );
      let tagline = data.labels.find((label) => label.startsWith("TL: ")) || "";

      let $scope = {article:{}};

      $scope.article = new Article(
        data.title,
        author.slice(8),
        window.location.href,
        new Date(data.published),
        data.labels,
        data.images != undefined
          ? data.images[0].url
          : "https://picsum.photos/2000/1000"
      );

      $scope.article.body = data.content;
      $scope.article.author_bio = author_description.slice(4);
      $scope.article.tagline = tagline.slice(3);

      return $scope.article;
    })
    .catch((err) => console.error(err));
}
