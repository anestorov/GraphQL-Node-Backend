const { PubSub } = require('apollo-server');
const pubsub = new PubSub();

module.exports = {
    Query: {
        books(parent, args, context) {
            return [{ title: "MyLife", author: "Asparuh" }, { title: "HerLife", author: "Didi" }]
        }
    },
    Mutation: {
        makePost(parent, args, context) {
            pubsub.publish('POST_CREATED', {
                postCreated: {
                    author: args?.author,
                    comment: args?.comment
                }
            });
        }
    },
    Subscription: {
        postCreated: {
            // More on pubsub below
            subscribe: () => pubsub.asyncIterator(['POST_CREATED']),
        },
    },
}