const { PubSub, withFilter } = require('apollo-server')
const pubsub = new PubSub()

module.exports = {
	Query: {
		listPosts(parent, args, context) {
			if (context.user == null) throw new Error('Unknown user!')
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
			if (context.user == null) throw new Error('Unknown user!')
			return {
				comment: 'HerLife',
				author: 'Didi',
				book: require('../Book/Book').Query.getBook(),
			}
		},
	},

	Mutation: {
		makePost(parent, args, context) {
			if (context.user == null) throw new Error('Unknown user!')
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
			subscribe: withFilter(
				() => pubsub.asyncIterator(['POST_CREATED']),
				(payload, variables, context) => {
					// Only push an update if the comment is on
					// the correct repository for this operation
					return context?.user?.id == 0
				},
			),
		},
	},
}
