const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

module.exports = {
  Query: {
    listPosts(parent, args, context) {
      return [
        {
          comment: 'MyLife',
          author: 'Asparuh',
          book: () => require('../Book/Book').Query.getBook(),
        },
        {
          comment: 'HerLife',
          author: 'Didi',
          book: () => require('../Book/Book').Query.getBook(),
        },
      ]
    },
    getPost() {
      return {
        comment: 'HerLife',
        author: 'Didi',
        book: require('../Book/Book').Query.getBook(),
      }
    },
  },

  Mutation: {
    makePost(parent, args, context) {
      pubsub.publish('POST_CREATED', {
        postCreated: {
          author: args?.author,
          comment: args?.comment,
        },
      })
    },
  },
  Subscription: {
    postCreated: {
      // More on pubsub below
      subscribe: () => pubsub.asyncIterator(['POST_CREATED']),
    },
  },
}
