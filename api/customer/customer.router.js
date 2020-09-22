const customerController = require("./customer.controller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.post("/login", customerController.loginCustomer);
router.post("/createCustomer", customerController.createCustomer);
router.get("/fetchCustomers", checkToken, customerController.fetchAllCustomers); 
router.post("/updateCustomer", customerController.updateCustomer);
router.post("/createSubscription", checkToken, customerController.createSubscription); 
router.post("/createTicket", checkToken, customerController.createTicket); 
router.post("/createTicketAnswer", checkToken, customerController.createTicketAnswer); 
router.get("/fetchAllTickets", checkToken, customerController.fetchAllTickets); 
router.post("/fetchAllTicketAnswers", checkToken, customerController.fetchTicketAnswersById); 
router.post("/createCallbackRequest", customerController.createCallbackRequest); 
router.post("/updateCallbackRequest", checkToken, customerController.updateCallbackRequest); 
router.get("/fetchCallbackRequest", checkToken, customerController.fetchCallbackRequest); 
router.post("/requestNewsLetter", customerController.requestNewsLetter); 
// router.get("/fetchCustomerById", checkToken, customerController.fetchCustomerById);
// router.post("/updateCustomer", checkToken, customerController.updateCustomer);
// router.post("/fetchCustomerInformation", customerController.fetchCustomerDetailsById);
// router.post(
//   "/updateCustomerDetailsByID",
//   checkToken,
//   customerController.updateCustomerDetailsByID
// );
module.exports = router;
