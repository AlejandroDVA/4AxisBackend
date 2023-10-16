import express from 'express';
import axios from 'axios';
import https from 'https';
import bodyParser from 'body-parser';
import { converterStringToNumber, converterUF } from './convertor';
import userSchema from './schemas';
import historySchema from './historySchema';
import cors from 'cors';
import mongoose from 'mongoose';


const uri = "mongodb+srv://admin:OT2O4X3qU6WO5Rgn@cluster0.rrn19fc.mongodb.net/?retryWrites=true&w=majority";

const app = express();
const port = process.env.PORT || 3000;

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send({ msg: "un aplauso para el luquitas"});
});

app.post('/convert', async (req, res) => {
    const { date, value, user } = req.body;
    try {
      const url = `https://165.227.94.139/api/uf/${date}`;
      const { data, status } = await axiosInstance.get(url);
      const ufValue = converterStringToNumber(value);  
      const valor = data.serie[0].valor;
      const responseCLP = converterUF(ufValue, valor);
      const result = {
          valor,
          responseCLP
      }
      res.status(status);
      res.json(result);
      saveValues(date,valor,responseCLP.toString(),user,ufValue.toString())
    } catch (error) {
      res.status(500).send('Error en la solicitud a la API');
    }
  });

  app.post('/unitUF', async (req, res) => {
    const { date, value, user } = req.body;
    try {
      const url = `https://165.227.94.139/api/uf/${date}`;
      const { data, status } = await axiosInstance.get(url);
      const ufValue = converterStringToNumber(value);  
      const valor = data.serie[0].valor;
      const result = {
          valor
      }
      res.status(status);
      res.json(result);
    } catch (error) {
      res.status(500).send('Error en la solicitud a la API');
    }
  })

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
   
      const User = mongoose.model('User', userSchema);
 
  const user = await User.find({email: email, password: password});
  
      if (user.length==0) {
       console.log(user);
        res.status(401);
        res.json(user);
      } else {
        console.log(user);
        res.status(200);
        res.json(user);
        
      }
    } catch (error) {
      res.status(500).send('Error en la solicitud a la base de datos');
    }
  });

 const saveValues = async (date: string, valor: string, responseCLP: string, user: string, ufValue: string) => {
    try {
      const History = mongoose.model('History', historySchema );
      const saveAction = new History({
        activityDate: date,
        user: user,
        originAmount: valor,
        convertionDate: new Date(),
        coinValue: ufValue,
        convertionAmount: responseCLP,
      });
      await saveAction.save();
      console.log("save success")
    } catch (error) {
        console.log("error")
    }
     
}

  app.get('/history', async (req, res) => {
    try {
      const History = mongoose.model('History', historySchema);
      const response = await History.find();
        res.status(200);
        res.json(response);
    } catch (error) {
      res.status(500).send('Error en la solicitud a la base de datos');
    }
  });


app.listen(port, async () => {
   await mongoose.connect(uri, { retryWrites: true, w: 'majority' })
  return console.log(`Express está escuchando en http://localhost:${port}`);
});