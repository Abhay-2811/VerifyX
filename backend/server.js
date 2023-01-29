const { app, db, PORT } = require('./config/config');
const { SERVER_DB_URI } = require('./constants/constants');
const cors = require('cors');
app.use(cors());
const bootstrap = async () => {
  try {
    await db.connect(SERVER_DB_URI);
    app.listen(PORT, async () => {
      console.log("Listening at ",PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

bootstrap();