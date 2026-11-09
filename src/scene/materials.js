import * as THREE from 'three'
import { COLOR } from '../brand'

function std(color, roughness, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness })
}

export const mats = {
  spiral: new THREE.MeshPhysicalMaterial({
    color: '#e7e7e7', roughness: 0.36, metalness: 0.14,
    clearcoat: 0.45, clearcoatRoughness: 0.28,
    transparent: true, opacity: 0, side: THREE.DoubleSide,
  }),

  // Page face – slightly warm concrete/stone, not pure white
  sheet: new THREE.MeshPhysicalMaterial({
    color: '#e8e6e2', roughness: 0.68, metalness: 0.04,
    clearcoat: 0.12, clearcoatRoughness: 0.55,
    side: THREE.DoubleSide, transparent: true, opacity: 0,
  }),

  // Page slab edges – dark charcoal, metallic finish
  edge: new THREE.MeshPhysicalMaterial({
    color: COLOR.charcoal, roughness: 0.38, metalness: 0.32,
    clearcoat: 0.35, clearcoatRoughness: 0.35,
  }),

  back: std('#14141a', 0.72, 0.1),

  slateLine: new THREE.MeshStandardMaterial({ color: COLOR.slate, roughness: 0.38, metalness: 0.26 }),

  // Worker body – charcoal work suit
  suit:  std(COLOR.charcoal, 0.76, 0.08),

  // Worker lower limbs – grey (contrast with suit)
  grey:  std(COLOR.grey,    0.62, 0.12),

  // Worker vest – slate blue hi-vis
  slate: new THREE.MeshPhysicalMaterial({
    color: COLOR.slate, roughness: 0.32, metalness: 0.22,
    clearcoat: 0.6, clearcoatRoughness: 0.3,
  }),

  // Hi-vis stripes – bright mist/silver
  mist:  std(COLOR.mist, 0.46, 0.08),

  skin:  std(COLOR.skin, 0.56, 0),
  boot:  std('#101012',  0.5,  0.16),

  // Metallic tools & structural
  steel: new THREE.MeshStandardMaterial({ color: '#8a8a9a', roughness: 0.28, metalness: 0.82 }),

  // Dark details – belt, brim, visor
  ink:   std(COLOR.ink, 0.5, 0.2),

  // Gloves
  glove: std('#3a3a3e', 0.54, 0.14),

  // Paper/card – used in COMING SOON backing (via edge), kept for compat
  paper: new THREE.MeshPhysicalMaterial({
    color: '#f5f5f5', roughness: 0.44, metalness: 0.03,
    clearcoat: 0.18, clearcoatRoughness: 0.42,
  }),
}

// ── Shared geometries ─────────────────────────────────────────────────────────
export const geos = {
  // Head + helmet
  head:    new THREE.SphereGeometry(0.070, 22, 16),
  helmet:  new THREE.SphereGeometry(0.100, 24, 16),
  brim:    new THREE.CylinderGeometry(0.138, 0.142, 0.018, 24),
  ridge:   new THREE.BoxGeometry(0.022, 0.072, 0.115),
  visor:   new THREE.BoxGeometry(0.092, 0.030, 0.022),
  eye:     new THREE.SphereGeometry(0.012, 10, 8),
  nose:    new THREE.SphereGeometry(0.014, 10, 8),

  // Torso
  neck:    new THREE.CylinderGeometry(0.034, 0.042, 0.058, 12),
  torso:   new THREE.CapsuleGeometry(0.102, 0.158, 6, 12),
  pelvis:  new THREE.SphereGeometry(0.090, 16, 12),
  shoulder:new THREE.SphereGeometry(0.050, 12, 10),
  vest:    new THREE.BoxGeometry(0.172, 0.206, 0.052),
  stripe:  new THREE.BoxGeometry(0.155, 0.024, 0.014),
  belt:    new THREE.BoxGeometry(0.175, 0.034, 0.105),
  pouch:   new THREE.BoxGeometry(0.058, 0.050, 0.030),

  // Arms
  upperArm: new THREE.CapsuleGeometry(0.038, 0.105, 4, 10),
  lowerArm: new THREE.CapsuleGeometry(0.032, 0.095, 4, 10),
  hand:     new THREE.SphereGeometry(0.036, 12, 10),
  knee:     new THREE.BoxGeometry(0.072, 0.042, 0.052),

  // Legs
  upperLeg: new THREE.CapsuleGeometry(0.048, 0.136, 4, 10),
  lowerLeg: new THREE.CapsuleGeometry(0.040, 0.126, 4, 10),
  boot:     new THREE.BoxGeometry(0.082, 0.050, 0.124),

  // Tools
  hammerHandle: new THREE.CylinderGeometry(0.013, 0.014, 0.19, 8),
  hammerHead:   new THREE.BoxGeometry(0.105, 0.040, 0.042),
  drillBody:    new THREE.BoxGeometry(0.058, 0.105, 0.072),
  drillBit:     new THREE.CylinderGeometry(0.013, 0.008, 0.095, 8),
  wrench:       new THREE.BoxGeometry(0.030, 0.175, 0.013),
  wrenchHead:   new THREE.BoxGeometry(0.058, 0.030, 0.015),
  panel:        new THREE.BoxGeometry(0.40,  0.28,  0.034),
  beam:         new THREE.BoxGeometry(1.00,  0.072, 0.072),
  tapeCase:     new THREE.BoxGeometry(0.094, 0.115, 0.048),
  tapeBlade:    new THREE.BoxGeometry(0.52,  0.013, 0.006),
  rod:          new THREE.BoxGeometry(0.026, 1.0,   0.022),
  tile:         new THREE.BoxGeometry(0.17,  0.17,  0.022),
}
