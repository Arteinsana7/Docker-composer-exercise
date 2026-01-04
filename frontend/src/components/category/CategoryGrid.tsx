import { CardCategory } from './CardCategory'


export const CategoryGrid = () => {
  const categories = [
    {
      category: 'oscillator' as const,
      icon: '∿',
      image: '/images/oscilator.jpg',
      title: 'Oscillators',
      description: 'Generate waveforms: sine, square, triangle, sawtooth'
    },
    {
      category: 'envelope' as const,
      icon: '⟋',
      image: 'images/Env.jpg',
      title: 'Envelopes',
      description: 'Control sound evolution over time with ADSR'
    },
    {
      category: 'lfo' as const,
      icon: '〰',
      image: '/images/lfo.jpg',
      title: 'LFOs',
      description: 'Low frequency oscillators for modulation effects'
    },
    {
      category: 'filter' as const,
      icon: '⊲',
      image: '/images/filter.jpg',
      title: 'Filters',
      description: 'Shape timbre by removing or emphasizing frequencies'
    },
    {
      category: 'vca' as const,
      icon: '⊳',
      image: '/images/vca.jpg',
      title: 'VCA',
      description: 'Voltage controlled amplifier for volume control'
    },
    {
      category: 'sequencer' as const,
      icon: '▤',
      image: '/images/sequencer.jpg',
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
