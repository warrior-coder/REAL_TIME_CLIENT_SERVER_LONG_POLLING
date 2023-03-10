const express = require('express');
const cors = require('cors');

const port = 4001;
const app = express();

app.use(cors());

app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});
