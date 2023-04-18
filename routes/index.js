var express = require("express");
var router = express.Router();
var otpGenerator = require("otp-generator");
var Cryptr = require("cryptr");
var cryptr = new Cryptr("myTotalySecretKey");
var nodemailer = require("nodemailer");
var monk = require("monk"); //its a middleware for express and mongodb

var db = monk(
  "mongodb+srv://bhargavarg:9sZpCMEURrhiIIYl@cluster0.dvfzq3x.mongodb.net/mobile_seize_db?retryWrites=true&w=majority",
  function (err, connected) {
    if (err) {
      console.log(
        "\nMongoDB AtlasConnection failed! 🙁\nPlease check your internet connection\n"
      );
    } else {
      console.log("\nMongoDB Atlas is connected..! 😃\n");
    }
  }
);

// var db = monk('localhost:27017/db_name'); //For connecting mongodb locally
var Registration_Creds = db.get("Registration_Creds");
var Login_Creds = db.get("Login_Creds");
var Error_Reports = db.get("Error_Reports");
var Student_Details = db.get("Student_Details");

router.get("/", function (req, res) {
  res.render("RegistrationPage");
});

router.get("/forgot", function (req, res) {
  res.render("forgot");
});

router.get("/postlogin", function (req, res) {
  res.render("RegistrationPage");
});

router.get("/updPassword", function (req, res) {
  res.render("updPassword");
});

//-------------------------------------------------------- Signup --------------------------------------------------------//

router.post("/postsignup", function (req, res) {
  var now = new Date();
  var Complete_Date = `${now.getDate()}-${
    now.getMonth() + 1
  }-${now.getFullYear()} ${now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })}`;

  Registration_Creds.createIndex({ email: 1 }, { unique: true }); //takes only one unique record into collection
  Registration_Creds.insert(
    {
      email: req.body.email,
      Entered_Password: req.body.pwd,
      Encrypted_Pwd: cryptr.encrypt(req.body.pwd),
      Signup_Time: Complete_Date,
    },
    function (err, docs) {
      if (err) {
        console.log("\nEmail exists\n");
        Error_Reports.insert({
          email: req.body.email,
          Encrypted_Pwd: req.body.pwd,
          Signup_Error_Time: Complete_Date,
        });
      } else {
        res.send(docs);
        console.log("\nSuccessfully Registered!\n");
      }
    }
  );
});

//-------------------------------------------------------- Login --------------------------------------------------------//

router.post("/postlogin", function (req, res) {
  var now = new Date();
  var Complete_Date = `${now.getDate()}-${
    now.getMonth() + 1
  }-${now.getFullYear()} ${now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })}`;

  Registration_Creds.find({ email: req.body.email }, function (err, data) {
    Login_Creds.insert({
      Visitor_Name: req.body.uname,
      Entered_Password: req.body.pwd,
      Time_Of_Visit: Complete_Date,
    });

    var password1 = cryptr.decrypt(data[0].Encrypted_Pwd);
    var password2 = req.body.pwd;
    console.log(password1 == password2);
    if (password1 == password2) {
      delete data.pwd;
      req.session.email = data;
      res.sendStatus(200);
      console.log("\nPasswords matched with DB!\n");
    } else if (password1 != password2) {
      Error_Reports.insert({
        email: req.body.email,
        Entered_Password: req.body.pwd,
        Login_Error_Time: Complete_Date,
      });
      console.log("\nPasswords Doesn't Matched..!\n");
      res.sendStatus;
      req.session.destroy();
    } else {
      console.log("\nSomething went wrong..!\n");
    }
  });
});

//--------------------------------------------------- Generatng OTP & Sending mail --------------------------------------------------------//

router.post("/postforgot", function (req, res) {
  var email = req.body.email;
  var Generated_OTP = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  Registration_Creds.findOne({ email }, function (err, data) {
    if (err) throw err;
    if (data) {
      console.log("\nFound: " + email + "\n");
      Registration_Creds.update(
        { email: email },
        { $set: { DB_OTP: Generated_OTP } }
      );
    } else {
      console.log("\n" + email + " Not found\n");
    }
  });

  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "edifakemail0@gmail.com",
      pass: "rneouxkmyontmbdk",
    },
  });

  var mailOptions = {
    from: "edifakemail0@gmail.com",
    to: email,
    subject: "OTP",
    html: `<div class="container" style="max-width: 90%; margin: auto; padding-top: 20px"><h2><b>Verification code</b></h2><p>Please use the verification code below to sign in. ✔</p><h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${Generated_OTP}</h2><p style="font-size:0.9em;">Regards,<br />Your Brand</p><hr style="border:none;border-top:1px solid #eee" /><div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300"><p>Your Brand Inc</p><p>Bhargava Gidijala</p><p>+91 9493818156</p></div>`,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("\nOTP Sent Successfully..!\n");
      res.send(info);
    }
  });
});

