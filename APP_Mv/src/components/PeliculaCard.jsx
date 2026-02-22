import React from 'react';
import { useNavigate } from 'react-router-dom';

// Componente para mostrar estrellas según calificación
function Estrellas({ valor }) {
    const maxEstrellas = 5;
    const estrellas = [];

    const estrellasLlenas = Math.floor(valor);
    const tieneMediaEstrella = valor - estrellasLlenas >= 0.5;

    for (let i = 0; i < estrellasLlenas; i++) {
        estrellas.push(
            <span key={i} style={{ color: '#f5c518', fontSize: '1.2rem' }}>
                ★
            </span>
        );
    }
    if (tieneMediaEstrella) {
        estrellas.push(
            <span key='media' style={{ color: '#f5c518', fontSize: '1.2rem' }}>
                ☆
            </span>
        );
    }
    const total = tieneMediaEstrella ? estrellasLlenas + 1 : estrellasLlenas;

    for (let i = total; i < maxEstrellas; i++) {
        estrellas.push(
            <span key={i + 10} style={{ color: '#ccc', fontSize: '1.2rem' }}>
                ★
            </span>
        );
    }
    return <div>{estrellas}</div>;
}

export default function PeliculaCard({ pelicula, onEliminar }) {
    const navigate = useNavigate();
    const { _id, titulo, director, anio, imagen, review } = pelicula;

    return (
        <div
            className='pelicula-card'
            style={{
                border: '1px solid #ccc',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
            }}>
            {imagen ? (
                <img
                    src={imagen}
                    alt={titulo}
                    style={{
                        width: '120px',
                        height: 'auto',
                        borderRadius: '8px',
                        objectFit: 'cover',
                    }}
                />
            ) : (
                <div
                    style={{
                        width: '120px',
                        height: '90px',
                        backgroundColor: '#eee',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        fontSize: '0.9rem',
                    }}>
                    Sin imagen
                </div>
            )}
            <div style={{ flexGrow: 1 }}>
                <h3>{titulo}</h3>
                <p>
                    <strong>Director:</strong> {director}
                </p>
                <p>
                    <strong>Año:</strong> {anio}
                </p>
                {typeof review === 'number' && (
                    <div>
                        <strong>Calificación:</strong>{' '}
                        <Estrellas valor={review} />
                    </div>
                )}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                }}>
                <button onClick={() => navigate(`/editar/${_id}`)}>
                    Editar
                </button>
                <button
                    onClick={() => onEliminar(_id)}
                    style={{ color: 'red' }}>
                    Eliminar
                </button>
            </div>
        </div>
    );
}
