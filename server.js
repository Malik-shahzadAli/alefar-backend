const express = require('express');
const dotenv = require('dotenv').config({ path: './' });;
const path = require('path');
const productRoutes = require('./src/routes/product.routes.js')
const connectDB = require('./src/config/connect-with-db.js')
const authRoutes = require('./src/routes/auth.routes.js')
const userRoutes = require('./src/routes/user.routes.js')
const cartRoutes = require('./src/routes/cart.routes.js')
const orderRoutes = require('./src/routes/order.routes.js')
const dealsRoutes = require('./src/routes/deals.routes.js')
const stripeRoutes = require('./src/routes/stripe.routes.js')
dotenv.config({ path: path.join(__dirname, "config", "config.env") });
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
connectDB();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Or '*' for any origin (use with caution)
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true"); // If using credentials
  next();
});

app.use('/api/product', productRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/deals', dealsRoutes)
app.use('/api/stripe', stripeRoutes)

app.get('/', (req,res)=>{
    return res.status(200).json({
        status: 200,
        message: "Welcome to Alefar API",
      });
})
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    try {
        // await closePool();
        // await closeElasticsearch();
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// server
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
module.exports = server;