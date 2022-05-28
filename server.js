require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({'extended': 'false' }));
const validUrl = require('valid-url');
const URLShortener = require('node-url-shorten');
const mongodb = "mongodb+srv://UserTest:U3ert3st01@cluster0.jbqmr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const errorCallback = (err) => {
   console.log(err);
}

const options = {
      characters: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      minHashCount: 4,
      domain: "."
}


const shortUrl = new URLShortener(mongodb, errorCallback, options);
//const shorter = require('shorterurl');
/*
(async () => {
  await shorter.purge(Date.now());
  console.log("all data is deleted");
})();
*/
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
/*
app.get('/api/shorturl/:shortUrl', (req, res) => {
  
  const shortUrl = req.params.shortUrl;
  console.log(shortUrl);
  (
    async() => {
      const xurl = await shorter.getOriginal(shortUrl);
      console.log(xurl);
      res.redirect(xurl);
    }
  )();
})

app.post('/api/shorturl', (req , res ) => {
  
  let xurl  = req.body.url;
  console.log(xurl);
  if ( validUrl.isWebUri(xurl) ) {
    (async() => {
      const short = await shorter.getShortUrl(xurl);
      console.log(short);
      res.json ( {
        'original_url' : xurl,
        'short_url' : short
      });
    })();
    
  }else {
    res.json( { 'error' : 'invalid url' } );
  }
  
})
*/
app.get('/api/shorturl/:shortUrl', (req, res) => { 
  const xUrl = req.params.shortUrl;
  console.log(xUrl);
    shortUrl.retrieve(xUrl)
     .then(orgUrl => {
       console.log(orgUrl);
       res.redirect(orgUrl.URL);
      })
     .catch(err => console.log(err));
})


app.post('/api/shorturl', (req , res ) => {
  
  let xurl  = req.body.url;
  console.log(xurl);
  if ( validUrl.isWebUri(xurl) ) {
      shortUrl.shortenUrl(xurl, new Date('2022-03-20'))
      .then(xres => {
        console.log('res' , xres);
        const short = xres.url.split('/');
        console.log(short);
        res.json ( {
          'original_url' : xurl,
          'short_url' : short[1]
        });
      })
      .catch(err => console.log(err));  
  }else {
    res.json( { 'error' : 'invalid url' } );
  }
  
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
