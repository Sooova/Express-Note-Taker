const express = require('express');
const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// const api_routes = require('./routes/api_routes')

//send public index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
  console.info(`${req.method} requiest received to get index.html`);
})

//send notes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
  console.info(`${req.method} requiest received to get notes`);
})

// for some reason could not get * to work
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/public/index.html'))
//   console.info(`${req.method} unknown path, taken back to index.`);
// })

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, jsonData) => {
    if (err) {
      throw err;
    }
    storedData = JSON.parse(jsonData);
    res.send(storedData);
  })
})

app.post('/api/notes', (req, res) => {
  const inputNotes = req.body;
  fs.readFile('./db/db.json', (err, jsonData) => {
    if (err) {
      throw err;
    }
    storedData = JSON.parse(jsonData);
    storedData.push(inputNotes);
    var idNumber
    storedData.forEach((input) => {
      idNumber = uuidv4();
      input.id = idNumber;
      return storedData;
    });
    console.log(storedData);
    jsonString = JSON.stringify(storedData);

    fs.writeFile('./db/db.json', jsonString, (err, data) => {
      if (err) {
        throw err;
      }
    });
    res.send('Note received!')
  });
});

app.delete('/api/notes/:id', function (req, res) {
  const deleteNoteId = req.params.id;

  fs.readFile('./db/db.json', (err, data) => {
    if (err) {
      throw err;
    }
    storedData = JSON.parse(data);
    for (i = 0; i < storedData.length; i++) {
      if (storedData[i].id === (deleteNoteId)) {
        storedData.splice([i], 1);
      }
    }
    jsonString = JSON.stringify(storedData);

    fs.writeFile('./db/db.json', jsonString, (err, jsonData) => {
      if (err) {
        throw err;
      }
    });
  });
  res.send('deleted requested note.')
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

