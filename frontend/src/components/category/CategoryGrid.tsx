import { CardCategory } from './CardCategory'


export const CategoryGrid = () => {
  const categories = [
    {
      category: 'oscillator' as const,
      icon: '∿',
      image: '/images/1.png',
      title: 'Oscillators',
      description: 'Generate waveforms: sine, square, triangle, sawtooth'
    },
    {
      category: 'envelope' as const,
      icon: '⟋',
      image: 'images/2.png',
      title: 'Envelopes',
      description: 'Control sound evolution over time with ADSR'
    },
    {
      category: 'lfo' as const,
      icon: '〰',
      image: '/images/3.png',
      title: 'LFOs',
      description: 'Low frequency oscillators for modulation effects'
    },
    {
      category: 'filter' as const,
      icon: '⊲',
      image: '/images/4.png',
      title: 'Filters',
      description: 'Shape timbre by removing or emphasizing frequencies'
    },
    {
      category: 'vca' as const,
      icon: '⊳',
      image: '/images/5.png',
      title: 'VCA',
      description: 'Voltage controlled amplifier for volume control'
    },
    {
      category: 'sequencer' as const,
      icon: '▤',
      image: '/images/6.png',
      title: 'Sequencers',
      description: 'Create patterns and sequences of notes'
    },
  ];

  return (
    <>
      {categories.map((cat) => (
        <CardCategory
          key={cat.category}
          category={cat.category}
          icon={cat.icon}
          image={cat.image}
          title={cat.title}
          description={cat.description}
        />
      ))}
    </>
  );
};
