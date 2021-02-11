const Modal = {
  open() {
    //Abrir Modal
    //Adicionar a classe active ao modal
    document
      .querySelector('.modal-overlay')
      .classList
      .add('active')
  },
  close() {
    //fechar o modal
    document
      .querySelector('.modal-overlay')
      .classList
      .remove('active')
  }
  // Função Toggle
  // toggle(){
  //   document
  //    .querySelector('.modal-overlay')
  //    .classList
  //    .toggle('active')
  // }
}

const Storage = {
  get() {
   return JSON.parse(localStorage.getItem("dev.finances:transactions"))||[]
   },
  set(transaction) { 
    localStorage.setItem("dev.finances:Transaction",JSON.stringify(transaction))
  },
}

// const transaction = 

// Eu preciso somar as entradas 
// depois eu preciso somar as Saídas e
// remover das entradas o valor das saídas
// assim, eu terei o total

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)
    App.reload()
  },
  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    let income = 0;
    // pegar todas as trasações
    // para cada transação,
    Transaction.all.forEach(transaction => {
      // se ela for maior que zero
      if (transaction.amount > 0) {
        // somar a uma variável e retornar a variável
        income += transaction.amount
      }
    })
    return income;
  },

  expenses() {
    let expenses = 0;
    // pegar todas as trasações
    // para cada transação,
    Transaction.all.forEach(transaction => {
      // se ela for menor que zero
      if (transaction.amount < 0) {
        // somar a uma variável e retornar a variável
        expenses += transaction.amount
      }
    })
    return expenses
  },

  total() {
    return Transaction.incomes() + Transaction.expenses()
  }
}

// Substituir os dados do HTML com os dados do JS

const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    console.log(transaction)
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionContainer.appendChild(tr)
  },
  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `  
    <td class="description">${transaction.description}</td>
    <td class="${CSSclass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td>
      <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
    </td>  
    `
    return html
  },
  updateBalance() {
    document
      .querySelector('#incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document
      .querySelector('#expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document
      .querySelector('#totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())
  },
  clearTransactions() {
    DOM.transactionContainer.innerHTML = ""
  }
}

const Utils = {
  formatAmount(value) {
    // value = Number(value.replace(/\,\./g, "")) * 100
    value = Number(value) * 100
    return value
  },
  formatDate(date) {
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""
    // regex
    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
    return signal + value
  },

}

const Form = {
  description: document.querySelector('#description'),
  amount: document.querySelector('#amount'),
  date: document.querySelector('#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    }
  },
  formatData() {

    console.log('Formatar os dados')
  },

  validateFields() {
    const { description, amount, date } = Form.getValues()
    if (description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === "") {
      throw new Error("Por favor, preencha todos os campos")
    }
  },
  formatValues() {
    let { description, amount, date } = Form.getValues()
    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)
    //console.log(date)

    return {
      description,
      amount,
      date
    }
  },
  saveTransaction(transaction) {
    Transaction.add(transaction)
  },
  clearFields() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },
  submit(event) {
    event.preventDefault()

    try {
      // verificar se todas as informações foram preenchidas
      Form.validateFields()
      // formatar os dados para Salvar
      const transaction = Form.formatValues()
      // salvar
      Form.saveTransaction(transaction)
      // apagaro os dados do formulário
      Form.clearFields()
      // modal feche
      Modal.close()
    } catch (error) {
      alert(error.message)
    }
  },

}

const App = {
  init() {

    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index)
    })

    DOM.updateBalance()
    
    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  },
}

App.init()

