import "./App.css";
import Ato from "./Ato";
import Filter from "./Filter";
import { buildSearchQueryUrl, buildAtoFetchUrl } from "../api/api";
import { useState, useEffect } from "react";
import { SixDotsRotate } from "react-svg-spinners";

function App() {
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  const [atos, setAtos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [moreResults, setMoreResults] = useState(false);
  const [filterData, setFilterData] = useState({
    fromDate: date.toISOString().substring(0, 10),
    toDate: new Date().toISOString().substring(0, 10),
    montante: "",
    serie: "",
    entidade: "",
    tipo: "",
    ordenacao: 1,
    searchText: "",
  });
  const [page, setPage] = useState(1);
  const pageSize = 500;

  // Filter page when filterData or page changes
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      if (page === 1) {
        setAtos([]);
        setNoResults(false);
        setMoreResults(false);
      }

      setIsLoading(true);

      const response = await fetch(
        buildSearchQueryUrl(filterData, page, pageSize),
        { signal }
      );
      if (!response.ok) {
        console.log(
          "Error fetching data: ",
          response.status,
          response.statusText
        );
        setIsLoading(false);
        setNoResults(true);
        return;
      }
      const data = await response.json();

      if (data.resultSize === 0) {
        setIsLoading(false);
        if (page === 1) setNoResults(true);
        return;
      }

      if (filterData.montante === "") {
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
          const res = await fetch(buildAtoFetchUrl(atoMeta.id), { signal });
          if (!res.ok) {
            console.log("Error fetching data: ", res.status, res.statusText);
            continue;
          }
          const ato = await res.json();

          // does not match values starting with '€' (e.g. €1.000,00)
          const regex = new RegExp(
            /(\d{1,3})(\.\d{1,3})?(\.\d{1,3})?(\.\d{1,3})?(,\d{2})(\s)?€/g
          );

          const matches = ((x) => (x ? x : []))(
            ato.considerandos?.match(regex)
          ).concat(
            ato.normativos?.reduce((acc, curr) => {
              let m = curr.normativo?.match(regex);
              return m ? acc.concat(m) : acc;
            }, [])
          );

          if (matches) {
            const max = matches
              .map((s) => Number(s.split(",")[0].replaceAll(".", "")))
              .reduce((a, b) => Math.max(a, b), -Infinity);

            if (max >= filterData.montante) {
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

      if (data.resultSize > page * pageSize) {
        setMoreResults(true);
      } else {
        setMoreResults(false);
      }
    })().catch((err) => {
      if (err.name === "AbortError") {
        console.log("Aborted");
      } else {
        console.log(err);
      }
    });

    return () => controller?.abort();
  }, [filterData, page]);

  const filter = (formData) => {
    setFilterData({ ...formData });
    setPage(1);
  };

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
        <Filter filterData={filterData} filter={filter} />

        {
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
                onClick={() => {
                  setPage((prev) => prev + 1);
                }}
              >
                Ver mais
              </button>
            )}
          </div>
        }
      </main>
    </div>
  );
}

export default App;
