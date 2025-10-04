import app from "./app/app";
import config from "./config";

const { PORT, HOST } = config;

process.env.MAGICK_THREAD_LIMIT = "1";

app.listen(PORT, HOST, () =>
    console.log(`Server started on http://${HOST}/${PORT}`)
);
