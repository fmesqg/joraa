import { buildReturnUrl } from "../api/api";

function Ato({ data, hasMontante }) {
  const url = buildReturnUrl(data.id);

  return (
    <div className="ato">
      <p> {data.humanId} </p>
      <p>{data.entidades.join("; ")}</p>
      <p>
        <strong>Sumário:</strong> {data.sumario}
      </p>
      {hasMontante && (
        <p>
          Montante máximo mencionado: {data.montanteMax.toLocaleString("pt-PT")}
          €
        </p>
      )}
      <a href={url}>{url}</a>
    </div>
  );
}

export default Ato;
