require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { seedJobsIfEmpty } = require("./services/seed.service");

const PORT = process.env.PORT || 5000;

(async function bootstrap() {
  await connectDB();
  await seedJobsIfEmpty();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
