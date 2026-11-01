import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        // Petición GET a los primeros 20 Pokémon
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const data = await response.json();

        // Peticiones GET individuales para obtener los detalles completados de cada uno
        const detailedData = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );

        setPokemons(detailedData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchPokemons();
  }, []);

  return (
    <div className="container">
      <h1>Pokédex</h1>
      <div className="grid">
        {pokemons.map((poke) => (
          <div key={poke.id} className="card">
            {/* Imagen del Pokémon */}
            <img src={poke.sprites.front_default} alt={poke.name} />
            
            {/* Nombre */}
            <h2>{poke.name}</h2>
            
            {/* Mapeo dinámico de los tipos del Pokémon */}
            <div className="types-container">
              {poke.types.map((typeInfo) => (
                <span key={typeInfo.type.name} className={`type-badge ${typeInfo.type.name}`}>
                  {typeInfo.type.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;