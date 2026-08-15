'use strict';

// write code here
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

let ascending = true;
let sortedColumn = null;

thead.addEventListener('click', (ev) => {
  const clickedEl = ev.target.closest('th');

  if (!clickedEl) {
    return;
  }

  const parentEl = clickedEl.parentElement;
  const index = [...parentEl.children].indexOf(clickedEl);

  if (sortedColumn === index) {
    ascending = !ascending;
  } else {
    sortedColumn = index;
    ascending = true;
  }

  const rows = [...tbody.rows];

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[index].textContent;
    const cellB = rowB.cells[index].textContent;

    const numA = parseFloat(cellA.replace(/[^0-9.-]/g, ''));
    const numB = parseFloat(cellB.replace(/[^0-9.-]/g, '')); // eslint-disable-line -- formating text content from $162,700 into a number 162700

    if (!isNaN(numA) && !isNaN(numB) && !ascending) {
      return numB - numA;
    }

    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }

    if (!ascending) {
      return cellB.localeCompare(cellA);
    }

    return cellA.localeCompare(cellB);
  });

  tbody.append(...rows);// eslint-disable-line -- by using append here we reformate hall table in Dom without create every element.
});

tbody.addEventListener('click', (ev) => {
  const clickedEl = ev.target.closest('tr');

  if (!clickedEl) {
    return;
  }

  [...tbody.children].forEach((child) => {
    child.classList.remove('active');
  });

  clickedEl.classList.add('active');
});

// Form creation -->

const dynamicForm = document.createElement('form');

dynamicForm.classList.add('new-employee-form');

function addFormInput(
  form,
  type,
  inputName,
  dataQa,
  labelText,
  placeholder = '',
) {
  const label = document.createElement('label');

  label.textContent = labelText + ' ';

  const input = document.createElement('input');

  input.type = type;
  input.name = inputName;
  input.dataset.qa = dataQa;
  input.required = true;

  if (placeholder) {
    input.placeholder = placeholder;
  }

  label.append(input);
  form.append(label);
}

// Select Options
const selectOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

function addFormSelect(form, selectName, dataQa, labelText) {
  const label = document.createElement('label');

  label.textContent = labelText + '';

  const select = document.createElement('select');

  select.name = selectName;
  select.dataset.qa = dataQa;
  select.required = true;

  selectOptions.forEach((option) => {
    const opt = document.createElement('option');

    opt.value = option;
    opt.textContent = option;

    select.append(opt);
  });

  label.append(select);
  form.append(label);
}

addFormInput(dynamicForm, 'text', 'name', 'name', 'Name: ');
addFormInput(dynamicForm, 'text', 'position', 'position', 'Position: ');
addFormSelect(dynamicForm, 'office', 'office', 'Office: ');
addFormInput(dynamicForm, 'number', 'age', 'age', 'Age: ');
addFormInput(dynamicForm, 'number', 'salary', 'salary', 'Salary: ');

// eslint-disable-line -- Button creation
const button = document.createElement('button');

button.textContent = 'Save to table';

dynamicForm.append(button);

document.body.appendChild(dynamicForm);

//eslint-disable-line -- Notification
function pushNotification(title, description, classType) {
  const existing = document.querySelector('[data-qa="notification"]');

  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');

  notification.classList.add('notification', classType);
  notification.dataset.qa = 'notification';

  const titleEl = document.createElement('div');
  const descriptionEL = document.createElement('p');

  titleEl.classList.add('title');
  titleEl.textContent = title;
  descriptionEL.textContent = description;

  notification.append(titleEl);
  notification.append(descriptionEL);
  document.body.append(notification);

  setTimeout(() => notification.remove(), 4000);
}

//eslint-disable-line -- Getting and checking Form data, then adding it to a table

dynamicForm.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const data = new FormData(dynamicForm);

  const employeeName = data.get('name').trim();
  const position = data.get('position').trim();
  const office = data.get('office');
  const age = Number(data.get('age'));
  const salary = Number(data.get('salary'));

  if (!employeeName || !position || !office || !age || !salary) {
    pushNotification('Error', 'You have to fill all inputs.', 'error');

    return;
  }

  if (employeeName.length < 4) {
    pushNotification('Error', 'Name should have at least 4 letters.', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification('Error', 'Age should be between 18 and 90.', 'error');

    return;
  }


  //eslint-disable-line -- Add row to the table

  const row = document.createElement('tr');

  row.innerHTML = `
  <td>${employeeName}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>$${salary.toLocaleString('en-Us')}</td>
  `;

  tbody.append(row);

  pushNotification(
    'Success',
    'New employee was successfully added to the table',
    'success',
  );

  dynamicForm.reset();
});
