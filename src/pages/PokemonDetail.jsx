import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const typeColors = {
  normal: 'bg-gray-400 text-black',
  fire: 'bg-red-500 text-white',
  water: 'bg-blue-600 text-white',
  electric: 'bg-yellow-500 text-black',
  grass: 'bg-green-500 text-black',
  ice: 'bg-cyan-500 text-black',
  fighting: 'bg-red-800 text-white',
  poison: 'bg-purple-700 text-white',
  ground: 'bg-yellow-700 text-white',
  flying: 'bg-indigo-500 text-black',
  psychic: 'bg-pink-600 text-black',
  bug: 'bg-lime-600 text-black',
  rock: 'bg-yellow-900 text-white',
  ghost: 'bg-purple-900 text-white',
  dragon: 'bg-indigo-900 text-white',
  dark: 'bg-gray-800 text-white',
  steel: 'bg-gray-600 text-white',
  fairy: 'bg-pink-400 text-black',
  default: 'bg-gray-500 text-white',
};

export default function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutions, setEvolutions] = useState([]);
  const [forms, setForms] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!res.ok) {
          throw new Error('Pokemon not found');
        }
        const data = await res.json();
        setPokemon(data);
  
        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();
        setSpecies(speciesData);
  
        const typePromises = data.types.map(t => fetch(t.type.url).then(res => res.json()));
        const typeData = await Promise.all(typePromises);
        const weaknessesRaw = typeData.flatMap(t => t.damage_relations.double_damage_from.map(x => x.name));
        setWeaknesses([...new Set(weaknessesRaw)]);
  
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();
        const chain = [];
        let current = evoData.chain;
        while (current) {
          const evoName = current.species.name;
          const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
          const pokeData = await pokeRes.json();
          chain.push({ name: evoName, sprite: pokeData.sprites.front_default });
          current = current.evolves_to[0];
        }
        setEvolutions(chain);
  
        const formVariants = speciesData.varieties.filter(v => !v.is_default);
        const loadedForms = await Promise.all(
          formVariants.map(async v => {
            const formData = await fetch(v.pokemon.url).then(res => res.json());
            return { name: v.pokemon.name, sprite: formData.sprites.front_default };
          })
        );
        setForms(loadedForms);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPokemon(null); 
      }
    }
  
    fetchData();
  }, [name]);
  

  if (!pokemon || !species) return <p className="text-white text-center">Loading...</p>;

  const stats = pokemon.stats.map(s => s.base_stat);
  const statNames = pokemon.stats.map(s => s.stat.name);
  const maxStat = 150;

  const getPoint = (i, value, total) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    const radius = 140 * (value / maxStat);
    return {
      x: 250 + radius * Math.cos(angle),
      y: 250 + radius * Math.sin(angle),
    };
  };

  const points = stats.map((val, i) => {
    const { x, y } = getPoint(i, val, stats.length);
    return `${x},${y}`;
  });

  const flavor = species.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text
    .replace(/[\f\n\r]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const convertHeight = (dm) => {
    const inches = dm * 3.937;
    const feet = Math.floor(inches / 12);
    const rest = Math.round(inches % 12);
    return `${feet}' ${rest}"`;
  };

  const convertWeight = (hg) => `${(hg * 0.2205).toFixed(1)} lbs`;

  return (
    <div className="min-h-screen bg-[#D4E6F1] text-black p-6">
      <h1 className="text-3xl font-bold capitalize text-center mb-6">{pokemon.name}</h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">

        {/* Image + text */}
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg shadow text-center">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-60 h-60 mx-auto mb-4" />
          <p className="italic text-sm text-gray-300">{flavor}</p>
        </div>

        {/* Stat bar */}
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Base Stats</h3>
          <div className="space-y-3">
            {pokemon.stats.map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="capitalize">{stat.stat.name}</span>
                  <span>{stat.base_stat}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-green-700"
                    style={{ width: `${(stat.base_stat / maxStat) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Box */}
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Details</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Height:</strong> {convertHeight(pokemon.height)}</p>
            <p><strong>Weight:</strong> {convertWeight(pokemon.weight)}</p>
            <p><strong>Types:</strong> {pokemon.types.map(t => t.type.name).join(', ')}</p>
            <p><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
            <p><strong>Egg Groups:</strong> {species.egg_groups.map(g => g.name).join(', ')}</p>
          </div>
        </div>

        {/* Weaknesses + Moves */}
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3">Weaknesses</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {weaknesses.map(type => (
              <span key={type} className={`px-3 py-1 rounded-full shadow ${typeColors[type] || typeColors.default}`}>
                {type}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-3">Moves</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {pokemon.moves.slice(0, 8).map((m, i) => (
              <span
                key={i}
                className="bg-blue-700 px-3 py-1 rounded-full text-white shadow hover:scale-105 transition-all"
              >
                {m.move.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
