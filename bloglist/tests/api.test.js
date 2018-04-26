const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const apiUrl = '/api/blogs'
const { blogsInDb, initialBlogs } = require('../utils/test_helpers')
const Blog = require('../models/blog')

test('Api test - blogs are returned as json', async () => {
  await api
    .get(apiUrl)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('Api test - get blogs.', async () => {
  const response = await api
    .get(apiUrl)

  expect(response.body.length).toBe(initialBlogs.length)
})

test('Api test - get blogs, test first blog title.', async () => {
  const response = await api
    .get(apiUrl)

  expect(response.body[0].__v).toBe(0)
})

test('Api test - a valid blog can be added ', async () => {
  const newBlog = {
    title: 'TEST title',
    author: 'Edsger W. Testaaja',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 57889908
  }

  await api
    .post(apiUrl)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get(apiUrl)

  const titles = response.body.map(r => r.title)
  expect(response.body.length).toBe(initialBlogs.length + 1)
  expect(titles).toContain('TEST title')
})

test('Api test - likes set to zero if not given', async () => {
  const newBlog = {
    title: 'TESTing titkle',
    author: 'Edsger W. Manaaja',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
  }

  const response = await api
    .post(apiUrl)
    .send(newBlog)

  console.log(response.body);

  expect(response.body.likes).toBe(0)
})

describe('Api test - deletion of a blog', async () => {
  let addedBlog

  beforeAll(async () => {
    addedBlog = new Blog( {
      title: 'TESTing titkkkkkkkkkkkkkle',
      author: 'Edsger W. Manaaja',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
    })
    await addedBlog.save()
  })

  test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
    const blogsAtStart = await blogsInDb()

    await api
      .delete(`/api/blogs/${addedBlog._id}`)
      .expect(204)

    const blogsAfterOperation = await blogsInDb()

    const titles = blogsAfterOperation.map(r => r.title)

    expect(titles).not.toContain(addedBlog.title)
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
  })
})

beforeAll(async () => {
  await Blog.remove({})

  const blogObjects = initialBlogs.map(n => new Blog(n))
  await Promise.all(blogObjects.map(n => n.save()))
})

afterAll(() => {
  server.close()
})
