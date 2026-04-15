import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { addPlantModalSx } from "../theme/styles";
import CameraScanner from "./CameraScanner";

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
  const [scannerOpen, setScannerOpen] = useState(false);
  const [fotoIniciacao, setFotoIniciacao] = useState("");

  useEffect(() => {
    if (open) {
      setFormData(initialForm);
      setFotoIniciacao("");
      setScannerOpen(false);
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
      }, fotoIniciacao || undefined);
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
        <DialogTitle sx={addPlantModalSx.title}>
          Cadastrar Nova Planta
        </DialogTitle>
        <Divider />
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

          <Button
            variant="outlined"
            color="primary"
            startIcon={<CameraAltIcon />}
            onClick={() => setScannerOpen(true)}
            disabled={isSaving}
            fullWidth
          >
            {fotoIniciacao ? "Recapturar Foto de Iniciacao" : "Capturar Foto de Iniciacao"}
          </Button>

          {fotoIniciacao && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mt: 0.5,
              }}
            >
              <Box
                component="img"
                src={fotoIniciacao}
                alt="Miniatura da foto de iniciacao"
                sx={{
                  width: "100%",
                  maxWidth: 240,
                  height: 170,
                  objectFit: "cover",
                  border: "1px solid rgba(126, 166, 194, 0.45)",
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={addPlantModalSx.actions}>
          <Button color="secondary" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar Planta"}
          </Button>
        </DialogActions>
      </form>

      <CameraScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onCapture={(fotoBase64) => {
          setFotoIniciacao(fotoBase64);
          setScannerOpen(false);
        }}
      />
    </Dialog>
  );
}

export default AddPlantModal;
