import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/movies';

export default function FormularioPelicula() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState('');
    const [director, setDirector] = useState('');
    const [año, setAño] = useState('');
    const [imagen, setImagen] = useState(null);
    const [review, setReview] = useState(0); // Calificación como número
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (id) {
            axios
                .get(`${API_URL}/${id}`)
                .then((res) => {
                    const pelicula = res.data;
                    setTitulo(pelicula.titulo);
                    setDirector(pelicula.director);
                    setAño(pelicula.anio);
                    setReview(Number(pelicula.review) || 0);
                    if (pelicula.imagen) {
                        setPreview(`${API_URL}/uploads/${pelicula.imagen}`);
                    }
                })
                .catch(() => {
                    alert('Película no encontrada');
                    navigate('/');
                });
        }
    }, [id, navigate]);

    const manejarImagen = (e) => {
        const file = e.target.files[0];
        setImagen(file);
        setPreview(URL.createObjectURL(file));
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();

        if (!titulo || !director || !año) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (isNaN(Number(año))) {
            alert('Año inválido');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('titulo', titulo);
            formData.append('director', director);
            formData.append('anio', Number(año));
            formData.append('review', review);
            if (imagen) formData.append('imagen', imagen);

            if (id) {
                await axios.put(`${API_URL}/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post(API_URL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Error al guardar la película');
        }
    };

    // Función para renderizar estrellas con clases
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={i <= review ? 'selected' : ''}
                    onClick={() => setReview(i)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setReview(i);
                    }}
                    role='button'
                    tabIndex={0}
                    aria-label={`${i} estrellas`}
                    style={{
                        userSelect: 'none',
                        cursor: 'pointer',
                        fontSize: '2rem',
                    }}>
                    ★
                </span>
            );
        }
        return <div className='stars-container'>{stars}</div>;
    };

    return (
        <div className='container'>
            <h2>{id ? 'Editar Película' : 'Agregar Película'}</h2>
            <form onSubmit={manejarEnvio}>
                <div>
                    <label>Título:</label>
                    <input
                        type='text'
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Director:</label>
                    <input
                        type='text'
                        value={director}
                        onChange={(e) => setDirector(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Año:</label>
                    <input
                        type='number'
                        value={año}
                        onChange={(e) => setAño(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Imagen:</label>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={manejarImagen}
                    />
                </div>
                <div>
                    <label>Calificación:</label>
                    {renderStars()}
                </div>
                {preview && <img src={preview} alt='Vista previa' />}
                <button type='submit'>{id ? 'Actualizar' : 'Crear'}</button>
            </form>
        </div>
    );
}
