require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')

const EmployeeRouter = require('./routers/EmployeeRouter')
const ProductRouter = require('./routers/ProductRouter')
const TransactionDetailRouter = require('./routers/TransactionDetailRouter')
const TransactionRouter = require('./routers/TransactionRouter')
const UserRouter = require('./routers/UserRouter')
const CustomerRouter = require('./routers/CustomerRouter.js')

const app = express()
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('login')
})

app.use('/products', ProductRouter)
app.use('/transactions', TransactionRouter)
app.use('/employees', EmployeeRouter)
app.use('/users', UserRouter)
app.use('/transactionDetails', TransactionDetailRouter)
app.use('/customers', CustomerRouter)

const port = process.env.PORT || 8080
const CONNECTION_STRING = process.env.CONNECTION_STRING

const connect = async () => {
    try {
        await mongoose.connect(CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'ePhoneShop'
        });
        console.log("Connected to MongoDB.");
        // Chỉ start server sau khi đã connect đến db
        app.listen(port, () => console.log('Server is running at http://localhost:' + port));
    } catch (error) {
        console.log('Không thể kết nối tới db server: ' + error.message);
    }
};

connect();

// mongoose.connect(CONNECTION_STRING, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: 'ePhoneShop'
// })
// .then(() => {
//     // chỉ start server sau khi đã conncect đến db
//     app.listen(port, () => console.log('http://localhost:' + port))
// })
// .catch(e => console.log('Không thể kết nối tới db server: ' + e.message))