const preload = {
  garage: () => import('../pages/Projects.jsx'),
  studio: () => import('../pages/About.jsx'),
  workshop: () => import('../pages/Skills.jsx'),
  railway: () => import('../pages/Journey.jsx'),
}

export const doors = [
  {
    id: 'garage', label: 'Garage', subtitle: 'Projects & case studies', route: '/projects', order: 1,
    accent: '#a47c45', preload: preload.garage,
    play: (timeline, refs) => timeline
      .to(refs.latch.current.rotation, { z: -0.55, duration: 0.2, ease: 'power1.inOut' })
      .to(refs.shutter.current.position, { y: 2.6, duration: 1.2, ease: 'power2.inOut' }, '<')
      .to(refs.camera.current.position, { z: refs.camera.current.position.z - 1.15, duration: 1.35, ease: 'power2.inOut' }, '<')
      .to(refs.interiorLight.current, { intensity: 2.3, duration: 1.05, ease: 'power1.out' }, '<0.1')
      .to({}, { duration: 0.3 }),
  },
  {
    id: 'studio', label: 'Studio', subtitle: 'About, values & story', route: '/about', order: 2,
    accent: '#c29a5c', preload: preload.studio,
    play: (timeline, refs) => timeline
      .to([refs.leftHandle.current.rotation, refs.rightHandle.current.rotation], { x: -0.32, duration: 0.2, ease: 'power1.inOut' })
      .to(refs.left.current.rotation, { y: -1.72, duration: 1.2, ease: 'power2.inOut' }, '<')
      .to(refs.right.current.rotation, { y: 1.72, duration: 1.2, ease: 'power2.inOut' }, '<')
      .to(refs.camera.current.position, { z: refs.camera.current.position.z - 1.1, duration: 1.3, ease: 'power2.inOut' }, '<')
      .to(refs.interiorLight.current, { intensity: 2.6, duration: 1.05, ease: 'power1.out' }, '<0.1')
      .to(refs.spill.current.scale, { x: 1.1, duration: 1.1, ease: 'power1.out' }, '<')
      .to({}, { duration: 0.3 }),
  },
  {
    id: 'workshop', label: 'Workshop', subtitle: 'Skills, tools & services', route: '/skills', order: 3,
    accent: '#986f42', preload: preload.workshop,
    play: (timeline, refs) => timeline
      .to(refs.handle.current.rotation, { z: -0.2, duration: 0.2, ease: 'power1.inOut' })
      .to(refs.latch.current.rotation, { z: -0.42, duration: 0.18, ease: 'power1.inOut' }, '<0.04')
      .to(refs.door.current.rotation, { y: -1.66, duration: 1.2, ease: 'power3.inOut' }, '<')
      .to(refs.camera.current.position, { z: refs.camera.current.position.z - 1.2, duration: 1.35, ease: 'power2.inOut' }, '<')
      .to(refs.interiorLight.current, { intensity: 2.4, duration: 1, ease: 'power1.out' }, '<0.1')
      .to(refs.spill.current.scale, { x: 1.1, duration: 1.05, ease: 'power1.out' }, '<')
      .to(refs.door.current.rotation, { y: -1.63, duration: 0.1, ease: 'power1.out' })
      .to({}, { duration: 0.3 }),
  },
  {
    id: 'railway', label: 'Railway', subtitle: 'Experience, education & milestones', route: '/journey', order: 4,
    accent: '#b48d54', preload: preload.railway,
    play: (timeline, refs) => timeline
      .to(refs.handle.current.rotation, { z: -0.2, duration: 0.2, ease: 'power1.inOut' })
      .to(refs.latch.current.rotation, { z: -0.4, duration: 0.18, ease: 'power1.inOut' }, '<0.03')
      .to(refs.panel.current.position, { x: 2.9, duration: 1.2, ease: 'power3.out' }, '<')
      .to(refs.camera.current.position, { z: refs.camera.current.position.z - 1.25, duration: 1.35, ease: 'power2.inOut' }, '<')
      .to(refs.interiorLight.current, { intensity: 2.4, duration: 1.05, ease: 'power1.out' }, '<0.1')
      .to(refs.rate, { current: 2.6, duration: 0.8, ease: 'power1.out' }, '<')
      .to({}, { duration: 0.3 }),
  },
]
