const pool = require("../../config/database");

module.exports = {
  //Creates New Users
  createCustomer: (data, callback) => {
    console.log(data);
    pool.query(
      `insert into customers(nationalId, firstName, lastName, emailAddress, Status, password, dateCreated)
            values(?,?,?,?,?,?,?)`,
      [
        data.nationalId,
        data.firstName,
        data.lastName,
        data.emailAddress,
        "Active",
        data.password,
        Date(),
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results);
      }
    );
  },

  //Fetch All Users
  fetchCustomers: (callback) => {
    pool.query(
      `select nationalId, firstName, lastName, emailAddress, phoneNumber, telegramName, imageUrl from customers_information`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Create User Information
  createCustomerDetails: (data, callback) => {
    pool.query(
      `insert into customers_information(nationalId, firstName, lastName, emailAddress, phoneNumber, subscriptionType, telegramName, dateCreated)
            values(?,?,?,?,?,?,?,?)`,
      [
        data.nationalId,
        data.firstName,
        data.lastName,
        data.emailAddress,
        data.phoneNumber,
        data.subscriptionType,
        data.telegramName,
        Date(),
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Fetch Users by User Email
  fetchCustomerByEmail: (emailAddress, callback) => {
    pool.query(
      `select nationalId, firstName, emailAddress, status, password, dateCreated from customers where emailAddress = ?`,
      [emailAddress],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },

  //Fetch All Customers
  fetchCustomers: (callback) => {
    pool.query(
      `select a.nationalId, a.firstName, a.lastName, a.emailAddress, a.phoneNumber, a.telegramName, a.dateCreated, b.subscriptionType, b.startDate, b.endDate, b.paymentType, c.Status from customers_information a, subscriptions b, customers c where a.nationalid = b.nationalId and b.nationalId = c.nationalId`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Update callback requests
  updateCustomerInformation: (data, callback) => {
    pool.query(
      `update customers_information a, subscriptions b, customers c set a.nationalId = ?, a.firstName = ?, a.lastname = ?, a.emailAddress = ?, a.phoneNumber = ?, a.telegramName = ?, a.subscriptionType = ?, b.paymentType = ? , b.subscriptionType = ? , b.startDate = ?, b.endDate = ?, c.firstName = ?, c.lastName = ?, c.emailAddress = ?  where a.nationalid = b.nationalId and b.nationalId = c.nationalId and c.nationalId = ?`,
      [
        data.nationalId,
        data.firstName,
        data.lastName,
        data.emailAddress,
        data.phoneNumber,
        data.telegramName,
        data.subscriptionType,
        data.paymentType,
        data.subscriptionType,
        data.startDate,
        data.endDate,
        data.firstName,
        data.lastName,
        data.emailAddress,
        data.nationalId
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Create new subscription
  createSubscription: (data, callback) => {
    pool.query(
      `insert into subscriptions(subscriptionId, nationalId, amount, paymentType, subscriptionType, startDate, endDate, status)
            values(?,?,?,?,?,?,?,?)`,
      [
        data.subscriptionId,
        data.nationalId,
        data.amount,
        data.paymentType,
        data.subscriptionType,
        data.startDate,
        data.endDate,
        data.status,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Create new ticket
  createTicket: (data, callback) => {
    pool.query(
      `insert into tickets(ticketId, nationalId, assetId, assetType, topic, question, dateCreated)
            values(?,?,?,?,?,?,?)`,
      [
        data.ticketId,
        data.nationalId,
        data.assetId,
        data.assetType,
        data.topic,
        data.question,
        data.dateCreated,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Create new ticket
  createTicketAnswer: (data, callback) => {
    pool.query(
      `insert into tickets_answers(ticketId, responseId, responderId, answer, dateCreated)
            values(?,?,?,?,?)`,
      [
        data.ticketId,
        data.responseId,
        data.responderId,
        data.answer,
        data.dateCreated,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Fetch Tickets
  fetchAllTickets: (callback) => {
    pool.query(
      `select a.ticketId, a.nationalId, a.assetId, a.assetType, a.topic, a.question, a.dateCreated, a.responseDate, b.firstName, b.lastName from tickets a, customers_information b where a.nationalId = b.nationalId`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Fetch Tickets Answers
  fetchTicketAnswers: (ticketIdnumber, callback) => {
    pool.query(
      `select a.responseId, a.ticketId, a.responderId, a.answer, DATE_FORMAT(a.dateCreated, '%M %d %Y %h:%i:%s %p') as dateCreated, ifnull((select CONCAT(firstName, ' ', lastName) as fullName from customers_information where nationalId = a.responderId LIMIT 1), (select concat('Administrator - ', fullName) from user_information where nationalId = a.responderId LIMIT 1)) as firstName from tickets_answers a, customers_information b, user_information c where a.ticketId = ? and (a.responderId = b.nationalId or a.responderId = c.nationalId) GROUP BY a.responseId ORDER BY a.dateCreated DESC`,
      [ticketIdnumber],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Create callback requests
  createCallBackRequests: (data, callback) => {
    pool.query(
      `insert into callback_requests( callbackId, fullName, emailAddress, phoneNumber, country, telegramName, status, dateCreated) values (?,?,?,?,?,?,?,?)`,
      [
        data.callbackId,
        data.fullName,
        data.emailAddress,
        data.phoneNumber,
        data.country,
        data.telegramName,
        "Not Read",
        data.dateCreated,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Update callback requests
  updateCallBackRequests: (callbackId, callback) => {
    pool.query(
      `update callback_requests set status = "Read" where callbackId = ?`,
      [callbackId],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Fetch Tickets
  fetchCallbackRequests: (callback) => {
    pool.query(
      `select callbackId, fullName, emailAddress, phoneNumber, country, telegramName, status, dateCreated from callback_requests`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },

  //Create callback requests
  requestNewsLetter: (data, callback) => {
    pool.query(
      `insert into news_letter_mails( id, emailAddress) values (?,?)`,
      [
        data.id,
        data.emailAddress
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
};
