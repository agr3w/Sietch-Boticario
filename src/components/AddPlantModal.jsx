import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { addPlantModalSx } from "../theme/styles";

const initialForm = {
  nome_apelido: "",
  especie: "",
  localizacao: "",
  intervalo_rega_dias: 7,
  necessidade_agua: "media",
};

function AddPlantModal({ open, onClose, onAdd }) {
  const [formData, setFormData] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData(initialForm);
    }
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "intervalo_rega_dias" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.nome_apelido.trim() ||
      !formData.especie.trim() ||
      !formData.localizacao.trim() ||
      formData.intervalo_rega_dias <= 0
    ) {
      return;
    }

    setIsSaving(true);
    try {
      await onAdd({
        ...formData,
        nome_apelido: formData.nome_apelido.trim(),
        especie: formData.especie.trim(),
        localizacao: formData.localizacao.trim(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: addPlantModalSx.dialogPaper } }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={addPlantModalSx.title}>Cadastrar Nova Planta</DialogTitle>
        <DialogContent sx={addPlantModalSx.form}>
          <TextField
            label="Nome/Apelido"
            name="nome_apelido"
            value={formData.nome_apelido}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Espécie"
            name="especie"
            value={formData.especie}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Localização"
            name="localizacao"
            value={formData.localizacao}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Intervalo de Rega em Dias"
            name="intervalo_rega_dias"
            type="number"
            value={formData.intervalo_rega_dias}
            onChange={handleChange}
            required
            fullWidth
            slotProps={{ htmlInput: { min: 1 } }}
          />
          <TextField
            label="Necessidade de Água"
            name="necessidade_agua"
            value={formData.necessidade_agua}
            onChange={handleChange}
            select
            required
            fullWidth
          >
            <MenuItem value="baixa">baixa</MenuItem>
            <MenuItem value="media">media</MenuItem>
            <MenuItem value="alta">alta</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={addPlantModalSx.actions}>
          <Button onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Planta"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddPlantModal;