import { Outlet, Link } from 'react-router-dom';
import './styles/App.css'; // si estás usando este archivo, asegúrate de importar también el global.css

export default function App() {
    return (
        <div>
            <header className='app-header'>
                <h1>
                    <Link to='/' className='logo-link'>
                        🎬 FilmBase
                    </Link>
                </h1>
                <nav className='nav-links'>
                    <Link to='/'>Inicio</Link>
                    <Link to='/nueva'>Agregar Película</Link>
                </nav>
            </header>
            <main className='container'>
                <Outlet />
            </main>
        </div>
    );
}
