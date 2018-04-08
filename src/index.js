import express from 'express'
// import path from 'path'
import hbs from 'hbs'
var app = express()

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// app.use(express.static(__dirname + '/public'));

var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/404', (req, res, next) => {
    // trigger a 404 since no other middleware
    // will match /404 after this one, and we're not
    // responding here
    next()
})

app.get('/403', (req, res, next) => {
    // trigger a 403 error
    var err = new Error('not allowed!')
    err.status = 403
    next(err)
})

app.get('/500', (req, res, next) => {
    // trigger a generic (500) error
    next(new Error('keyboard cat!'))
})

app.use((req, res) => {
    res.status(404)

    res.format({
        html:  () => {
            res.render('404', {
                url: req.url
            })
        },
        json: () => {
            res.json({
                error: 'Not found'
            })
        },
        default: () => {
            res.type('txt').send('Not found')
        }
    })
})


app.use((err, req, res) => {
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || 500)
    res.render('500', {
        error: err
    })
})

app.listen(8035)