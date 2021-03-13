const electron = require("electron");
const { ipcRenderer} = electron;

const form = document.querySelector('.form');
const modalWrapper = document.querySelector('.modal-wrapper');

const fname = document.getElementById('fname');
const lname = document.getElementById('lname');
const phone = document.getElementById('phono');
const email = document.getElementById('email');
const dob = document.getElementById('DOB');

//Modal add
const addModal = document.querySelector('.add-modal');
const btnAdd = document.querySelector('.btn-add');

//Modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');


//================Functionality to get data for db======
//======================================================

//List all customers from DB 
document.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.send("mainWindowLoaded")
    ipcRenderer.on("list:customers", (evt, customerList) => {
        //loop through all custumers
      customerList.forEach(customer => {
        renderCustomer(customer)
      })
    })
  })


 const tableUsers = document.querySelector('.table-users');
//=== function to loop through all customers====
// Create element and render customers
const renderCustomer = customer => {
    
    const tr = `
      <tr data-id='${customer.id}'>
        <td>${customer.id}</td>
        <td>${customer.fname}</td>
        <td>${customer.lname}</td>
        <td>${customer.phono}</td>
        <td>${customer.email}</td>
        <td>${customer.DOB}</td>
        <td><button class="btn btn-edit">Edit</button></td>
        <td><button class="btn btn-delete">Delete</button></td>
      </tr>
  `;
    tableUsers.insertAdjacentHTML('beforeend', tr);
  
  // Click delet user
  const btnDelete = document.querySelector(`[data-id='${customer.id}'] .btn-delete`);
  btnDelete.addEventListener('click', () => {
    ipcRenderer.send('delete:customer', `${customer.id}`)
    showAlert('Customer deleted successfully!', 'success')
    ipcRenderer.on('deleted:customer-database', function(event, arg){
    })
  });
  
  // Click Edit Customer

  const btnEdit = document.querySelector(`[data-id='${customer.id}'] .btn-edit`);
  btnEdit.addEventListener('click', () => {
      editModal.classList.add('modal-show');
      

        id = customer.id;
        editModalForm.fname.value= customer.fname
        editModalForm.lname.value= customer.lname
        editModalForm.phono.value= customer.phono
        editModalForm.email.value= customer.email
        editModalForm.DOB.value = customer.DOB

    });
   
  }

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
    e.preventDefault();
        fnameVal = editModalForm.fname.value
        lnameVal = editModalForm.lname.value
        phonoVal = editModalForm.phono.value
        emailVal = editModalForm.email.value
        DOBVal = editModalForm.DOB.value
        const data = {
          fname:fnameVal,
          lname:lnameVal,
          phono:phonoVal,
          email:emailVal,
          DOB:DOBVal
        }
    ipcRenderer.send('edit:customer', id, data)
    showAlert('Customer updated successfully!', 'success');
    editModal.classList.remove('modal-show');
})


//========================Modal and form================================
// Click add user button
btnAdd.addEventListener('click', () => {
    addModal.classList.add('modal-show')

      form.fname.value = '';
      form.lname.value = '';
      form.phono.value = '';
      form.email.value = '';
      form.DOB.value = '';

})

//Click anywhere to close the modal
window.addEventListener('click', e => {
    if(e.target === addModal){
        addModal.classList.remove('modal-show');
    }
    if(e.target === editModal){
        editModal.classList.remove('modal-show');
    }
})

//Form details
form.addEventListener('submit', (e) => {
    e.preventDefault();

    checkInputs();
 
  });

function checkInputs() {
    
  let fnameVal = form.fname.value.trim()
  let lnameVal = form.lname.value.trim()
  let phonoVal = form.phono.value.trim()
  let emailVal = form.email.value.trim()
  let dobVal =   form.DOB.value.trim()

    if(fnameVal === ''){
      setErrorFor(fname, 'First name can not be blank');
    } else {
      setSuccessFor(fname);
    }

    if(lnameVal === ''){
      setErrorFor(lname, 'Last name can not be blank')
    } else {
      setSuccessFor(lname)
    }
    if(phonoVal === ''){
      setErrorFor(phone, 'Last name can not be blank')
    } else {
      setSuccessFor(phone)
    }
    
    if(emailVal != '' || ''){
      setSuccessFor(email)
    }
    
    if(dobVal != '' || ''){
      setSuccessFor(dob)
    }
    
    if(fnameVal!='' &&lnameVal !='' && phonoVal!=''){
      let data = {
        fname: fnameVal,
        lname: lnameVal,
        phono: phonoVal,
        email: emailVal,
        dob: dobVal
      }
      //Add customer to db through main.js
      ipcRenderer.send('add:customer', data)
      showAlert('Customer added successfully!', 'success');
      modalWrapper.classList.remove('modal-show');

    } else {
      showAlert('Please enter required fields!', 'warning')
    }

}


//==================Helper Functions================
//===================================================
//set error under the input
function setErrorFor(input, message){
    const formControl = input.parentElement; // .form-control
    const small = formControl.querySelector('small');
    // add error message inside small
    small.innerText = message;
    // add error class
    formControl.className = 'form-control error';
}

function setSuccessFor(input){
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

function isEmail(email)
{
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(regexEmail)) {
    return true; 
  } else {
    return false;  
  }
}


// Clear inputs after submition
function clearInputs() {
      fname.value = '';
      lname.value= '';
      phono.value= '';
      email.value= '';
      DOB.value = '';

}

// Show Alert in top of the page
function showAlert(message, className){
  const div = document.createElement('div')
  div.className=`alert alert-${className}`;
  div.appendChild(document.createTextNode(message));
  const container = document.body;
  const wrapper = document.querySelector('.wrapper');
  container.insertBefore(div, wrapper)

  // Vanish in 2 3 seconds
  setTimeout(() => document.querySelector('.alert').remove(), 3000);

}