var express = require('express');
var mongoose = require("mongoose");
var app = express();

var schema = mongoose.Schema({
  name: String,
  count: { type: Number, default: 1 },
  //published: { type: Boolean, default: false } 
});

var Visitor2 = mongoose.model("Visitor2", schema);

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
mongoose.connection.on("error", function (e) { console.error(e); });

function publicar(res) {
  Visitor2.find(function (err, lista) {
    if (err) return console.error(err);
    console.log(lista);
    let result = "<table><thaed><tr><th>ID</th><th>Name</th><th>Visits</th></tr></thaed>"
    lista.forEach(lista => {
      result += "<tr><td>" + lista._id + "</td><td>" + lista.name + "</td><td>" + lista.count + "</td></tr>";
    })
    result += '</table>';
    res.send(result);
  });
}

app.get('/', (req, res) => {

  if (!req.query.name) {
    Visitor2.create({ name: "Anónimo" }, function (err) {
      //res.send("<h1>El visitante fue almacenado con éxito</h1>");
      if (err) return console.error(err);
      publicar(res);
    });
  } else {
    Visitor2.findOne({ name: req.query.name }, function (err, visitor2) {
      if (err) return console.error(err);
      console.log(visitor2);
      if (!visitor2) {
        Visitor2.create({ name: req.query.name }, function (err) {
          publicar(res);
        });

      } else {
        visitor2.count += 1;
        visitor2.save(function (err) {
          if (err) return console.error(err);
          publicar(res);
        });
      }
    });
  }
});
app.listen(3000, () => console.log('Listening on port 3000!'));