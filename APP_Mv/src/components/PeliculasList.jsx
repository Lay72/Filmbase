import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/movies';

function Estrellas({ valor }) {
    const maxEstrellas = 5;
    const estrellas = [];
    const estrellasLlenas = Math.floor(valor);
    const tieneMediaEstrella = valor - estrellasLlenas >= 0.5;

    for (let i = 0; i < estrellasLlenas; i++) {
        estrellas.push(<span key={i} style={{ color: '#f5c518', fontSize: '1.4rem' }}>★</span>);
    }
    if (tieneMediaEstrella) {
        estrellas.push(<span key='media' style={{ color: '#f5c518', fontSize: '1.4rem' }}>☆</span>);
    }
    const total = tieneMediaEstrella ? estrellasLlenas + 1 : estrellasLlenas;
    for (let i = total; i < maxEstrellas; i++) {
        estrellas.push(<span key={i + 10} style={{ color: '#444', fontSize: '1.4rem' }}>★</span>);
    }
    return <div style={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>{estrellas}</div>;
}

export default function PeliculasList() {
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarPeliculas = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API_URL);
            setPeliculas(res.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar películas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarPeliculas(); }, []);

    const eliminarPelicula = async (id) => {
        if (!window.confirm('¿Seguro que quieres eliminar esta película?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            cargarPeliculas();
        } catch {
            alert('Error al eliminar la película');
        }
    };

    if (loading) return <p style={{ color: '#aaa', textAlign: 'center', marginTop: '2rem' }}>Cargando películas...</p>;
    if (error) return <p style={{ color: '#e05252', textAlign: 'center' }}>{error}</p>;

    return (
        <div className='container'>
            <h2>Películas disponibles</h2>
            {peliculas.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#aaa' }}>No hay películas disponibles.</p>
            ) : (
                <div className='peliculas-grid'>
                    {peliculas.map((pelicula) => (
                        <div key={pelicula._id} className='pelicula-card'>
                            {pelicula.imagen ? (
                                <img
                                    src={`http://localhost:4000/uploads/${pelicula.imagen}`}
                                    alt={pelicula.titulo}
                                    className='pelicula-img'
                                />
                            ) : (
                                <div className='sin-imagen'>Sin imagen</div>
                            )}
                            <div className='pelicula-info'>
                                <h3>{pelicula.titulo}</h3>
                                <p><strong>Director:</strong> {pelicula.director}</p>
                                <p><strong>Año:</strong> {pelicula.anio}</p>
                                {typeof pelicula.review === 'number' && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <p style={{ marginBottom: '4px' }}><strong>Calificación:</strong></p>
                                        <Estrellas valor={pelicula.review} />
                                    </div>
                                )}
                            </div>
                            <div className='pelicula-acciones'>
                                <Link to={`/editar/${pelicula._id}`} style={{ flex: 1 }}>
                                    <button className='btn-editar'>Editar</button>
                                </Link>
                                <button
                                    className='btn-eliminar'
                                    onClick={() => eliminarPelicula(pelicula._id)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
