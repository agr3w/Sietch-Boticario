import { useEffect, useState } from 'react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { Container, Grid, Typography } from '@mui/material';
import { db } from '../firebase';
import PlantCard from '../components/PlantCard';

function Dashboard() {
  const [plantas, setPlantas] = useState([]);

  const carregarPlantas = async () => {
    const querySnapshot = await getDocs(collection(db, 'plantas'));
    const listaPlantas = [];

    querySnapshot.forEach((plantaDoc) => {
      listaPlantas.push({ id: plantaDoc.id, ...plantaDoc.data() });
    });

    setPlantas(listaPlantas);
  };

  useEffect(() => {
    void (async () => {
      await carregarPlantas();
    })();
  }, []);

  const regarPlanta = async (id) => {
    const plantaRef = doc(db, 'plantas', id);

    await updateDoc(plantaRef, {
      ultima_rega: new Date().toISOString(),
    });

    carregarPlantas();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
        Sietch Boticário 🌿
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
        Gestão de Umidade e Controle Botânico
      </Typography>

      <Grid container spacing={3}>
        {plantas.map((planta) => (
          <Grid item xs={12} sm={6} key={planta.id}>
            <PlantCard planta={planta} onRegar={regarPlanta} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Dashboard;