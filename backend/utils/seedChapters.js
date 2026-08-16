const Chapter = require('../models/Chapter');

const defaultChapters = [
  { title: "Units and Measurements", order: 1, icon: "📐", description: "Learn about standard units of measurement and dimensional analysis." },
  { title: "Motion in One Dimension", order: 2, icon: "🏃", description: "Study displacement, velocity, acceleration, and equations of motion." },
  { title: "Motion in Two Dimensions", order: 3, icon: "🏹", description: "Analyze vectors, projectile motion, and uniform circular motion." },
  { title: "Laws of Motion", order: 4, icon: "🍎", description: "Understand Newton's three laws of motion, friction, and dynamics." },
  { title: "Work, Energy and Power", order: 5, icon: "⚡", description: "Explore the work-energy theorem, conservation of energy, and collisions." },
  { title: "System of Particles", order: 6, icon: "🎡", description: "Study center of mass, torque, angular momentum, and rotational motion." },
  { title: "Gravitation", order: 7, icon: "🪐", description: "Discover Kepler's laws of planetary motion and Newton's law of gravitation." },
  { title: "Mechanical Properties of Matter", order: 8, icon: "⚓", description: "Study elasticity, viscosity, surface tension, and fluid mechanics." },
  { title: "Thermodynamics", order: 9, icon: "🔥", description: "Understand heat, work, internal energy, laws of thermodynamics, and engines." },
  { title: "Oscillations", order: 10, icon: "⏳", description: "Learn about simple harmonic motion (SHM), pendulums, and resonance." },
  { title: "Waves", order: 11, icon: "🌊", description: "Explore wave speed, transverse and longitudinal waves, and Doppler effect." },
  { title: "Electrostatics", order: 12, icon: "⚡", description: "Study electric charge, Coulomb's law, electric field, potential, and capacitance." },
  { title: "Current Electricity", order: 13, icon: "🔌", description: "Learn Ohm's law, electrical circuits, Kirchhoff's laws, and meters." },
  { title: "Magnetism", order: 14, icon: "🧲", description: "Discover magnetic fields, Biot-Savart law, Ampere's law, and magnetic materials." },
  { title: "Electromagnetic Induction", order: 15, icon: "🌀", description: "Understand Faraday's law, Lenz's law, self-induction, and alternating current (AC)." },
  { title: "Optics", order: 16, icon: "🔍", description: "Explore reflection, refraction, lenses, mirrors, interference, and diffraction." },
  { title: "Modern Physics", order: 17, icon: "⚛️", description: "Study dual nature of radiation, atoms, nuclei, radioactivity, and relativity." }
];

const seedChapters = async (adminUserId) => {
  try {
    for (const chap of defaultChapters) {
      const exists = await Chapter.findOne({ title: chap.title });
      if (!exists) {
        await Chapter.create({
          ...chap,
          createdBy: adminUserId
        });
      }
    }
    console.log('Default physics chapters successfully checked/seeded!');
  } catch (error) {
    console.error('Error seeding default chapters:', error);
  }
};

module.exports = seedChapters;
