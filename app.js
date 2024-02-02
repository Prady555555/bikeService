import express from "express";
import { getDatabase } from "./db.js";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { IdConverter } from "./db.js";
const app = express();
const port = process.env.PORT ||3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// This is the get page for the front page of the website
app.get("/", (req, res) => {
  res.render("app.ejs");
});

// This is the page to the dash board to the admin page
app.get("/dash", (req, res) => {
  res.render("booking-form.ejs");
});

// This the front page regstiration form code and along with the nodemailer to send the mail
app.post("/book", async (req, res) => {
  let database = await getDatabase();
  const collection = database.collection("service");
  let books = {
    customerEmail: req.body.customerEmail,
    customerMobile: req.body.customerMobile,
    serviceName: req.body.serviceName,
    date: req.body.date,
  };
  collection.insertOne(books);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "bikeservice926@gmail.com", // Your Gmail email address
      pass: "asym snkg ysfk sikf", // Your Gmail password or an app-specific password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const mailOptions = {
    from: {
      name: "Monica Bike Service",
      address: "bikeservice926@gmail.com",
    }, // sender address
    to: books.customerEmail, // recipient
    subject: "Booking Confirmation",
    text: "Thank you for booking our service!",
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
  res.redirect("/?status=1");
});

// This is the admin page form it is predefined with username and password we are using body-parse mddleware

app.post("/dash", async (req, res) => {
  var credntials = {
    username: req.body.username,
    password: req.body.password,
  };

  let database = await getDatabase();
  const collection = database.collection("service");
  const cursor = collection.find({});
  let datas = await cursor.toArray();

  if (credntials.username == "pradeep" && credntials.password == 1234) {
    res.render("dashboard-content.ejs", { datas });
  } else {
    res.redirect("/dash");
  }
});

// This is the query req for the accept a ref button in the admin dash board here we are
// sendnd the accept mail for the respective person using the id in the mongoDB database

app.get("/accept", async (req, res) => {
  let acceptID;
  let acceptMail;

  const database = await getDatabase();
  const collection = database.collection("service");
  const cursor = collection.find({});
  let datas = await cursor.toArray();
  if (req.query.acceptID) {
    let database = await getDatabase();
    acceptID = req.query.acceptID;
    acceptID = new IdConverter(acceptID);

    const collection = database.collection("service");
    acceptMail = await collection.findOne({ _id: acceptID });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "bikeservice926@gmail.com", // Your Gmail email address
        pass: "asym snkg ysfk sikf", // Your Gmail password or an app-specific password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: {
        name: "Monica Bike Service",
        address: "bikeservice926@gmail.com",
      }, // sender address
      to: acceptMail.customerEmail, // recipient
      subject: "Your Booking Has been Accepted",
      text: "Thank you for booking our service!",
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
  // res.render("dashboard-content.ejs",{datas})
});

// This is the query req for the reject a ref button in the admin dash board here we are
// send the reject  mail for the respective person using the id in the mongoDB database

app.get("/reject", async (req, res) => {
  let rejectID;
  let acceptMail;
  // let rejectID = req.query.rejectID;
  // let doneId = req.query.doneId;
  if (req.query.rejectID) {
    let database = await getDatabase();
    rejectID = req.query.rejectID;
    rejectID = new IdConverter(rejectID);

    const collection = database.collection("service");
    acceptMail = await collection.findOne({ _id: rejectID });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "bikeservice926@gmail.com", // Your Gmail email address
        pass: "asym snkg ysfk sikf", // Your Gmail password or an app-specific password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: {
        name: "Monica Bike Service",
        address: "bikeservice926@gmail.com",
      }, // sender address
      to: acceptMail.customerEmail, // recipient
      subject: "Your booking has been rejected due to our technical problem",
      text: "Sry for the trouble you have faced  ",
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
});

// This is the query req for the done a ref button in the admin dash board here we are
// send the done  mail for the respective person using the id in the mongoDB database

app.get("/done", async (req, res) => {
  let doneID;
  let acceptMail;
  // let rejectID = req.query.rejectID;
  // let doneId = req.query.doneId;
  if (req.query.doneID) {
    let database = await getDatabase();
    doneID = req.query.doneID;
    doneID = new IdConverter(doneID);

    const collection = database.collection("service");
    acceptMail = await collection.findOne({ _id: doneID });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "bikeservice926@gmail.com", // Your Gmail email address
        pass: "asym snkg ysfk sikf", // Your Gmail password or an app-specific password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: {
        name: "Monica Bike Service",
        address: "bikeservice926@gmail.com",
      }, // sender address
      to: acceptMail.customerEmail, // recipient
      subject: "Your serice has been finished",
      text: "come and pick your vechicle ",
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
});

app.listen(port, () => {
  console.log(`you have connected in ${port}`);
});
