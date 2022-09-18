import { chance } from "./Article";

/**
 * Comment
 */
export class Comment {
  /**
   *
   * @param {{}} user The logged-in user
   * @param {String} body The comment body text
   * @param {Date} date The date of upload
   * @param {String} id The article's id
   * @returns The comment object
   */
  constructor(
    user = { name: chance.name(), email: chance.email() },
    body = chance.paragraph({ sentences: 2 }),
    date = chance.date(),
    id = chance.integer()
  ) {
    this.user = user;
    this.body = body;
    this.date = date;
    this.article = id;
    return this;
  }
}

/**
 * Convert comments for firebase transactions
 */
export const commentConverter = {
  toFirestore: (comment) => {
    return {
      user: comment.user,
      body: comment.body,
      date: comment.date,
      article: comment.article,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Comment(data.user, data.body, data.date, data.article);
  },
};
