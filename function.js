// memanggil local module db dengan metode require
const pool = require("./db");

// membuat fungsi dupe untuk duplikasi data
const dupe = async (name) => {
  try {
    const { rows: contact } = await pool.query(`SELECT * FROM contacts WHERE name = '${name}'`);
    // jika panjang contact lebih dari noll (ada isinya)
    if (contact.length > 0) {
      return contact[0].name;
      // jika tidak ada
    } else {
      return "undefined";
    }
    // jika terjadi error
  } catch (err) {
    console.error("error func detail : ", err);
  }
};

// memmbuat fungsi savedata untuk menyimpan data
const savedata = async (data) => {
  try {
    await pool.query(`INSERT INTO contacts(name,email,mobile) VALUES('${data.nama}','${data.email}','${data.mobile}')`);
    console.log("data berhasil disimpan");
    // jika terjadi error
  } catch (err) {
    console.err("error func savedata : ", err);
  }
};

// membuat fungsi utuk delete data
const deleted = async (dlt) => {
  try {
    await pool.query(`DELETE FROM contacts WHERE name = '${dlt}'`);
    console.log("data delete");
    // jika terjadi error
  } catch (err) {
    console.error("error fungsi delete", err);
  }
};

//membuat fungsi untuk membaca data dari database
const loadData = async () => {
  try {
    const { rows: load } = await pool.query(`SELECT * FROM contacts ORDER BY name ASC`);
    return load;
    // jika terjadi error
  } catch (err) {
    console.err("error func loadData : ", err);
  }
};

// membuat fungsi mencari data yg sama dengan inputan
const filter = async (data) => {
  try {
    const { rows: load } = await pool.query(`SELECT * FROM contacts WHERE name = '${data}'`);
    return load;
    // jika terjadi error
  } catch (err) {
    console.error("error func filter", err);
  }
};

// membuat fungsi untuk meng-update data
const update = async (data, condition) => {
  try {
    await pool.query(`UPDATE contacts set name = '${data.name}', email = '${data.email}', mobile = '${data.mobile}' WHERE name = '${condition}'`);
    console.log("berhasil diupdate");
    // jika terjadi error
  } catch (err) {
    console.error("eror update", err);
  }
};

// menngexport module
module.exports = { dupe, savedata, loadData, filter, update, deleted };
