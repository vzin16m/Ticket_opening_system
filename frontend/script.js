const URL = "http://localhost:3000";

async function getFetch() {
  const resp = await fetch(URL);
  if (resp.status === 200) {
    const rtn = await resp.json();
    console.log(rtn);
    const result = JSON.stringify(rtn, null, 2);
    document.getElementById("result").textContent = result;
  }
}
getFetch();

function validateFields() {
  let name = document.forms["myForms"]["name"].value;
  let cpf = document.forms["myForms"]["cpf"].value;

  if (name == "" || cpf == "") {
    alert("Please fill all fields");
    return false;
  }
  //let rtn = document.getElementById("cpf").value;
  postFetch({ name, cpf });
}

async function postFetch(rtn) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rtn),
  };
  let resp = await fetch(URL, options);
  if (!resp.ok) {
    throw Error("Invalid data");
  }
  let data = await resp.json();
  console.log(data);
}

function subValidate() {
  if (validateFields() == false) {
    return;
  }
}

function getFields() {
  let gfield = document.getElementById("deleteCpf").value;
  delFetch(gfield);
}

async function delFetch(id) {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let resp = await fetch(`${URL}/${id}`, options);
  if (!resp.ok) {
    throw Error("Invalid data");
  }
  let data = await resp.json();
  console.log(data);
}

async function putFetch(id, name) {
  const options = {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(name),
  };
  let resp = await fetch(`${URL}/change/${id}`, options);
  if (!resp.ok) {
    throw Error("Invalid data");
  }
  let data = await resp.json();
  console.log(data);
}

function chgFields() {
  //let gfieldID = document.getElementById("changeCpf").value;
  //let gfieldName = document.getElementById("changeName").value;
  let gfieldID = document.forms["chgForms"]["changeCpf"].value;
  let gfieldName = document.forms["chgForms"]["changeName"].value;
  putFetch(gfieldID, { gfieldID, gfieldName });
}
