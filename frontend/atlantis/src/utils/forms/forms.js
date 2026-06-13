export function formValue(formData, key) {
  return String(formData.get(key) || "").trim();
}

export function documentoFromForm(formData) {
  return {
    numero: formValue(formData, "documentoNumero"),
    tipo: formValue(formData, "documentoTipo"),
    dataExpedicao: formValue(formData, "dataExpedicao")
  };
}

export function telefoneFromForm(formData) {
  const ddd = formValue(formData, "ddd");
  const numero = formValue(formData, "numero");

  if (!ddd && !numero) return [];

  return [{ ddd, numero }];
}

export function enderecoFromForm(formData) {
  const endereco = {
    rua: formValue(formData, "rua"),
    bairro: formValue(formData, "bairro"),
    cidade: formValue(formData, "cidade"),
    estado: formValue(formData, "estado"),
    pais: formValue(formData, "pais"),
    codigoPostal: formValue(formData, "codigoPostal")
  };

  return Object.values(endereco).some(Boolean) ? endereco : undefined;
}
