import React, { useState } from 'react'
import { Switch } from '@headlessui/react'
import { CheckIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import Link from 'next/link'
import process from 'process'
import url from '../utils/server.js'

const Home = () => {

  const router = useRouter()

  const [valencia, setValencia] = useState(false);
  const [euskadi, setEuskadi] = useState(false);
  const [catalunya, setCatalunya] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const selectedProvinces = {
    v: valencia ? 1 : 0,
    e: euskadi ? 1 : 0,
    c: catalunya ? 1 : 0,
  }

  const clearFilters = () => {
    setValencia(false)
    setEuskadi(false)
    setCatalunya(false)
  }

  const selectAll = () => {
    setValencia(true)
    setEuskadi(true)
    setCatalunya(true)
  }

  function someSelected() {
    for (var key in selectedProvinces) {
        if (selectedProvinces[key] !== 0)
            return true;
    }
    return false;
}

  const sendParams = async () => {
    setIsLoading(true)

    try {
      await fetch(`${url}/api/cargaAlmacenDatos?lh=0&v=${selectedProvinces.v}&e=${selectedProvinces.e}&c=${selectedProvinces.c}`)
      .then(response => response.json())
      .then(response => handleSubmit(response))
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }

  }

  const handleSubmit = (response) => {
    if (response.status === 1) {
      window.localStorage.removeItem('db')
      window.localStorage.setItem('db', response.select)
      router.push('/search')
    }
  }

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-start justify-start rounded-2xl bg-white shadow-lg overflow-hidden">

          <div className="space-y-8 m-10">
            <div className="flex flex-col">
              <h1 className="text-3xl font-medium">Carga de bibliotecas</h1>
              <h2 className="text-base text-gray-400">Selecciona las fuentes</h2>
            </div>

            {/* FORM */}
            <div className="flex flex-col items-start space-y-3">
              <Switch
                checked={valencia}
                onChange={setValencia}
                disabled={isLoading || process.env.NODE_ENV !== 'development'}
                className={`${isLoading && 'cursor-not-allowed'} group flex flex-row items-center justify-start space-x-2`}
              >
                <div
                  className={`${valencia ? 'bg-indigo-500 border-indigo-500' : 'bg-gray-100 border-gray-300 group-hover:border-gray-400 active:bg-gray-200'} flex flex-col items-center justify-center text-white border w-6 h-6 rounded transition-colors ease-in-out duration-100`}
                >
                  <CheckIcon className={`${valencia ? 'scale-100' : 'scale-50 translate-y-1.5 opacity-0'} w-5 h-5 transform transition ease-in-out duration-100`} aria-hidden="true" />
                </div>
                <span className="">Valencia</span>
                <abbr title={`${process.env.NODE_ENV !== 'development' ? 'Esta opción está deshabilitada en producción ya que Selenium no funciona desde lado servidor (sí funciona en local)' : 'La localización de las bibliotecas se cargará mediante Selenium (esto puede llevar desde unos segundos a unos pocos minutos)'}`}>
                  <QuestionMarkCircleIcon className="w-5 h-5 text-gray-300 cursor-help" aria-hidden="true" />
                </abbr>
              </Switch>

              <Switch
                checked={euskadi}
                onChange={setEuskadi}
                disabled={isLoading}
                className={`${isLoading && 'cursor-not-allowed'} group flex flex-row items-center justify-start space-x-2`}
              >
                <div
                  className={`${euskadi ? 'bg-indigo-500 border-indigo-500' : 'bg-gray-100 border-gray-300 group-hover:border-gray-400 active:bg-gray-200'} flex flex-col items-center justify-center text-white border w-6 h-6 rounded transition-colors ease-in-out duration-100`}
                >
                  <CheckIcon className={`${euskadi ? 'scale-100' : 'scale-50 translate-y-1.5 opacity-0'} w-5 h-5 transform transition ease-in-out duration-100`} aria-hidden="true" />
                </div>
                <span className="">Euskadi</span>
              </Switch>

              <Switch
                checked={catalunya}
                onChange={setCatalunya}
                disabled={isLoading}
                className={`${isLoading && 'cursor-not-allowed'} group flex flex-row items-center justify-start space-x-2`}
              >
                <div
                  className={`${catalunya ? 'bg-indigo-500 border-indigo-500' : 'bg-gray-100 border-gray-300 group-hover:border-gray-400 active:bg-gray-200'} flex flex-col items-center justify-center text-white border w-6 h-6 rounded transition-colors ease-in-out duration-100`}
                >
                  <CheckIcon className={`${catalunya ? 'scale-100' : 'scale-50 translate-y-1.5 opacity-0'} w-5 h-5 transform transition ease-in-out duration-100`} aria-hidden="true" />
                </div>
                <span className="">Cataluña</span>
              </Switch>

              <button
                onClick={() => { selectAll() }}
                disabled={isLoading}
                className={`${isLoading && 'cursor-not-allowed'} text-indigo-500 active:text-indigo-600`}
              >
                Seleccionar todas
              </button>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2">
              <button
                onClick={() => {!isLoading && someSelected() && sendParams()}}
                className={`${isLoading && 'cursor-wait bg-indigo-600 text-indigo-100'} flex flex-row w-full items-center justify-center bg-indigo-500 active:bg-indigo-600 rounded-lg text-white font-medium px-5 h-10 transition-colors ease-in-out duration-50`}
              >
                <span>{isLoading ? 'Cargando' : 'Cargar'}</span>
                <div className={`${isLoading ? 'w-5 ml-4' : 'opacity-0 w-0'} relative h-5 transition-all ease-in-out duration-100`} >
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </button>

              <button
                onClick={() => {!isLoading && clearFilters()}}
                className={`${isLoading ? 'cursor-not-allowed bg-gray-100 active:bg-gray-200 text-gray-600' : 'bg-indigo-50 active:bg-indigo-100 text-indigo-500 active:text-indigo-600'} flex flex-row w-full items-center justify-center rounded-lg px-5 h-10 transition-colors ease-in-out duration-50`}
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          <Link href={`/search`} passHref>
            <a className="flex flex-row items-center justify-center bg-gray-50 w-full h-14 px-10 rounded-b-2xl border-t border-gray-200 text-base font-mediun text-gray-600 active:text-gray-800 cursor-pointer">
              <span>Acceder a la búsqueda</span>
            </a>
          </Link>

        </div>
      </div>
    </>
  )
};

export default Home;