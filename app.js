class Budget {
  constructor(){
    this.amount = document.getElementById('amount');
    this.description = document.getElementById('description');
    this.budget = document.getElementById('budget');
    this.formExpenses = document.getElementById('form-expenses');
    this.formBudget = document.getElementById('form-budget');
    
    this.uiBudget = document.getElementById('ui-budget-amount');
    this.uiExpenses = document.getElementById('ui-expenses-amount');
    this.uiBalance = document.getElementById('ui-balance-amount');
    this.uiExpensesList = document.getElementById('ui-expenses-list');

    this.budgetIcon = document.getElementById('budget-icon');
    this.expensesIcon = document.getElementById('expenses-icon');
    this.balanceIcon = document.getElementById('balance-icon');

    this.clearAllData = document.getElementById('clear-all-data');
    this.clearAllDataDiv = document.getElementById('clear-data-alert');
    this.alertDiv = document.getElementById('item-alert');

    this.expenseID = '';
    this.clickEdit = true;

    this.totalExpenses = 0;
    this.balance = 0;

    this.expenseObjLocal = JSON.parse(localStorage.getItem('expensesObj'));
    if(this.expenseObjLocal != null){
      this.expenseObj = this.expenseObjLocal;
    } else {
      this.expenseObj = [];
    }
    
    this.budgetObjLocal = localStorage.getItem('budgetAmount');
    if(this.budgetObjLocal != null){
      this.budgetObj = this.budgetObjLocal;
    } else {
      this.budgetObj = '';
    }

  this.loadRows();
  this.loadRowID();
  this.showTotal();
  this.showBalance();
  this.showBudget();
    
  }
  // Generate unique IDs
  uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  // Show numbers on UI
  loadRowID(){
    let rowID = 1;
    this.uiExpensesList.childNodes.forEach(row => {
      row.firstElementChild.innerText = rowID;
      rowID++;
    })
  }

  // Clear input fields
  resetFields(){
    this.description.value = '';
    this.amount.value = '';
    this.formExpenses.querySelectorAll('label').forEach(label => {
      label.classList.remove('active');
    })
  }

  // Show table from object data
  loadRows(){
    let rows = '';
    for(let i = 0; i < this.expenseObj.length; i++) {
      let row = this.expenseObj[i];
      let amount = Number(row.amount).toFixed(2);
      rows += `<tr data-id="${row.id}">
      <td></td>
      <td data-description>${row.description}</td>
      <td data-amount>${amount}</td>
      <td><a class="data-edit blue-text text-accent-4" href="#"><i class="action material-icons prefix">edit</i></a></td>
      <td><a class="data-delete red-text text-accent-4" href="#"><i class="action material-icons prefix">delete</i></a></td>
    </tr>`;
    }
    this.uiExpensesList.innerHTML = rows;
  }

  // Add a new expense into object
  addExpense(){
    if(this.description.value == '' || this.amount.value == '') return false;
    if(isNaN(this.amount.value)) return false;
    let newElement = {}
    this.expenseID = this.uuidv4();
    newElement.id = this.expenseID;
    newElement.description = this.description.value;
    newElement.amount = this.amount.value;
    this.expenseObj.push(newElement);
    this.resetFields();
    this.clickEdit = true;
    return true;
  }

  // Delete a expense from object
  deleteExpense(selectedElement){
    let selectedElementId = selectedElement.getAttribute('data-id');
    this.expenseObj = this.expenseObj.filter((item) => {
      return item.id != selectedElementId;
    })
    return true;
  }

  saveExpenses(){
    localStorage.setItem('expensesObj', JSON.stringify(this.expenseObj));
  }

  addBudget(){
    if(this.budget.value == '' || this.budget.value == 0) return false;
    if(isNaN(this.budget.value)) return false;
    this.budgetObj = this.budget.value;
    return true;
  }

  saveBudget(){
    localStorage.setItem('budgetAmount', this.budgetObj);
  }

  editRow(selectedElement){
    if(this.clickEdit == true){
      this.formExpenses.querySelectorAll('label').forEach(label => {
        label.classList.add('active');
      })
      this.description.value = selectedElement.querySelector('[data-description]').innerText;
      this.amount.value = selectedElement.querySelector('[data-amount]').innerText;
      this.clickEdit = false;
      return true;
    } else {
      return false;
    } 
  }

  showTotal(){
    let total = 0;
    for(let i = 0; i < this.expenseObj.length; i++) {
      let row = this.expenseObj[i];
      total = total+Number(row.amount);
    }
    this.uiExpenses.innerText = Number(total).toFixed(2);
    this.totalExpenses = total;
  }

  showBudget(){
    this.uiBudget.innerText = Number(this.budgetObj).toFixed(2);
    this.budget.value = this.budgetObj;
  }

  showBalance(){
    this.balance = Number(this.budgetObj - this.totalExpenses).toFixed(2);
    this.uiBalance.innerText = this.balance;
  }

  clearLocalStorage(){
    this.expenseObj = [];
    this.totalExpenses = 0;
    this.balance = 0;
    this.budgetObj = '';
    localStorage.clear();
    return true;
  }

  showAlert(color, message){
    this.alertDiv.innerHTML = `<div class="error white-text ${color}">${message}</div>`;
    setTimeout(()=> this.alertDiv.removeChild(this.alertDiv.firstChild), 3000);
  }

  showClearDataAlert(){
    this.clearAllDataDiv.innerHTML = `<div>
      <p>Are you sure? This will permanantly delete all your data. Click "Yes" to proceed.</p>
      <button class="yes btn waves-effect waves-light red" name="yes">Yes
      </button>
      <button class="no btn waves-effect waves-light green" name="no">No
      </button>
      </div>`;
    setTimeout(()=> this.clearAllDataDiv.removeChild(this.clearAllDataDiv.firstChild), 10000);
  }

  
}

