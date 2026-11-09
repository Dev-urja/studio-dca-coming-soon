export const COLOR = {
  black: '#000000',
  mist: '#d3d3d3',
  grey: '#595959',
  charcoal: '#29282d',
  slate: '#343a49',
  ink: '#141416',
  skin: '#cbb8a6',
}

export const FONT = '/fonts/Outfit-SemiBold.woff'

export const FINAL_YAW = 0

export const scene = {
  page: { w: 16, h: 9, d: 0.22, front: 0.11 },
}

export function computePage(aspect) {
  const safe = Number.isFinite(aspect) && aspect > 0 ? aspect : 1.6
  const h = 9
  const w = h * safe
  return { w, h, d: 0.22, front: 0.11 }
}

export function setPage(aspect) {
  const next = computePage(aspect)
  scene.page.w = next.w
  scene.page.h = next.h
  scene.page.d = next.d
  scene.page.front = next.front
  return scene.page
}

/** World bounds of the webpage slab after the slight yaw. Camera framing uses this. */
export function pageBounds(page = scene.page) {
  const yaw = Math.abs(FINAL_YAW)
  const width = page.w * Math.cos(yaw) + page.d * Math.sin(yaw) + 0.35
  const height = page.h + page.d
  return {
    width,
    height,
    center: [0, 0, 0],
  }
}

export function layout(page = scene.page) {
  const { w, h, front } = page
  const mobile = w < 7
  const z = front + 0.025
  const worker = mobile ? h * 0.068 : h * 0.092
  const domainY = h * 0.385
  const navY = h * 0.275
  const soonW = w * (mobile ? 0.64 : 0.49)
  const soonH = soonW * 0.19
  const soonY = h * 0.035
  const soonZ = z + 0.055
  const deckTop = -h * 0.36
  const deckThickness = 0.055
  const deckY = deckTop - deckThickness * 0.5
  const scaffoldTop = soonY - soonH * 0.56
  const scaffoldW = mobile ? w * 0.14 : Math.max(1.15, worker * 1.55)
  const scaffoldDepth = mobile ? 0.34 : 0.5
  const leftX = mobile ? -w * 0.35 : -soonW * 0.5 - scaffoldW * 0.58
  const rightX = mobile ? w * 0.35 : soonW * 0.5 + scaffoldW * 0.58
  const structureZ = z + 0.32
  const scaffoldH = scaffoldTop - deckTop
  const craneX = w * (mobile ? 0.43 : 0.34)
  const craneY = deckTop

  return {
    mobile,
    z,
    worker,
    domain: { pos: [0, domainY, z], size: mobile ? 0.25 : Math.min(h * 0.038, w * 0.028) },
    home: { pos: [-w * 0.24, navY, z], size: mobile ? 0.19 : Math.min(h * 0.028, w * 0.02) },
    projects: { pos: [0, navY, z], size: mobile ? 0.19 : Math.min(h * 0.028, w * 0.02) },
    about: { pos: [w * 0.24, navY, z], size: mobile ? 0.19 : Math.min(h * 0.028, w * 0.02) },
    soon: {
      pos: [0, soonY, soonZ],
      width: soonW,
      height: soonH,
      depth: 0.07,
    },
    deck: {
      x: 0,
      y: deckY,
      z: z + 0.3,
      width: w * (mobile ? 0.9 : 0.78),
      depth: 0.52,
      top: deckTop,
      thickness: deckThickness,
    },
    scaffoldLeft: {
      x: leftX,
      y: deckTop,
      z: structureZ,
      width: scaffoldW,
      height: scaffoldH,
      depth: scaffoldDepth,
      top: scaffoldTop,
    },
    scaffoldRight: {
      x: rightX,
      y: deckTop,
      z: structureZ,
      width: scaffoldW,
      height: scaffoldH * 0.86,
      depth: scaffoldDepth,
      top: deckTop + scaffoldH * 0.86,
    },
    crane: {
      x: craneX,
      y: craneY,
      z: z + 0.42,
      height: h * 0.48,
      arm: w * (mobile ? 0.25 : 0.12),
    },
    workers: {
      left: { x: leftX, y: scaffoldTop + 0.03, z: structureZ + 0.08, yaw: Math.PI - 0.24 },
      right: {
        x: rightX,
        y: deckTop + scaffoldH * 0.86 + 0.03,
        z: structureZ + 0.08,
        yaw: Math.PI + 0.2,
      },
      ground: {
        x: -w * 0.255,
        y: deckTop,
        z: z + 0.34,
        yaw: -0.55,
      },
      supervisor: {
        x: w * (mobile ? 0.32 : 0.2),
        y: deckTop,
        z: z + 0.34,
        yaw: 0.55,
      },
    },
  }
}

export function introCamera(aspect) {
  const safe = Number.isFinite(aspect) && aspect > 0 ? aspect : 1.6
  const fov = safe < 0.75 ? 32 : 26
  const tan = Math.tan((fov * Math.PI) / 360)
  const z = 2.6 / tan
  return { fov, x: 0, y: 0.05, z }
}

export function finalCamera(aspect, page = scene.page) {
  const safe = Number.isFinite(aspect) && aspect > 0 ? aspect : 1.6
  const bounds = pageBounds(page)
  const fov = safe < 0.75 ? 34 : 26
  const tan = Math.tan((fov * Math.PI) / 360)
  const fillW = safe < 0.75 ? 0.84 : 0.82
  const fillH = safe < 0.75 ? 0.78 : 0.8
  const distW = bounds.width / (2 * fillW * tan * safe)
  const distH = bounds.height / (2 * fillH * tan)
  const dist = Math.max(distW, distH)
  const orbit = 0.055
  return {
    fov,
    x: Math.sin(orbit) * dist,
    y: dist * 0.03,
    z: Math.cos(orbit) * dist,
    lookY: 0,
  }
}
