'use client'
import { useEffect, useState } from 'react';

import { Backspace } from 'react-bootstrap-icons';
import { evaluateExpressionSafely, formatInput } from "./utils";

export default function BasicCalc() {

  const [inputValue, setInputValue] = useState('0')
  const [buttonValue, setButtonValue] = useState('')
  const [equacao, setEquacao] = useState('')

  const createButton = (value: string, className: string, handleButton?: () => void) => {
    return <button
      onClick={handleButton
        ? (handleButton)
        : (e) => e.currentTarget.textContent && setButtonValue(e.currentTarget.textContent)}
      key={value}
      className={className}
    >
      {value === 'backspace'
        ? <Backspace />
        : value}
    </button>
  }

  const renderGridItems = () => {
    const gridValues = ['%', '/', '*', 'backspace', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', 'C', '0', '.'];
    return gridValues.map((value) => {
      let className = "rounded-md py-1 border-1 border-purple-600/25 bg-purple-600/25 flex justify-center items-center";

      switch (value) {
        case '/':
        case '*':
        case '+':
          return createButton(value, className, () => handleMaths(value))
        case '-':
          return createButton(value, className, () => handleSub(value))
        case 'C':
          return createButton(value, className, () => updateValues(''))
        case 'backspace':
          return createButton(value, className, () => handleBackspace())
        case '%':
          return createButton(value, className, () => handlePerc(equacao))
        case '=':
          className += " row-span-2";
          return createButton(value, className, () => handleResult(equacao))
        default:
          return createButton(value, className)
      }
    });
  };

  const handleResult = (values: string) => {
    const result = evaluateExpressionSafely(values)?.toString() || ''

    updateValues(result)
  }

  const handleMaths = (value: string) => {
    const lastChar = equacao[equacao.length - 1]
    const maths = ['/', '*', '+', '-']

    if (lastChar === value) return
    if (maths.includes(lastChar)) {
      return updateValues(equacao.slice(0, -1) + value);
    }
    return setButtonValue(value)
  }
  const handleSub = (value: string) => {
    const lastChar = equacao[equacao.length - 1]
    const penultChar = equacao[equacao.length - 2]
    const maths = ['/', '*', '+', '-']

    if (lastChar === value && penultChar === '-') return
    if (maths.includes(lastChar)) {
      if (penultChar !== value) return setButtonValue(value)
      return updateValues(equacao.slice(0, -1) + value);
    }
    return setButtonValue(value)
  }


  const handlePerc = (value: string) => {
    const lastChar = equacao[equacao.length - 1]
    const maths = ['/', '*', '+', '-'];
    let lastIndex = -1;

    if (buttonValue === '%' || maths.includes(lastChar)) return

    for (let i = 0; i < value.length; i++) {
      if (maths.includes(value[i])) {
        lastIndex = i;
      }
    }

    const percent = parseInt(value.slice(lastIndex + 1)) / 100
    console.log("🚀 ~ calcPercent:", percent)
    console.log("🚀 ~ equacao.slice(lastIndex, -1) + value:", equacao.slice(0, lastIndex + 1) + percent)

    setButtonValue('%')
    updateValues(equacao.slice(0, lastIndex + 1) + percent)
    return
  }

  const updateValues = (value: string) => {
    const newValue = value.length > 0 && value[0] === '0' ? value.slice(1) : value
    setEquacao(newValue)
    setInputValue(newValue !== '' ? formatInput(newValue) : '0')
  }

  const handleBackspace = () => {
    updateValues(equacao.slice(0, -1))
  }

  useEffect(() => {
    let newValue = equacao
    if (buttonValue !== '' && buttonValue !== '%') {
      newValue = equacao + buttonValue
      setButtonValue('')
      updateValues(newValue)
    }
  }, [buttonValue])


  return (
    <div className="bg-purple-400 rounded-lg px-2 pt-2 pb-4 space-y-6">
      <div className="flex align-middle h-16 text-xl bg-purple-400">
        <input readOnly={true} className=' px-2 text-red-600  rounded-t-lg rounded-b-md text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-900' type="text" value={inputValue} onChange={e => setInputValue(e.currentTarget.value)} />
      </div>
      <div>
        <div className="text-base grid grid-cols-4 grid-rows-5 gap-4">
          {renderGridItems()}
        </div>
      </div>
    </div>
  )
}