/*eslint-disable*/
import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { displayMap } from './mapbox';

//Dom ELements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const changePasswordForm = document.querySelector('.form.form-user-settings');
const logOutBtn = document.querySelector('.nav__el--logout');
//Map Box

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

//Form
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', async e => {
    e.preventDefault();

    //multipart form data: upload images

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    await updateSettings(form, 'data');
  });
}

if (changePasswordForm) {
  changePasswordForm.addEventListener('submit', async e => {
    e.preventDefault();

    const passwordCurrent = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm = document.getElementById('password-confirm')
      .value;
    console.log({ passwordCurrent, newPassword, newPasswordConfirm });
    await updateSettings(
      { passwordCurrent, newPassword, newPasswordConfirm },
      'password'
    );

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}
