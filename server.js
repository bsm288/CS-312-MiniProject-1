const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

let posts = []
let nextId = 1

app.get('/', (req, res) => {
  res.render('index', { posts })
}
)

app.post('/posts', (req, res) => {
  const { author, title, content } = req.body
  const post = {
    id: nextId++,
    author,
    title,
    content,
    createdAt: new Date().toLocaleString()
  }
  posts.unshift(post)
  res.redirect('/')
}
)

app.get('/posts/:id/edit', (req, res) => {
  const id = Number(req.params.id)
  const post = posts.find(p => p.id === id)
  if (!post) return res.redirect('/')
  res.render('edit', { post })
}
)

app.post('/posts/:id/update', (req, res) => {
  const id = Number(req.params.id)
  const i = posts.findIndex(p => p.id === id)
  if (i === -1) return res.redirect('/')
  const { author, title, content } = req.body
  posts[i] = { ...posts[i], author, title, content, updatedAt: new Date().toLocaleString() }
  res.redirect('/')
}
)

app.post('/posts/:id/delete', (req, res) => {
  const id = Number(req.params.id)
  posts = posts.filter(p => p.id !== id)
  res.redirect('/')
}
)

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
}
)
