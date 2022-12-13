// memanggil module express
const express = require("express");

// menyimpn function express menjadi variable app
const app = express();

// memanggil local module function
const func = require("./function");

// membuat variable untuk port 3000
const port = 3000;

// memanggil module express-validator untuk validasi data
const { body, check, validationResult } = require("express-validator");

// memanggil module expressLayouts dengan require
const expressLayouts = require("express-ejs-layouts");

//menjadikan folder 'public' menjadi public
app.use(express.static("views/public"));

//memakai fungsi urlencoded untuk mengubah format
app.use(express.urlencoded({ extended: true }));

// memakai fungsi view engine dengan ejs
app.set("view engine", "ejs");

//memanggil file ejs-layout.ejs
app.set("layout", "layout/ejs-layout.ejs");

// menggunakan express-layout
app.use(expressLayouts);

//memakai fungsi express untuk engkonversi ke json
app.use(express.json());

//menerima request /tst
app.get("/tst", async (req, res) => {
  try {
    const name = "tsts";
    const mobile = "087878182815";
    const email = "tsr@gmail.com";
    const { rows: newCont } = await pool.query(`SELECT * FROM contacts`);
    res.json(newCont);
    console.log("running");
  } catch (err) {
    console.error(err.message);
  }
});

//menerima request dari client
app.get("/", (req, res) => {
  // membuat nilai object ke index dengan ejs
  res.render("index", { nama: "desman", title: "Halaman index" });
});

// menerima request about
app.get("/about", express.static(__dirname + "/about.ejs"), (req, res) => {
  res.render("about", { title: "Halaman About" });
});

//menerima request contact
app.get("/contact", async (req, res) => {
  // memanggil fungsi loadData dan menyimpannya ke variable content
  const content = await func.loadData();
  // menampilkan file contact dan memasukan variable content ke contact dengan ejs
  res.render("contact", { title: "Halaman Contact", content });
});

//menerima data dari form delete
app.post("/delete", async (req, res) => {
  func.deleted(req.body.dlt);
  res.redirect("/contact");
});

//menerima request contact
app.get("/add", (req, res) => {
  res.render("add", { title: "Halaman add" });
});

// mendapatkan data dari form add data
app.post(
  "/added",
  [
    // membuat custom validator untuk duplikat data
    body("nama").custom(async (value) => {
      const duplikat = await func.dupe(value);
      if (duplikat == value) {
        console.log("data duplikat");
        throw new Error("Data already exists");
      }
      return true;
    }),
    // mengecek format data dengan validator
    check("nama", "format name is wrong").isAlpha("en-US", { ignore: " " }).isLength({ min: 3 }).withMessage("minimal length name is 3"),
    check("email", "email not valid").isEmail(),
    check("mobile", "mobile phone not valid").isMobilePhone("id-ID").isLength({ max: 12 }).withMessage("phone number max length 12"),
  ],

  async (req, res) => {
    // menangkap hasil validator jika terjadi salah format data
    const errors = validationResult(req);

    // jika data salah format
    if (!errors.isEmpty()) {
      // memanggil file add dan memasukan variable error
      res.render("add", { errors: errors.array(), title: "halaman add" });
      // menampilkan nilai variable error ke terminal
      console.log(errors.array());

      // jika tidak terjadi error
    } else {
      await func.savedata(req.body);
      res.redirect("contact");
    }
  }
);

// menerima request edit
app.get("/edit/:name", async (req, res) => {
  const getDetail = await func.filter(req.params.name);
  const params = req.params.name;
  res.render("edit", { params, getDetail, title: "Halaman edit" });
});

// menerima data dari form edit
app.post(
  "/update/:name",
  [
    // membuat custom validator untuk duplikat data
    body("name").custom(async (value, { req }) => {
      const duplikat = await func.dupe(value);
      if (value != req.params.name && value == duplikat) {
        console.log("data duplikat");
        throw new Error("Data already exists");
      }
      return true;
    }),
    // mengecek format data dengan validator
    check("name", "format name is wrong").isAlpha("en-US", { ignore: " " }).isLength({ min: 3 }).withMessage("minimal length name is 3"),
    check("email", "email not valid").isEmail(),
    check("mobile", "mobile phone not valid").isMobilePhone("id-ID").isLength({ max: 12 }).withMessage("phone number max length 12"),
  ],

  async (req, res) => {
    // menangkap hasil validator jika terjadi salah format data
    const errors = validationResult(req);
    //menangkap parameter.name dan memasukannya ke variable params.name
    const params = req.params.name;
    // meanngkap nilai req.body ke variable getDetail
    const getDetail = [req.body];

    // jika data salah format
    if (!errors.isEmpty()) {
      console.log(getDetail);
      // memanggil file add dan memasukan variable error
      res.render("edit", { errors: errors.array(), title: "halaman add", params, getDetail });
      // menampilkan nilai variable error ke terminal
      console.log(errors.array());

      // jika tidak terjadi error
    } else {
      // memnaggil fungsi update
      await func.update(req.body, params);
      // mengarahkan ke /contact
      res.redirect("/contact");
    }
  }
);

// use untuk pemanggilan path apapun
app.use("/", (req, res) => {
  //menyetting status html menjadi 404 (not found)
  res.status(404);
  // menuliskan di web browser 'Page not found'
  res.send("Page not found 404");
});

// membaca port
app.listen(port, () => {
  // memunculkan tulisan diterminal
  console.log(`listening on port http://localhost:${port}`);
});
