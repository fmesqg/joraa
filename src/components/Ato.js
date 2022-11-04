import { buildReturnUrl } from "../api/api";

function Ato({ data }) {
  const url = buildReturnUrl(data.id);

  return (
    <div className="ato">
      <a href={url} target="_blank" className="ato__title">
        {data.humanId}
      </a>
      <p className="ato__entidades">{data.entidades.join("; ")}</p>
      <p className="ato__summary">{data.sumario}</p>
      {Object.hasOwn(data, "montanteMax") && (
        <p className="ato__montante">
          {data.montanteMax.toLocaleString("pt-PT")}€
          <span className="ato__tooltip">Montante máximo mencionado</span>
        </p>
      )}
    </div>
  );
}

export default Ato;
