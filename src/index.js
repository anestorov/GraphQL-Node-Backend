const { ApolloServer } = require('apollo-server')
const { loadFilesSync } = require('@graphql-tools/load-files')
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge')
const jwt = require('jsonwebtoken')

//const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective('auth', getUser);

const loadedFiles = loadFilesSync(`${__dirname}/schema/**/*.gql`)
const typeDefs = mergeTypeDefs(loadedFiles)
//typeDefs = authDirectiveTransformer(typeDefs);

const resolversArray = loadFilesSync(`${__dirname}/schema/**/*.js`)
const resolvers = mergeResolvers([...resolversArray,AuthResolver()])

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
	mySubscriptionsContext: null,
	typeDefs,
	resolvers,
	subscriptions: {
		onConnect(params) {
			mySubscriptionsContext = prepareAuthContext(params?.Authorization);
		},
		path: '/subscriptions',
	},
	context: ({ req }) => {
		// Note: This example uses the `req` argument to access headers,
		// but the arguments received by `context` vary by integration.
		// This means they vary for Express, Koa, Lambda, etc.
		//
		// To find out the correct arguments for a specific integration,
		// see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields

		// Get the user token from the headers.
		const token = req?.headers?.authorization || ''

		// Try to retrieve a user with the token
		const thisContext = prepareAuthContext(token)

		// Add the user to the context
		if (thisContext) return thisContext;
		else return mySubscriptionsContext;
	},
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`)
})

function prepareAuthContext(token) {
	try {
		if (token) {
			let payload = jwt.verify(token.substr(7), 'THEKEY')
			if (payload) {
				//console.log('USER LOGIN', payload)
				return { user: payload };
			}
		}
	} catch (e) {
		console.log('INVALID TOKEN', token);
		return { user: null };
	}
}

function AuthResolver() {
	return {
		Query: {
			logIn(parent, args, context) {
				if (args.username == 'admin' && args.password == 'admin') {
					return {
						token: jwt.sign(
							/** the user object */
							{ id: 0, name: 'Asparuh Nestorov', email: 'anestorov@gmail.com' },
							/** the KEY must change */
							'THEKEY',
						),
					}
				}
			},
		},
	}
}
