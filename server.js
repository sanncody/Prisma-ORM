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
    const { name, email, bio } = req.body;

    const user = await prisma.user.create({
        data: {
            name,
            email,
            profile: {
                create: {
                    bio
                }
            }
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
            authorId: 6
        }
    });

    return res.status(201).json(post);
});

app.get('/api/posts/fetch', async (req, res) => {
    const { skip, take } = req.query;

    const posts = await prisma.post.findMany({
        include: {
            author: true
        },
        skip: JSON.parse(skip),
        take: JSON.parse(take)
    });

    return res.status(200).json(posts);
});

app.get('/api/users/fetch', async (req, res) => {
    const users = await prisma.user.findMany({
        include: {
            posts: true,
            profile: true
        }
    });

    return res.status(200).json(users);
});

app.get('/api/profiles/fetch', async (req, res) => {
    const profiles = await prisma.profile.findMany({
        include: {
            user: true
        }
    });

    return res.status(200).json(profiles);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});