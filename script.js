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

// const transaction = 

// Eu preciso somar as entradas 
// depois eu preciso somar as Saídas e
// remover das entradas o valor das saídas
// assim, eu terei o total

const Transaction = {
  all: [
    {
      description: 'Luz',
      amount: -50000,
      date: '23/01/2021',
    },
    {
      description: 'Website',
      amount: 500000,
      date: '23/01/2021',
    },
    {
      description: 'Internet',
      amount: -20000,
      date: '23/01/2021',
    },
    {
      id: 4,
      description: 'APP',
      amount: 200000,
      date: '23/01/2021',
    },
  ],

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
    tr.innerHTML = DOM.innerHTMLTransaction(transaction)

    DOM.transactionContainer.appendChild(tr)
  },
  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `  
    <td class="description">${transaction.description}</td>
    <td class="${CSSclass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td>
      <img src="./assets/minus.svg" alt="Remover transação">
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
  }
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

  submit(event) {
    event.preventDefault()

    try {
      // verificar se todas as informações foram preenchidas
      Form.validateFields()
      // formatar os dados para Salvar
      Form.formatData()
      // salvar
      // apagaro os dados do formulário
      // modal feche
      // atualizar a aplicação
    } catch (error) {
      alert(error.message)
    }
  },

}
const App = {
  init() {

    Transaction.all.forEach(transaction => {
      DOM.addTransaction(transaction)
    })

    DOM.updateBalance()

  },
  reload() {
    DOM.clearTransactions()
    App.init()
  },
}

App.init()

