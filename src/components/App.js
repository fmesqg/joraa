import "./App.css";
import Ato from "./Ato";
import Filter from "./Filter";
import { buildSearchQueryUrl, buildAtoFetchUrl } from "../api/api";
import { useState, useRef } from "react";
import { SixDotsRotate } from "react-svg-spinners";

function App() {
  const [atos, setAtos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [moreResults, setMoreResults] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const [currentData, setCurrentData] = useState({});

  const page = useRef(1);
  const pageSize = 500;

  async function filterPage(formData) {
    setIsLoading(true);

    const response = await fetch(
      buildSearchQueryUrl(formData, page.current, pageSize)
    );
    const data = await response.json();

    if (data.resultSize === 0) {
      setIsLoading(false);
      if (page.current === 1) setNoResults(true);
      return;
    }

    if (formData.montante === "") {
      for (let atoMeta of data.list) {
        setAtos((prevAtos) => [
          ...prevAtos,
          {
            id: atoMeta.id,
            humanId: atoMeta.humanId,
            entidades: atoMeta.entidades,
            sumario: atoMeta.sumario,
          },
        ]);
      }
    } else {
      for (let atoMeta of data.list) {
        const res = await fetch(buildAtoFetchUrl(atoMeta.id));
        const ato = await res.json();

        const matches = ato.considerandos.match(
          /(\d{0,3})?(\.)?(\d{0,3})?(\.)?(\d{0,3})?(\.)?(\d{1,3})(,\d{2})€/g
        );

        if (matches) {
          const max = matches
            .map((s) => Number(s.split(",")[0].replaceAll(".", "")))
            .reduce((a, b) => Math.max(a, b), -Infinity);

          if (max > formData.montante) {
            setAtos((prevAtos) => [
              ...prevAtos,
              {
                id: ato.id,
                humanId: ato.humanId,
                entidades: ato.entidades.map((e) => e.nome),
                sumario: ato.sumario,
                montanteMax: max,
                // autoria: ato.autoria,
                // descricaoPublicacao: ato.descricaoPublicacao,
                // considerandos: ato.considerandos,
                // dataPorExtenso: ato.dataPorExtenso,
              },
            ]);
          }
        }
      }
    }

    setIsLoading(false);

    if (data.resultSize > page.current * pageSize) {
      page.current++;
      setMoreResults(true);
    } else {
      setMoreResults(false);
    }
  }

  async function filter(formData) {
    setAtos([]);
    setNoResults(false);
    setMoreResults(false);
    setFirstRender(false);
    setCurrentData({ ...formData });
    page.current = 1;
    filterPage(formData);
  }

  return (
    <div>
      <header className="header">
        <div className="header__container">
          <h1 className="header__title"> JORAA </h1>
          {/* <h1 className="header__title">Jornal Oficial</h1>
          <h2 className="header__subtitle">Região Autónoma dos Açores</h2> */}
        </div>
      </header>

      <main className="main">
        <Filter onSubmit={filter} isLoading={isLoading} />

        {!firstRender && (
          <div className="results">
            {atos.map((ato, index) => (
              <Ato key={ato.id + index} data={ato} />
            ))}
            {isLoading && (
              <div className="spinner-div">
                <SixDotsRotate width={40} height={40} />
              </div>
            )}
            {noResults && (
              <p className="noResults">Não foram encontrados resultados.</p>
            )}
            {moreResults && !isLoading && (
              <button
                className="moreResults-btn"
                onClick={() => filterPage(currentData)}
              >
                Ver mais
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
