module.exports = {
  Query: {
    listBooks(parent, args, context) {
      return [
        { title: 'MyLife', author: 'Asparuh', posts: () => require("../Post/Post").Query.listPosts() },
        { title: 'HerLife', author: 'Didi', posts: () => require("../Post/Post").Query.listPosts()},
      ]
    },
    getBook(parent, args, context) {
      return { title: 'MyLife', author: 'Asparuh', posts: () => require("../Post/Post").Query.listPosts() }
    },
  },
}
