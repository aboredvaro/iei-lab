import React, { useState, useEffect, Fragment } from 'react'
import { Listbox, Transition, Dialog } from '@headlessui/react'
import { CheckIcon, SelectorIcon, ChevronLeftIcon, DatabaseIcon } from '@heroicons/react/solid'
import { ViewListIcon, MapIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'
import MapContainer from '../components/map'
import url from '../utils/server.js'

const Search = ({
  localidades,
  codigoPostal,
  provincia,
  tipo,
  bibliotecas,
}) => {

  const [results, setResults] = useState(bibliotecas)
  const [db, setDB] = useState([])
  
  useEffect(() => {
    const dbLS = window.localStorage.getItem('db')
    if (dbLS) setDB(dbLS.split(','))
  }, [results]);
  
  
  const router = useRouter()

  const [viewList, setViewList] = useState(true)

  const [localidadSeleccionada, setLocalidadSeleccionada] = useState(null)
  const [codigoPostalSeleccionado, setCodigoPostalSeleccionado] = useState(null)
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null)
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null)

  const [isLoading, setIsLoading] = useState(false);

  const [detailsIsOpen, setDetailsIsOpen] = useState(false)
  const [detailInfo, setDetailInfo] = useState(null)

  function closeDetails() {
    setDetailsIsOpen(false)
  }
  function showDetails(details) {
    setDetailInfo(details)
    setDetailsIsOpen(true)
    // console.log(details)
  }
  
  const clearFilters = () => {
    setLocalidadSeleccionada(null)
    setCodigoPostalSeleccionado(null)
    setProvinciaSeleccionada(null)
    setTipoSeleccionado(null)

    setResults(bibliotecas)
    // console.log(bibliotecas)
  }
  const someSelected = () => {
    return localidadSeleccionada !== null ||
    codigoPostalSeleccionado !== null ||
    provinciaSeleccionada !== null ||
    tipoSeleccionado !== null
  }

  const applyFilters = async () => {
    setIsLoading(true)

    const filters = []

    if (localidadSeleccionada !== null) {
      filters.push(`lc=${localidadSeleccionada.localidad}`)
    }
    if (codigoPostalSeleccionado !== null) {
      filters.push(`cp=${codigoPostalSeleccionado.codigoPostal}`)
    }
    if (provinciaSeleccionada !== null) {
      filters.push(`pr=${provinciaSeleccionada.provincia}`)
    }
    if (tipoSeleccionado !== null) {
      filters.push(`tp=${tipoSeleccionado.tipo}`)
    }

    const query = filters.join("&")

    // console.log(`${url}/api/cargaBuscador${query}`)

    try {
      await fetch(`${url}/api/cargaBuscador?${query}`)
      .then(response => response.json())
      // .then(response => { console.log(response) })
      .then(response => { setResults(response); console.log(response); })
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }

  }
  
  const containerStyle = {
    position: 'relative',
    width: '600px',
    height: '400px'
  }

  const center = {
		lat: 40.416578,
		lng: -3.704297
	}

  return (
    <>
      <div className="w-full h-full min-h-screen max-h-screen flex flex-row items-stretch justify-start bg-gray-50 overflow-hidden">

        {/* FILTROS */}
        <div className="flex flex-col flex-shrink-0 items-start justify-start p-20 pr-0 space-y-8 whitespace-nowrap overflow-auto">

          <div className="flex flex-col">
            <Link href={`/`} passHref>
              <a className="flex flex-row items-center justify-left text-lg text-indigo-500 active:text-indigo-600 mb-2 cursor-pointer space-x-0.5">
                <ChevronLeftIcon className="w-6 h-6" aria-hidden="true" />
                <span>Volver a carga de datos</span>
              </a>
            </Link>
            <h1 className="text-3xl font-medium inline-block">Búsqueda de Bibliotecas</h1>
            <h2 className="text-base text-gray-400">Seleccionar flitros</h2>
          </div>

          <div className="flex flex-col items-start space-y-6">

            {/* Vista de lista/mapa */}
            <div className="flex flex-row w-full rounded-lg bg-white shadow-md">
              <button
                onClick={() => { !viewList && setViewList(true) }}
                className={`${viewList ? 'bg-indigo-50 text-indigo-600 ring-2 ring-indigo-400 font-medium' : 'text-gray-600'} flex flex-row flex-1 items-center justify-center px-6 h-10 rounded-lg space-x-2`}
              >
                <ViewListIcon className="w-5 h-5" aria-hidden="true" />
                <span>Lista</span>
              </button>
              <button
                onClick={() => { viewList && setViewList(false) }}
                className={`${!viewList ? 'bg-indigo-50 text-indigo-600 ring-2 ring-indigo-400 font-medium' : 'text-gray-600'} flex flex-row flex-1 items-center justify-center px-6 h-10 rounded-lg space-x-2`}
              >
                <MapIcon className="w-5 h-5" aria-hidden="true" />
                <span>Mapa</span>
              </button>
            </div>

            {/* Lista de localidades */}
            <div className="flex flex-col space-y-1">
              <span className="font-medium">Localidad</span>

              <Listbox value={localidadSeleccionada} onChange={setLocalidadSeleccionada}>
                <div className="relative mt-1">
                  <Listbox.Button className={`${localidadSeleccionada ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-white'} relative w-72 py-2 pl-4 pr-10 text-left rounded-lg shadow-md cursor-default outline-none`}>
                    <span className={`${localidadSeleccionada && 'font-medium text-indigo-600'} block truncate`}>{localidadSeleccionada ? localidadSeleccionada.localidad : 'Selecciona una localidad'}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon
                        className={`${localidadSeleccionada ? 'text-indigo-600' : 'text-gray-400'} w-5 h-5`}
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-lg shadow-lg max-h-60 ring-0 focus:outline-none outline-none z-10">
                      {localidades.map((item, itemID) => (
                        <Listbox.Option
                          key={itemID}
                          className={({ active }) =>
                            `${active ? 'text-indigo-900 bg-indigo-100' : 'text-gray-900'}
                                  cursor-default select-none relative py-2 pl-10 pr-4`
                          }
                          value={item}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`${
                                  selected ? 'font-medium' : 'font-normal'
                                } block truncate`}
                              >
                                {item.localidad}
                              </span>
                              {selected ? (
                                <span className="text-indigo-600 absolute inset-y-0 left-0 flex items-center pl-3">
                                  <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* Lista de código postal */}
            <div className="flex flex-col space-y-1">
              <span className="font-medium">Código postal</span>

              <Listbox value={codigoPostalSeleccionado} onChange={setCodigoPostalSeleccionado}>
                <div className="relative mt-1">
                  <Listbox.Button className={`${codigoPostalSeleccionado ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-white'} relative w-72 py-2 pl-4 pr-10 text-left rounded-lg shadow-md cursor-default outline-none`}>
                    <span className={`${codigoPostalSeleccionado && 'font-medium text-indigo-600'} block truncate`}>{codigoPostalSeleccionado ? codigoPostalSeleccionado.codigoPostal : 'Selecciona un código postal'}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon
                        className={`${codigoPostalSeleccionado ? 'text-indigo-600' : 'text-gray-400'} w-5 h-5`}
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-lg shadow-lg max-h-60 ring-0 focus:outline-none outline-none z-10">
                      {codigoPostal.map((item, itemID) => (
                        <Listbox.Option
                          key={itemID}
                          className={({ active }) =>
                            `${active ? 'text-indigo-900 bg-indigo-100' : 'text-gray-900'}
                                  cursor-default select-none relative py-2 pl-10 pr-4`
                          }
                          value={item}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`${
                                  selected ? 'font-medium' : 'font-normal'
                                } block truncate`}
                              >
                                {item.codigoPostal}
                              </span>
                              {selected ? (
                                <span className="text-indigo-600 absolute inset-y-0 left-0 flex items-center pl-3">
                                  <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* Lista de provincias */}
            <div className="flex flex-col space-y-1">
              <span className="font-medium">Provincia</span>

              <Listbox value={provinciaSeleccionada} onChange={setProvinciaSeleccionada}>
                <div className="relative mt-1">
                  <Listbox.Button className={`${provinciaSeleccionada ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-white'} relative w-72 py-2 pl-4 pr-10 text-left rounded-lg shadow-md cursor-default outline-none`}>
                    <span className={`${provinciaSeleccionada && 'font-medium text-indigo-600'} block truncate`}>{provinciaSeleccionada ? provinciaSeleccionada.provincia : 'Selecciona una provincia'}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon
                        className={`${provinciaSeleccionada ? 'text-indigo-600' : 'text-gray-400'} w-5 h-5`}
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-lg shadow-lg max-h-60 ring-0 focus:outline-none outline-none z-10">
                      {provincia.map((item, itemID) => (
                        <Listbox.Option
                          key={itemID}
                          className={({ active }) =>
                            `${active ? 'text-indigo-900 bg-indigo-100' : 'text-gray-900'}
                                  cursor-default select-none relative py-2 pl-10 pr-4`
                          }
                          value={item}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`${
                                  selected ? 'font-medium' : 'font-normal'
                                } block truncate`}
                              >
                                {item.provincia}
                              </span>
                              {selected ? (
                                <span className="text-indigo-600 absolute inset-y-0 left-0 flex items-center pl-3">
                                  <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            {/* Lista de provincias */}
            <div className="flex flex-col space-y-1">
              <span className="font-medium">Tipo</span>

              <Listbox value={tipoSeleccionado} onChange={setTipoSeleccionado}>
                <div className="relative mt-1">
                  <Listbox.Button className={`${tipoSeleccionado ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-white'} relative w-72 py-2 pl-4 pr-10 text-left rounded-lg shadow-md cursor-default outline-none`}>
                    <span className={`${tipoSeleccionado && 'font-medium text-indigo-600'} block truncate`}>{tipoSeleccionado ? tipoSeleccionado.tipo : 'Selecciona un tipo'}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon
                        className={`${tipoSeleccionado ? 'text-indigo-600' : 'text-gray-400'} w-5 h-5`}
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-lg shadow-lg max-h-60 ring-0 focus:outline-none outline-none z-10">
                      {tipo.map((item, itemID) => (
                        <Listbox.Option
                          key={itemID}
                          className={({ active }) =>
                            `${active ? 'text-indigo-900 bg-indigo-100' : 'text-gray-900'}
                                  cursor-default select-none relative py-2 pl-10 pr-4`
                          }
                          value={item}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`${
                                  selected ? 'font-medium' : 'font-normal'
                                } block truncate`}
                              >
                                {item.tipo}
                              </span>
                              {selected ? (
                                <span className="text-indigo-600 absolute inset-y-0 left-0 flex items-center pl-3">
                                  <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            

            <button
              onClick={() => { clearFilters() }}
              disabled={isLoading}
              className={`${isLoading && 'cursor-not-allowed'} text-indigo-500`}
            >
              Borrar filtros
            </button>

            <button
              onClick={() => {!isLoading && someSelected() && applyFilters()}}
              className={`${isLoading && 'cursor-wait bg-indigo-600 text-indigo-100'} w-full flex flex-row items-center justify-center bg-indigo-500 active:bg-indigo-600 rounded-lg text-white font-medium px-5 h-10 transition-colors ease-in-out duration-50`}
            >
              <span>{isLoading ? 'Cargando' : 'Aplicar filtros'}</span>
              <div className={`${isLoading ? 'w-5 ml-4' : 'opacity-0 w-0'} relative h-5 transition-all ease-in-out duration-100`} >
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </button>
          </div>

        </div>

        {/* RESULTADOS */}
        <div className="relative flex flex-col w-full items-start justify-start m-20 bg-white rounded-2xl shadow border border-gray-100 overflow-auto">
          
          <div className="sticky top-0 left-0 w-full backdrop-filter backdrop-blur-xl bg-white bg-opacity-80 border-b-2 border-gray-100">
            <div className="relative flex flex-row items-center justify-between h-20 px-8">
              <span className="text-xl">{results.length} Resultados</span>

              <abbr
                title={`Datos recopilados de las bases de datos: ${db.join(', ')}`}
                className="flex flex-row items-center text-base text-gray-400 cursor-help"
              >
                <span>{db.length} Bases de datos</span>
                <DatabaseIcon className="w-4 h-4 ml-1 mt-0.5" aria-hidden="true" />
              </abbr>
            </div>
          </div>
          
          {/* LISTA */}
          {viewList && (results.length === 0 ?
            <>
              <div className="flex flex-col w-full h-full items-center justify-center">
                <span className="flex flex-col items-center justify-center px-6 h-10 bg-gray-100 text-gray-500 rounded-xl">No hay resultados para esta búsqueda</span>
              </div>
            </>
            :
            <>
              <div className="flex flex-col flex-shrink-0 w-full h-full divide-y divide-gray-100 p-4">
                {results.map(item => (
                  <>
                    <div
                      key= {item.direccion}
                      onClick={() => { showDetails(item) }}
                      className="group flex flex-col flex-shrink-0 items-start justify-center hover:bg-indigo-50 h-24 px-4 rounded-xl transition ease-in-out duration-150 cursor-pointer"
                    >
                      <span className="text-lg font-medium group-hover:text-indigo-600 transition ease-in-out duration-150">{item.nombre}</span>
                      <div className="flex flex-row items-center text-gray-400 space-x-2">
                        <span>{item.direccion}</span>
                        <span className="font-black">·</span>
                        <span>{item.provincia}</span>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </>
          )}

          {/* MAPA */}
          {!viewList && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <MapContainer
                containerStyle={containerStyle}
                center={center}
                zoom={5.5}
                results={results}
                showDetails= {showDetails}
              />
            </div>
          )}
        </div>

        {/* HOJA DE DETALLES */}
        <Transition appear show={detailsIsOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeDetails}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-80 cursor-pointer" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-3xl p-10 py-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl space-y-10">
                  
                  <Dialog.Title
                    as="h3"
                    className="flex flex-col"
                  >
                    <span className="text-gray-400 uppercase mb-1">Ficha biblioteca</span>
                    <span className="text-4xl font-semibold text-indigo-600">{detailInfo && (detailInfo.nombre ?? 'Sin nombre')}</span>
                  </Dialog.Title>

                  <div className="flex flex-col space-y-8">

                  <div className="flex flex-col">
                      <span className="font-medium text-xl mb-1">Tipo de biblioteca</span>
                      <span>
                        {detailInfo && (detailInfo.tipo ?? <span className="text-gray-400">(Sin tipo de biblioteca)</span>)}
                      </span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="font-medium text-xl mb-1">Localización</span>
                      <span>
                        {detailInfo && (detailInfo.provincia ?? <span className="text-gray-400">(Sin provincia)</span>)}, {detailInfo && (detailInfo.localidad ?? <span className="text-gray-400">(Sin localidad)</span>)}{' '}
                        <span className="text-gray-400">({detailInfo && (detailInfo.codigoPostal ?? <span className="text-gray-400">(Sin código postal)</span>)})</span>
                      </span>
                      <span>
                        {detailInfo && (detailInfo.direccion ?? <span className="text-gray-400">(Sin dirección)</span>)}
                      </span>
                      <span>
                        Longitud: {detailInfo && (detailInfo.longitud ?? <span className="text-gray-400">(Sin longitud)</span>)}, Latitud: {detailInfo && (detailInfo.latitud ?? <span className="text-gray-400">(Sin latitud)</span>)}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-medium text-xl mb-1">Contacto</span>
                      <span>
                        {detailInfo && (detailInfo.telefono ?? <span className="text-gray-400">(Sin teléfono)</span>)}
                      </span>
                      <span>
                        {detailInfo && (detailInfo.email ?? <span className="text-gray-400">(Sin correo)</span>)}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-medium text-xl mb-1">Más info</span>
                      <span>
                        {detailInfo && (detailInfo.descripcion ?? <span className="text-gray-400">(Sin descripción)</span>)}
                      </span>
                    </div>

                  </div>

                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

      </div>
    </>
  )
};

export async function getServerSideProps(ctx) {

	const localidades = await fetch(`${url}/api/cargaLocalidad`)
	 	.then(response => response.json())

	const codigoPostal = await fetch(`${url}/api/cargaCodigoPostal`)
	 	.then(response => response.json())

	const provincia = await fetch(`${url}/api/cargaProvincia`)
	 	.then(response => response.json())

  const tipo = await fetch(`${url}/api/cargaTipo`)
	 	.then(response => response.json())

  const bibliotecas = await fetch(`${url}/api/cargaBuscador`)
	 	.then(response => response.json())

	return {
		props: {
			localidades,
      codigoPostal,
      provincia,
      tipo,
      bibliotecas,
		}
	}

}

export default Search;