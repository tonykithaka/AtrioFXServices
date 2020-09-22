const customerService = require("./customer.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { sendMail } = require("../mailer/mailer.router");
const dateFormat = require("dateformat");
const crypto = require("crypto");
var tickets = [];

module.exports = {
  //Create a New Customer
  createCustomer: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    var errorMessage = "";
    var saveUser = true;

    //Call the Fetch All Users Function in User Service
    var currentDate = new Date(dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"));
    switch (req.body.subscriptionType) {
      case "1 Month":
        req.body.startDate = dateFormat(new Date(), "dddd, mmmm dS, h:MM:ss");
        req.body.endDate = dateFormat(
          currentDate.setMonth(currentDate.getMonth() + 1),
          "dddd, mmmm dS, h:MM:ss"
        );
        req.body.subscriptionId = "112233";
        break;
      case "3 Months":
        req.body.startDate = dateFormat(new Date(), "dddd, mmmm dS, h:MM:ss");
        req.body.endDate = dateFormat(
          currentDate.setMonth(currentDate.getMonth() + 1),
          "dddd, mmmm dS, h:MM:ss"
        );
        req.body.subscriptionId = "445566";
        break;
      case "6 months":
        req.body.startDate = dateFormat(new Date(), "dddd, mmmm dS, h:MM:ss");
        req.body.endDate = dateFormat(
          currentDate.setMonth(currentDate.getMonth() + 1),
          "dddd, mmmm dS, h:MM:ss"
        );
        req.body.subscriptionId = "778899";
        break;
      default:
        req.body.startDate = dateFormat(new Date(), "dddd, mmmm dS, h:MM:ss");
        req.body.subscriptionType = "Free";
        req.body.endDate = "No Date";
        req.body.subscriptionId = "000000";
        req.body.paymentType = "None";
        req.body.status = "Active";
    }

    console.log(body);

    customerService.fetchCustomers((err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }

      if (!err) {
        results.filter(function (item) {
          if (item.emailAddress == body.emailAddress) {
            errorMessage = "This Email Address already exists.";
            saveUser = false;
            return res.status(200).json({
              success: 0,
              message: errorMessage,
              data: err,
            });
          } else if (item.nationalId == body.nationalId) {
            errorMessage = "This National ID already exists.";
            saveUser = false;
            return res.status(200).json({
              success: 0,
              message: errorMessage,
              data: err,
            });
          }
        });
        if (saveUser) {
          //Call the Create User Function in User Service
          customerService.createCustomer(body, (err, results) => {
            if (err) {
              console.log("Error Occurred :: ", err);
              return res.status(500).json({
                success: 0,
                message: "Database connection error",
                data: err,
              });
            } else {
              customerService.createCustomerDetails(body, (err, results) => {
                console.log(
                  "body            ::                " + body.subscriptionType
                );
                if (err) {
                  console.log("Error Occurred :: ", err);
                  return res.status(500).json({
                    success: 0,
                    message: "Database connection error",
                    data: err,
                  });
                }

                customerService.createSubscription(body, (err, results) => {
                  if (err) {
                    console.log("Error Occurred :: ", err);
                    return res.status(500).json({
                      success: 0,
                      message: "Database connection error",
                      data: err,
                    });
                  }
                  return res.status(200).json({
                    success: 1,
                    message:
                      "Account Created Successfully. Please proceed to Login.",
                    data: results,
                  });
                });
              });
            }
          });
        }
      }
    });
  },

  //Login Customer
  loginCustomer: (req, res) => {
    const body = req.body;
    console.log(req.body);
    sendMail();
    customerService.fetchCustomerByEmail(body.emailAddress, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      if (!results) {
        return res.status(200).json({
          success: 0,
          message: "User Record not found",
          token: null,
          data: {
            nationalIdd: null,
            fullName: null,
            emailAddress: null,
            createdDate: null,
          },
        });
      }
      if (results.status != "Active") {
        return res.status(200).json({
          success: 0,
          message: "Sorry your account has been Deactivated, contact us on +254 729 455 784",
          token: null,
          data: {
            nationalIdd: null,
            fullName: null,
            emailAddress: null,
            createdDate: null,
          },
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        const jsonToken = sign({ result: results }, process.env.TOKEN_ENC_KEY, {
          expiresIn: "2h",
        });
        return res.status(200).json({
          success: 1,
          message: "User Successfully Logged in",
          token: jsonToken,
          data: results,
        });
      } else {
        return res.status(200).json({
          success: 0,
          message: "Invalid User Email or Password",
          token: null,
          data: {
            nationaId: null,
            fullName: null,
            emailAddress: null,
            createdDate: null,
          },
        });
      }
    });
  },

  //Update customer 
  updateCustomer: (req, res) => {
    var body = req.body
    customerService.updateCustomerInformation(body, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      } else {
        return res.status(200).json({
          success: 1,
          message: "Customer information updated successfully.",
          data: results,
        });
      }
    });
  },

  //Fetch All Customers
  fetchAllCustomers: (req, res) => {
    //Call the Fetch All Users Function in User Service
    customerService.fetchCustomers((err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Accounts Fetched Successfully",
        data: results,
      });
    });
  },

  //Fetch All Customers
  createSubscription: (req, res) => {
    customerService.createSubscription(body, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Subscription Active",
        data: results,
      });
    });
  },

  //Fetch All Customers
  createTicket: (req, res) => {
    const id = crypto.randomBytes(5).toString("hex").substring(0, 6);
    console.log("Random ID :: " + id);
    req.body.ticketId = id;
    req.body.dateCreated = dateFormat(new Date(), "dddd, mmmm dS, h:MM:ss");
    const body = req.body;
    customerService.createTicket(body, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Question submitted successfully.",
        data: results,
      });
    });
  },

  //Create ticket answer
  createTicketAnswer: (req, res) => {
    const id = crypto.randomBytes(5).toString("hex").substring(0, 6);
    req.body.responseId = id;
    // req.body.dateCreated = dateFormat(new Date(), "dddd, mmmm dS, h:MM:ss");
    req.body.dateCreated = new Date()
    const body = req.body;
    customerService.createTicketAnswer(body, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Question submitted successfully.",
        data: results,
      });
    });
  },

  //Fetch All tickets
  fetchAllTickets: (req, res) => {
    var ticketAnswers = new Array();
    var test;
    customerService.fetchAllTickets((err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      } else {
        // const sortedTickets = results.reduce((result, ticket) => {
        //   const a = result.find(({ ticketId }) => ticketId === ticket.ticketId);
        //   a
        //     ? a.ticket.push(ticket)
        //     : result.push({
        //         ticketId: ticket.ticketId,
        //         question: ticket.question,
        //         topic: ticket.topic,
        //         fullName: ticket.firstName+" "+ticket.lastName,
        //         nationalId: ticket.nationaId,
        //         ticket: [ticket],
        //       });
        //   return result;
        // }, []);

        // console.log(JSON.stringify(results))
        console.log(JSON.stringify(results))
        return res.status(200).json({
          success: 1,
          message: "Tickets fetched successfully.",
          data: results,
        });
      }
    });
  },
  //Fetch All tickets
  fetchTicketAnswersById: (req, res) => {
    var body = req.body
    var ticketId = body.ticketId;
    customerService.fetchTicketAnswers(ticketId, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      } else {
        // const sortedTickets = results.reduce((result, ticket) => {
        //   const a = result.find(({ ticketId }) => ticketId === ticket.ticketId);
        //   a
        //     ? a.ticket.push(ticket)
        //     : result.push({
        //         ticketId: ticket.ticketId,
        //         question: ticket.question,
        //         topic: ticket.topic,
        //         fullName: ticket.firstName+" "+ticket.lastName,
        //         nationalId: ticket.nationaId,
        //         ticket: [ticket],
        //       });
        //   return result;
        // }, []);

        // console.log(JSON.stringify(results))

        return res.status(200).json({
          success: 1,
          message: "Ticket Answers fetched successfully.",
          data: results,
        });
      }
    });
  },

  //Create callbackRequest
  createCallbackRequest: (req, res) => {
    const id = crypto.randomBytes(5).toString("hex").substring(0, 6);
    req.body.callbackId = id;
    // req.body.dateCreated = dateFormat(new Date(), "dddd, mmmm dS, h:MM:ss");
    req.body.dateCreated = new Date()
    const body = req.body;
    customerService.createCallBackRequests(body, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Callback Request submitted Successfully.",
        data: results,
      });
    });
  },

  //Update callback request
  updateCallbackRequest: (req, res) => {
    var body = req.body
    var callbackId = body.callbackId;
    customerService.updateCallBackRequests(callbackId, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      } else {
        return res.status(200).json({
          success: 1,
          message: "Callback request updated successfully.",
          data: results,
        });
      }
    });
  },

  //Fetch All tickets
  fetchCallbackRequest: (req, res) => {
    customerService.fetchCallbackRequests((err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      } else {
        return res.status(200).json({
          success: 1,
          message: "Callback requests fetched successfully.",
          data: results,
        });
      }
    });
  },

  //RequestNewsLetter
  requestNewsLetter: (req, res) => {
    const id = crypto.randomBytes(5).toString("hex").substring(0, 6);
    req.body.id = id;
    // req.body.dateCreated = dateFormat(new Date(), "dddd, mmmm dS, h:MM:ss");
    // req.body.dateCreated = new Date()
    const body = req.body;
    customerService.requestNewsLetter(body, (err, results) => {
      if (err) {
        console.log("Error Occurred :: ", err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
          data: err,
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Request Sent Successfully",
        data: results,
      });
    });
  },
};

