const { ApolloServer, gql } = require('apollo-server');
const { PubSub } = require('apollo-server');
const pubsub = new PubSub();

const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const { print } = require('graphql');
const fs = require('fs');

const loadedFiles = loadFilesSync(`${__dirname}/schema/**/*.gql`);
const typeDefs = mergeTypeDefs(loadedFiles);
//const printedTypeDefs = print(typeDefs);
//fs.writeFileSync('joined.graphql', printedTypeDefs);


const resolvers = { 
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

    // ...other resolvers...
};


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs, resolvers, subscriptions: {
        path: '/subscriptions'
    },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

setInterval(() => {
    
}, 10000)
