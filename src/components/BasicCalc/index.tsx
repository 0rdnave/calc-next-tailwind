'use client'
import { useEffect, useState } from 'react';
import { Backspace } from 'react-bootstrap-icons';

import { evaluateExpressionSafely, formatInput } from "./utils";

export default function BasicCalc() {

  const [inputValue, setInputValue] = useState('')
  const [buttonValue, setButtonValue] = useState('')
  const [equacao, setEquacao] = useState('')


  const renderGridItems = () => {
    const gridValues = ['%', '/', '*', 'backspace', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', 'c', '0', '.'];
    return gridValues.map((value, index) => {
      let className = "rounded-md py-1 border-1 border-purple-600/25 bg-purple-600/25 flex justify-center items-center";
      if (value === '=') {
        className += " row-span-2";
        return <button onClick={() => handleResult(equacao)} key={index} className={className}>
          =
        </button>
      }
      if (value === 'backspace') {
        return <button onClick={() => handleBackspace()} key={index} className={className}>
          <Backspace />
        </button>
      }
      return (
        <button onClick={e => {
          if (e.currentTarget.textContent === 'c') return updateValues('')

          e.currentTarget.textContent && setButtonValue(e.currentTarget.textContent)
        }

        } key={index} className={className} >
          {value}
        </button >
      );
    });
  };

  const handleResult = (values: string) => {
    const result = evaluateExpressionSafely(values)?.toString() || ''

    updateValues(result)
  }

  /* WIP - tratar sequencia de caracteres matemáticos */
  // const handleSum = (value: string) => {
  //   setButtonValue(value)
  // }
  // const handleSub = (value: string) => {
  //   setButtonValue(value)
  // }
  // const handleMult = (value: string) => {
  //   setButtonValue(value)
  // }
  // const handleDiv = (value: string) => {
  //   setButtonValue(value)
  // }

  /* WIP - criar função de conversão de porcentagem */
  // const handlePerc = (value: string) => {
  //   setButtonValue(value)
  // }

  const updateValues = (value: string) => {
    const newValue = value.length > 0 && value[0] === '0' ? value.slice(1, undefined) : value

    setEquacao(newValue)
    setInputValue(newValue !== '' ? formatInput(newValue) : '0')
  }

  const handleBackspace = () => {
    const temp = isNaN(parseInt(buttonValue)) ? equacao.slice(0, -1) : equacao.slice(0, -2)
    updateValues(temp)
  }

  useEffect(() => {
    let newValue = equacao

    if (buttonValue !== '') {
      newValue = equacao + buttonValue
      setButtonValue('')
    }

    updateValues(newValue)
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