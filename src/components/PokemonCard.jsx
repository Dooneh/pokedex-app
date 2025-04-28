import { useNavigate } from 'react-router-dom';

export default function PokemonCard({ p }) {
  const navigate = useNavigate();

  const typeColors = {
    grass: 'bg-green-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    bug: 'bg-lime-500',
    poison: 'bg-purple-500',
    flying: 'bg-indigo-500',
    normal: 'bg-gray-400',
    electric: 'bg-yellow-500',
    ground: 'bg-yellow-600',
    fairy: 'bg-pink-500',
    psychic: 'bg-pink-600',
    rock: 'bg-yellow-700',
    ghost: 'bg-indigo-700',
    dark: 'bg-gray-700',
    steel: 'bg-gray-500',
    ice: 'bg-cyan-500',
    dragon: 'bg-purple-600',
    fighting: 'bg-red-600',
    default: 'bg-gray-300',
  };

  const primaryType = p.types?.[0]?.type?.name || 'default';
  const bgColor = typeColors[primaryType] || typeColors.default;

  return (
    <div
      className={`rounded-2xl p-4 ${bgColor} shadow-md hover:shadow-lg hover:shadow-white/30 hover:scale-105 transition-all duration-200 cursor-pointer`}
      onClick={() => navigate(`/pokemon/${p.name}`)}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-xs font-bold text-gray-600">#{p.id}</span>
        <img src={p.sprites.front_default} alt={p.name} className="w-30 h-20 my-2" />
        <h3 className="text-md font-semibold capitalize text-gray-900">{p.name}</h3>
        <div className="flex gap-2 mt-2 flex-wrap justify-center">
          {p.types.map(t => (
            <span
              key={t.slot}
              className="bg-white/70 text-gray-800 px-2 py-1 text-xs font-medium"
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
