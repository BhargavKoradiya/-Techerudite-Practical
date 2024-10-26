module.exports = (app, controllers, middleware) => {

  app.post("/ragister/customer", controllers.user.registerCustomer);
  app.post("/ragister/admin", controllers.user.registerAdmin);
  app.post("/login/admin", controllers.user.loginAdmin);

}