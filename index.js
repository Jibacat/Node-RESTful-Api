const express = require('express');
const Joi = require('joi');
const app = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

//  middleware
app.use(express.json());

const courses = [
    {name: 'w', id: 1},
    {name: 'c', id: 2},
    {name: 'q', id: 3}
]

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/api/courses', (req, res) => {
    res.send(courses)
})

app.post('/api/course', (req, res) => {
    const schema = {
        name: Joi.string().min(3).required()
    }

    const result = Joi.validate(req.body, schema);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(courses)
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(item => item.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course is not found');

    const schema = {
        name: Joi.string().min(3).required()
    }

    const result = Joi.validate(req.body, schema);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);

});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`listening at port ${port}..`)
})