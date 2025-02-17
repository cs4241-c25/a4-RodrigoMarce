const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const { ObjectId } = require('mongodb');
const app = express();
const path = require('path');

//app.use(express.static('public'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

app.use(session({ secret: 'scratch', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const GITHUB_CLIENT_ID = 'Ov23li8pH6qlaah3V8F1';
const GITHUB_CLIENT_SECRET = '45e11bf4c746b48b48188a2c0aae19b75719d572';

passport.serializeUser((user, done) => {
    done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await users.findOne({ _id: new ObjectId(id) });
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// make the authentication the first page of the website
// authentication
passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: 'https://a4-rodrigomarce.onrender.com/auth/github/callback'
    },
    async function(accessToken, refreshToken, profile, done) {
        try {
            const user = await users.findOneAndUpdate(
                { githubId: profile.id },
                {
                    $set: {
                        githubId: profile.id,
                        username: profile.username,
                    }
                },
                { upsert: true, new: true }
            );
            return done(null, user);
        } catch (error) {
            console.error('Error in GitHub strategy:', error);
            return done(error);
        }
    }));


// Database connection
const url = "mongodb+srv://rmarcenaropalacios:dZFIT6B2T3pPPjev@cs4241.cdrau.mongodb.net/?retryWrites=true&w=majority&appName=cs4241"
const dbconnect = new MongoClient(url);
let tasks = null;
let users = null;

// main
async function run() {
    await dbconnect.connect().then(() => console.log("Connected!"));
    tasks = await dbconnect.db("a3").collection("tasks");
    users = await dbconnect.db("a3").collection("users");

    app.get('/auth/github',
        passport.authenticate('github', { scope: [ 'user:email' ] }));

    app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    app.get('/tasks', ensureAuthenticated, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const results = await tasks.find({ userId: req.user._id }).toArray();
            res.json(results);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.post('/tasks', ensureAuthenticated, async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const newTask = {
                taskname: req.body.taskname,
                duedate: req.body.duedate,
                priority: req.body.priority,
                description: req.body.description,
                userId: req.user._id
            };
            const result = await tasks.insertOne(newTask);
            res.status(201).json({ ...newTask, _id: result.insertedId });
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.delete('/tasks/:id', ensureAuthenticated, async (req, res) => {
        try {
            const result = await tasks.deleteOne({
                _id: new ObjectId(req.params.id),
                userId: req.user._id
            });
            if (result.deletedCount === 0) {
                return res.status(404).json({message: 'Task not found or unauthorized'});
            }
            res.json({ message: 'Task deleted' });
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    });

    app.get('/auth/status', (req, res) => {
        res.json({ authenticated: req.isAuthenticated() });
    });

    app.get('/api/user', (req, res) => {
        if (req.isAuthenticated()) {
            res.json({ username: req.user.username });
        }
    });

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/github');
}

const PORT = process.env.PORT || 3000;

run().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('Failed to start the server:', err);
});

