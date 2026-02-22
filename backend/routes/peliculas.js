import express from 'express';
import mongoose from 'mongoose';
import Pelicula from '../models/Pelicula.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// === Configuración de almacenamiento de imágenes ===
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Servir imágenes desde /movies/uploads
router.use('/uploads', express.static('uploads'));

// === Obtener todas las películas ===
router.get('/', async (req, res) => {
    try {
        const peliculas = await Pelicula.find();
        res.status(200).json(peliculas);
    } catch (error) {
        console.error('Error al obtener películas:', error);
        res.status(500).json({ error: 'Error al obtener películas' });
    }
});

// === Obtener película por ID ===
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const pelicula = await Pelicula.findById(id);
        if (!pelicula) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }
        res.status(200).json(pelicula);
    } catch (error) {
        console.error('Error al obtener película:', error);
        res.status(500).json({ error: 'Error al obtener película' });
    }
});

// === Crear nueva película ===
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        console.log('Body recibido:', req.body);
        console.log('Archivo recibido:', req.file);

        const { titulo, director, anio, review } = req.body;

        if (!titulo || !director || !anio) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const nuevaPelicula = new Pelicula({
            titulo,
            director,
            anio: Number(anio),
            review: review ? Number(review) : 1,
            imagen: req.file ? req.file.filename : null,
        });

        await nuevaPelicula.save();
        res.status(201).json(nuevaPelicula);
    } catch (error) {
        console.error('Error al crear película:', error);
        res.status(500).json({ error: 'Error al crear película' });
    }
});

// === Actualizar película ===
router.put('/:id', upload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { titulo, director, anio, review } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    if (!titulo || !director || !anio) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const updateData = {
            titulo,
            director,
            anio: Number(anio),
            review: review ? Number(review) : 1,
        };

        if (req.file) {
            updateData.imagen = req.file.filename;
        }

        const peliculaActualizada = await Pelicula.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!peliculaActualizada) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        res.status(200).json(peliculaActualizada);
    } catch (error) {
        console.error('Error al actualizar película:', error);
        res.status(500).json({ error: 'Error al actualizar película' });
    }
});

// === Eliminar película ===
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const peliculaEliminada = await Pelicula.findByIdAndDelete(id);
        if (!peliculaEliminada) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        // Eliminar imagen asociada si existe
        if (peliculaEliminada.imagen) {
            const imagePath = path.join('uploads', peliculaEliminada.imagen);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({ message: 'Película eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar película:', error);
        res.status(500).json({ error: 'Error al eliminar película' });
    }
});

export default router;
