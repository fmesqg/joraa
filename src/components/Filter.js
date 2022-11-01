import { useState, useEffect } from "react";
import { seriesUrl, entidadesUrl, tiposUrl } from "../api/api";

function Filter({ onSubmit, isLoading }) {
  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 3);

  const [formData, setFormData] = useState({
    fromDate: fromDate.toISOString().substring(0, 10),
    toDate: new Date().toISOString().substring(0, 10),
    // montante: 500000,
    montante: "",
    serie: "",
    entidade: "",
    tipo: "",
  });

  const [seriesList, setSeriesList] = useState([]);
  const [entidadesList, setEntidadesList] = useState([]);
  const [tiposList, setTiposList] = useState([]);

  useEffect(() => {
    fetch(seriesUrl)
      .then((response) => response.json())
      .then((data) => setSeriesList(data.seriesList));
    fetch(entidadesUrl)
      .then((response) => response.json())
      .then((data) => setEntidadesList(data.entidadesList));
    fetch(tiposUrl)
      .then((response) => response.json())
      .then((data) => setTiposList(data.tiposAtoList));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="filter">
      <div className="filter__dates-container">
        <div className="filter__input-container">
          <label
            className={"filter__label" && formData.fromDate && "filled"}
            htmlFor="fromDate"
          >
            De
          </label>
          <input
            type="date"
            onChange={handleChange}
            name="fromDate"
            value={formData.fromDate}
          />
        </div>
        <div className="filter__input-container">
          <label
            className={"filter__label" && formData.toDate && "filled"}
            htmlFor="toDate"
          >
            Até
          </label>
          <input
            type="date"
            onChange={handleChange}
            name="toDate"
            value={formData.toDate}
          />
        </div>
      </div>

      <div className="filter__input-container">
        <label
          className={"filter__label" && formData.serie && "filled"}
          htmlFor="serie"
        >
          Série
        </label>
        <select
          id="serie"
          value={formData.serie}
          onChange={handleChange}
          name="serie"
        >
          <option value=""></option>
          {seriesList.map((serieObj) => (
            <option key={serieObj.id} value={serieObj.id}>
              {serieObj.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="filter__input-container">
        <label
          className={"filter__label" && formData.entidade && "filled"}
          htmlFor="entidade"
        >
          Entidade
        </label>
        <select
          id="entidade"
          value={formData.entidade}
          onChange={handleChange}
          name="entidade"
        >
          <option value=""></option>
          {entidadesList.map((entidadeObj) => (
            <option key={entidadeObj.id} value={entidadeObj.id}>
              {entidadeObj.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="filter__input-container">
        <label
          className={"filter__label" && formData.tipo && "filled"}
          htmlFor="tipo"
        >
          Tipo
        </label>
        <select
          id="tipo"
          value={formData.tipo}
          onChange={handleChange}
          name="tipo"
        >
          <option value=""></option>
          {tiposList.map((tipoObj) => (
            <option key={tipoObj.id} value={tipoObj.id}>
              {tipoObj.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="filter__input-container">
        <label
          className={"filter__label" && formData.montante && "filled"}
          htmlFor="montante"
        >
          Montante mínimo (€)
        </label>
        <input
          type="number"
          // step="100000"
          min="0"
          max="9000000000"
          onChange={handleChange}
          name="montante"
          value={formData.montante}
        />
      </div>

      <button className="filter-btn" disabled={isLoading}>
        Filtrar
      </button>
    </form>
  );
}

export default Filter;
