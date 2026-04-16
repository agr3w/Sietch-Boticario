function parseData(valor) {
  if (!valor) {
    return null;
  }

  if (typeof valor?.toDate === "function") {
    const date = valor.toDate();
    return Number.isFinite(date.getTime()) ? date : null;
  }

  if (typeof valor?.seconds === "number") {
    const milliseconds =
      valor.seconds * 1000 + Math.floor((valor.nanoseconds ?? 0) / 1000000);
    const date = new Date(milliseconds);
    return Number.isFinite(date.getTime()) ? date : null;
  }

  const date = new Date(valor);
  return Number.isFinite(date.getTime()) ? date : null;
}

export function calcularHP(planta, fotos = []) {
  let hp = 50;

  const vitalidade = String(planta?.vitalidade ?? "estavel")
    .trim()
    .toLowerCase();

  if (vitalidade === "prosperando") {
    hp += 20;
  } else if (vitalidade === "recuperacao") {
    hp -= 20;
  } else if (vitalidade === "critico") {
    hp -= 40;
  }

  const totalMarcos = fotos.filter((foto) => Boolean(foto?.marco)).length;
  const bonusMarcos = Math.min(15, totalMarcos * 5);
  hp += bonusMarcos;

  const ultimaRega = parseData(planta?.ultima_rega);
  const intervaloRega = Number(planta?.intervalo_rega ?? planta?.intervalo_rega_dias ?? 0);

  if (ultimaRega && Number.isFinite(intervaloRega) && intervaloRega > 0) {
    const diasDesdeRega =
      (Date.now() - ultimaRega.getTime()) / (1000 * 60 * 60 * 24);
    const diasAtraso = diasDesdeRega - intervaloRega;

    if (diasAtraso <= 1) {
      hp += 15;
    } else if (diasAtraso > 3) {
      const diasExtras = Math.ceil(diasAtraso - 3);
      hp -= diasExtras * 5;
    }
  }

  return Math.max(0, Math.min(100, hp));
}
