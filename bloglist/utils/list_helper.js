const dummy = (blogs) => {
  return 1
}

const totalLikes = (array) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return array.length === 0 ? 0 : array.reduce(reducer, 0)
}

function compare(a, b) {
 return b.likes - a.likes
}

const favoriteBlog = (array) => {
  return array.sort(compare)[0]
}

const mostBlogs = (array) => {
  const bloggers = array.map( x => x.author)
  const blogCount = new Map()
  bloggers.forEach((element, index) => {
    if(blogCount.has(element)){
      blogCount.set(element, blogCount.get(element) + 1)
    } else {
      blogCount.set(element, 1)
    }
  })

  const sortedArray = Array
    .from(blogCount)
    .sort((a, b) => {
      return b[1] - a[1];
    })

  return {
      author: sortedArray[0][0],
      blogs: sortedArray[0][1]
    }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs
}