// -----------------------------------------------------  Validating OTP  --------------------------------------------------------------//

router.post("/postValidateOTP", function (req, res) {
  var now = new Date();
  var Complete_Date = `${now.getDate()}-${
    now.getMonth() + 1
  }-${now.getFullYear()} ${now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })}`;

  var Entered_OTP = req.body.user_otp;
  var New_Password = req.body.new_pwd;
  var Encrypted_New_Password = cryptr.encrypt(New_Password);
  var confirm_new_pwd = req.body.confirm_new_pwd;

  if (New_Password == confirm_new_pwd) {
    console.log("\nNew & Confirm passwords matched..!\n");

    // Registration_Creds.find({ DB_OTP: { $exists: true } }).toArray(function (
    //   err,
    //   docs
    // ) {
    //   if (err) {
    //     console.log("Error finding documents:", err);
    //   } else {
    //     console.log("Found the following documents:");
    //     console.log(docs);
    //   }
    // });
    Registration_Creds.find({ DB_OTP: Entered_OTP }, function (err, res) {
      if (err) {
        console.log("\nSomething went wrong..!\n");
        Error_Reports.insert({
          email: req.body.email,
          Entered_Pwd: req.body.pwd,
          Updated_Password_Error_Time: Complete_Date,
        });
      } else {
        Registration_Creds.update(
          { DB_OTP: Entered_OTP },
          {
            $set: {
              Entered_Password: New_Password,
              Encrypted_Pwd: Encrypted_New_Password,
              Updated_Password_Time: Complete_Date,
            },
          }
        );
      }
    });
  }
});

//--------------------------------------- Rendering specific data from homepage based on 'status' ------------------------------------------//

router.get("/home", function (req, res) {
  if (req.session && req.session.email) {
    res.locals.email = req.session.email;
    Student_Details.find({}, function (err, db) {
      Student_Details.find({ status: "At_office" }, function (err, db1) {
        Student_Details.find({ status: "Returned" }, function (err, db2) {
          if (err) {
            req.session.destroy();
            console.log(err);
          } else {
            // console.log(db);
            res.render("home", {
              data: db,
              data1: db1,
              data2: db2,
              data3: db,
              count: db.length,
              count1: db1.length,
              count2: db2.length,
            });
          }
        });
      });
    });
  }
});

router.post("/hh", function (req, res) {
  var data = {
    Date: req.body.Date,
    Time: req.body.Time,
    sname: req.body.sname,
    spno: req.body.spno,
    rno: req.body.rno,
    clg: req.body.clg,
    brch: req.body.brch,
    year: req.body.year,
    sec: req.body.sec,
    pname: req.body.pname,
    ppno: req.body.ppno,
    ename: req.body.ename,
    epno: req.body.epno,
    eid: req.body.eid,
    rsn: req.body.rsn,
    mmodel: req.body.mmodel,
    imei: req.body.imei,
    mclr: req.body.mclr,
    status: "At_office",
  };
  Student_Details.insert(data, function (err, db) {
    if (err) {
      req.session.destroy();
      console.log(err);
    } else {
      console.log(db);
      res.redirect("/home");
    }
  });
});

router.post("/change", function (req, res) {
  Student_Details.update(
    { rno: req.body.rno },
    { $set: { status: "Returned" } },
    function (err, docs) {
      console.log(docs);
    }
  );
  res.redirect("/home");
});

router.post("/edit", function (req, res) {
  var r = req.body.rno;
  Student_Details.find({ rno: r }, function (err, db) {
    console.log(db);
    res.send(db);
  });
});

router.post("/update", function (req, res) {
  var data3 = {
    Date: req.body.Date,
    Time: req.body.Time,
    sname: req.body.sname,
    spno: req.body.spno,
    rno: req.body.rno,
    clg: req.body.clg,
    brch: req.body.brch,
    year: req.body.year,
    sec: req.body.sec,
    pname: req.body.pname,
    ppno: req.body.ppno,
    ename: req.body.ename,
    epno: req.body.epno,
    eid: req.body.eid,
    rsn: req.body.rsn,
    mmodel: req.body.mmodel,
    imei: req.body.imei,
    mclr: req.body.mclr,
  };
  Student_Details.update(
    { rno: req.body.rno },
    { $set: data3 },
    function (err, db) {
      console.log(db);
    }
  );

  res.redirect("/home");
});

router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
