import app from './app/app';
import config from './config';

const {PORT, HOST} = config;

app.listen(PORT, HOST, () => console.log(`Server started on port ${PORT}`));