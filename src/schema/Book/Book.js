module.exports = {
  Query: {
    listBooks(parent, args, context) {
      if(context.user == null) throw new Error("Unknown user!");
      return [
        { title: 'MyLife', author: 'Asparuh', posts: () => require("../Post/Post").Query.listPosts() },
        { title: 'HerLife', author: 'Didi', posts: () => require("../Post/Post").Query.listPosts()},
      ]
    },
    getBook(parent, args, context) {
      if(context.user == null) throw new Error("Unknown user!");
      return { title: 'MyLife', author: 'Asparuh', posts: () => require("../Post/Post").Query.listPosts() }
    },
  },
}
