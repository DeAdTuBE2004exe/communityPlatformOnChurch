const app = require("./src/app");
const createPlatformAdminIfNotExists =
  require("./src/bootstrap/platformAdmin.bootstrap");

(async () => {
  await createPlatformAdminIfNotExists();

  app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
  });
})();
