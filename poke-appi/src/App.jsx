import { useState, useEffect } from 'react';
import './App.css';

const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting',
  'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'steel', 'fairy'
];

function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllKanto = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();

        const detailedData = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );
        setAllPokemons(detailedData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllKanto();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        setVisibleCount((prev) => prev + 20);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleType = (type) => {
    setSelectedTypes((prev) => 
      prev.includes(type) 
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
    setVisibleCount(20);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setVisibleCount(20);
  };

  const filteredPokemons = allPokemons.filter((poke) => {
    const matchesName = poke.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTypes = selectedTypes.length === 0 || selectedTypes.every((selected) =>
      poke.types.some((t) => t.type.name === selected)
    );

    return matchesName && matchesTypes;
  });

  const displayedPokemons = filteredPokemons.slice(0, visibleCount);

  return (
    <div className="container">
      <h1>Pokédex de Kanto Avanzada</h1>
      
      {}
      <input 
        type="text" 
        placeholder="Busca un Pokémon por nombre..." 
        className="search-bar"
        value={searchTerm}
        onChange={handleSearch}
      />

      {}
      <div className="filters-container">
        {POKEMON_TYPES.map((type) => (
          <button 
            key={type} 
            className={`filter-btn ${type} ${selectedTypes.includes(type) ? 'active' : ''}`}
            onClick={() => toggleType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading-text">Cargando los 151 Pokémon de Kanto...</p>
      ) : (
        <>
          <div className="grid">
            {displayedPokemons.map((poke) => (
              <div key={poke.id} className="card">
                <span className="poke-id">#{poke.id.toString().padStart(3, '0')}</span>
                {}
                <img src={poke.sprites.front_default} alt={poke.name} loading="lazy" />
                <h2>{poke.name}</h2>
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
          
          {}
          {displayedPokemons.length === 0 && <p className="loading-text">No se encontraron Pokémon con esos filtros.</p>}
          {visibleCount < filteredPokemons.length && <p className="loading-text">↓ Hacia abajo para cargar más ↓</p>}
        </>
      )}
    </div>
  );
}

export default App;