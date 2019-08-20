import React, {Component} from 'react'
import './Calculator.css'
import Button from '../components/Button'
import Display from '../components/Display'

const initialState = {
    displayValue: '0',
    clearDisplay: false,
    operation: null,
    values: [0, 0],
    current: 0
}

export default class Calculator extends Component {

    state = { ...initialState }

    constructor(props) {
        super(props)

        this.clearMemory = this.clearMemory.bind(this)
        this.setOperation = this.setOperation.bind(this)
        this.addDigit = this.addDigit.bind(this)
    }

    clearMemory() {
        console.log("limpar");
    }

    setOperation(operation) {
        // se estivermos trabalhando no primeiro valor...
        if (this.state.current === 0) {
            // usando desconstructing, definimos o estado da seguinte maneira
            this.setState({operation, current: 1, clearDisplay: true})
        } else {
            // se eu digitar um operador e o valor corrente não for 0, ele executa isso: 
            const equals = operation === '=' // variavel boolean
            const currentOperation = this.state.operation
            const values = [...this.state.values]

            // usar try catch, porque o eval não é confiável, fazer depois com switch/case
            try {
                // antes de definir o novo valor de estado para os values, o value 0 recebe o cálculo dos dois números digitados
                values[0] = eval(`${values[0]} ${currentOperation} ${values[1]}`)
            } catch {
                // caso dê errado, o valor se mantém no valor atual do estado
                values[0] = this.state.values[0]
            }

            values[1] = 0

            this.setState({
                displayValue: values[0],
                operation: equals ? null : operation,
                current: equals ? 0 : 1,
                clearDisplay: !equals,
                values
            })
        }
    }

    addDigit(n) {
        // Se o usuário digitar ponto e já existir um ponto na tela, ele ignora, pois não pode haver dois pontos
        if ((n === '.') && this.state.displayValue.includes('.')) return

        // A tela será limpa em dois momentos, quando a tela exibir 0 ou quando o estado de clearDisplay for true. Ela será setada como true quando clicarmos no operador
        const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay;

        // Se eu limpar o display, o valor atual será vazio, se não, ele recebe o valor do display
        const currentValue = clearDisplay ? '' : this.state.displayValue

        // o novo valor do display recebe o valor atual mais o n, que é o valor digitado
        const displayValue = currentValue + n

        // Para mudar o estado da aplicação, definimos o novo valor do display e definimos clearDisplay como falso, pois ele não limpa quando digitamos o novo valor. Toda vez que digitar um valor, clearDisplay será falso.
        this.setState({displayValue, clearDisplay: false})

        if (n !== '.') {
            const i = this.state.current
            const newValue = parseFloat(displayValue)
            const values = [...this.state.values]
            values[i] = newValue
            this.setState({values})
        }

        // obs: em ambos os setState, está sendo usado a desconstrução (variável com mesmo nome da propriedade do objeto), por isso que só precisamos colocar uma vez, exemplo: this.setState({values: values})
    }

    render() {

        const addDigit = n => this.addDigit(n)
        const setOperation = op => this.setOperation(op)

        return (
            <div className="calculator">
                <Display value={this.state.displayValue} />
                <Button label="AC" click={this.clearMemory} triple />
                <Button label="/" click={this.setOperation} operation />
                <Button label="7" click={this.addDigit} />
                <Button label="8" click={this.addDigit} />
                <Button label="9" click={this.addDigit} />
                <Button label="*" click={this.setOperation} operation />
                <Button label="4" click={this.addDigit} />
                <Button label="5" click={this.addDigit} />
                <Button label="6" click={this.addDigit} />
                <Button label="-" click={this.setOperation} operation />
                <Button label="1" click={this.addDigit} />
                <Button label="2" click={this.addDigit} />
                <Button label="3" click={this.addDigit} />
                <Button label="+" click={this.setOperation} operation />
                <Button label="0" click={this.addDigit} double />
                <Button label="." click={this.setOperation} operation />
                <Button label="=" click={this.setOperation} operation />
            </div>
        )
    }
}