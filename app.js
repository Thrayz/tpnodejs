const express = require('express')
const app = express()
app.use(express.json());

let voitures = [
    {id:1, name:"clio"},
    {id:2, name:"fiat"},
    {id:3, name:""}
]



app.get('/', (req, res) => {
    res.json(voitures);
    
});

app.get('/:id', (req, res)=> {
  const id = parseInt(req.params.id);
  const voiture = voitures.find(voiture=>voiture.id === id);
  if (voiture){
    res.json(voiture);
  }
  else{
    console.log('voiture doesnt exist');
  }
}
);
app.post('/create', (req,res) =>{
  const {name} = req.body;
  const id = voitures.length + 1;
  const newV = {id, name};
  voitures.push(newV);
  res.status(201).json(newV);
}
);
app.put('/:id', (req, res)=>{
  const {name} = req.body;
  const id = parseInt(req.params.id);
  const v = voitures.findIndex(voiture => voitures.id === id);
  if(index !== -1){
    voitures[v]= {name};
    res.json(voitures[v]);
  }
  else{
    res.status(404).json({message:"not found"});
  }
});
app.delete('/:id', (req,res) =>{
  const id = parseInt(req.params.id);
  voitures.filter(voiture => voitures.id === id);
  console.log('success');
}
);
app.listen(5000, () => {
  console.log('Server is running on port 5000')
})