import express from 'express';
import prisma from './src/config/db.js';

const app = express();

app.use(express.json());

app.get('/test', (req, res) => {
    res.json({
        message: "Checking the testing route"
    });
});

app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;

    const user = await prisma.user.create({
        data: {
            name,
            email
        }
    });

    return res.status(201).json(user);
});

app.post('/api/posts', async (req, res) => {
    const { title, content } = req.body;
    
    const post = await prisma.post.create({
        data: {
            title,
            content,
            authorId: 5
        }
    });

    return res.status(201).json(post);
});

app.get('/api/posts/fetch', async (req, res) => {
    const posts = await prisma.post.findMany({
        include: {
            author: true
        }
    });

    return res.status(200).json(posts);
});

app.get('/api/users/fetch', async (req, res) => {
    const users = await prisma.user.findMany({
        include: {
            posts: true
        }
    });

    return res.status(200).json(users);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});