import createApp from './framework/web/server/app'
import connectDB from './config/dbConfig';

const PORT = process.env.PORT || 3000;

connectDB();

const app = createApp();

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