function eventListeners(){
  const budget1 = new Budget();

  budget1.formExpenses.addEventListener('submit', (e) => {
    e.preventDefault();
    const addStatus = budget1.addExpense();
    if(addStatus){
      budget1.loadRows();
      budget1.loadRowID();
      budget1.showTotal();
      budget1.showBalance();
      budget1.saveExpenses();
    } else {
      budget1.showAlert('red', 'Amount and Description is required. Amount should be a number.');
    }
  })
  
  budget1.formBudget.addEventListener('submit', (e) => {
    e.preventDefault();
    const budgetStatus = budget1.addBudget();
    if(budgetStatus){
      budget1.showBudget();
      budget1.saveBudget();
      budget1.showBalance();
    } else {
      budget1.showAlert('red', 'Budget is required. Budget should be a number.');
    }
    
  })  

  budget1.uiExpensesList.addEventListener('click', (e) => {
    e.preventDefault();
    if(e.target.parentNode.classList.contains('data-edit')){
      let selectedElement = e.target.parentElement.parentElement.parentElement;
      const editStatus = budget1.editRow(selectedElement);
      const deleteStatus = budget1.deleteExpense(selectedElement);
      if(editStatus && deleteStatus){
        budget1.loadRows();
        budget1.loadRowID();
        budget1.showTotal();
        budget1.showBalance();
      } else {
        budget1.showAlert('orange', 'Please update the current expense first.');
      }
    } else if(e.target.parentNode.classList.contains('data-delete')){
      let selectedElement = e.target.parentElement.parentElement.parentElement;
      const deleteStatus = budget1.deleteExpense(selectedElement);
      if(deleteStatus){ 
        budget1.loadRows();
        budget1.loadRowID();
        budget1.showTotal();
        budget1.showBalance();
        budget1.saveExpenses();
        budget1.showAlert('green', 'Item removed!');
      } else {
        budget1.showAlert('red', 'Something went wrong!');
      }
    }
  })

  budget1.clearAllData.addEventListener('click', (e) => {
    e.preventDefault();
    budget1.showClearDataAlert();
  })

  budget1.clearAllDataDiv.addEventListener('click', (e) => {
    e.preventDefault();
    if(e.target.classList.contains('yes')){
      const clearStatus = budget1.clearLocalStorage();
      if(clearStatus){
        budget1.resetFields();
        budget1.loadRows();
        budget1.loadRowID();
        budget1.showTotal();
        budget1.showBudget();
        budget1.showBalance();
        budget1.showAlert('green', 'All data cleared!');
        e.target.parentNode.remove();
      } else {
        budget1.showAlert('red', 'Something went wrong!');
      }
    } else if(e.target.classList.contains('no')){
      e.target.parentNode.remove();
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  eventListeners();
});