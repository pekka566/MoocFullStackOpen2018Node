const tokenExtractor = (request, response, next) => {
  // kaivelee tokenin headerista ja asettaa requestiin...
  const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		request.token = authorization.substring(7)
	}
	next()
}

module.exports = tokenExtractor