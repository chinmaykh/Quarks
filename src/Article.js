import {Chance} from "chance";
export var chance = Chance();

export class Article {
  constructor(
    title = chance.sentence({ words: Math.floor(Math.random() * 4)+1}),
    author = chance.name(),
    url = chance.url(),
    published = chance.date(),
    labels = [],
    image = `https://picsum.photos/1500/1000?random=${Math.floor(Math.random() * 10)}`
  ) {
    this.title = title;
    this.author = author;
    this.url = url;
    this.image = image;
    this.labels = labels;
    this.published = published;
  }
}