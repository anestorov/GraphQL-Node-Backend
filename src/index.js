const { ApolloServer } = require('apollo-server');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');

const loadedFiles = loadFilesSync(`${__dirname}/schema/**/*.gql`);
const typeDefs = mergeTypeDefs(loadedFiles);


const resolversArray = loadFilesSync(`${__dirname}/schema/**/*.js`);
const resolvers = mergeResolvers(resolversArray);


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
