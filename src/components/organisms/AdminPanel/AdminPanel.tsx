import React from 'react';
import { Button, TextField, Paper, Typography, Box, Grid } from '@mui/material';

const AdminPanel = () => {
    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Panel de Administración</Typography>

            <Grid container spacing={4}>
                {/* Configuración SMTP */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 3 }}>
                        <Typography variant="h6">Configuración SMTP</Typography>
                        <TextField label="Servidor SMTP" fullWidth margin="normal" />
                        <TextField label="Puerto" type="number" fullWidth margin="normal" />
                        <TextField label="Correo del remitente" fullWidth margin="normal" />
                        <TextField label="Contraseña" type="password" fullWidth margin="normal" />
                        <Button variant="contained" color="primary" fullWidth>Probar Conexión</Button>
                    </Paper>
                </Grid>

                {/* Configuración de Logotipo */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 3 }}>
                        <Typography variant="h6">Configuración de Logotipo</Typography>
                        <Button variant="contained" component="label" fullWidth>
                            Cargar nuevo logotipo
                            <input type="file" hidden />
                        </Button>
                        <Typography variant="body2" color="textSecondary">
                            Formato: JPG o PNG. Tamaño recomendado: 300x300 píxeles.
                        </Typography>
                    </Paper>
                </Grid>

                {/* Administración de Usuarios */}
                <Grid item xs={12}>
                    <Paper sx={{ padding: 3 }}>
                        <Typography variant="h6">Administración de Usuarios</Typography>
                        <Button variant="contained" color="secondary" sx={{ marginBottom: 2 }}>
                            Agregar Usuario
                        </Button>
                        {/* Aquí va la tabla de usuarios */}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminPanel;
