# Construction worker asset

The scene no longer uses the Mixamo soldier, astronaut, or capsule figures.

Workers load only from:

`public/models/construction-worker.glb`

Until that file is present, the ladders and platforms stay, and no character is drawn.

## What the file must be

One rigged GLB of a miniature construction worker:

- Human anatomy
- Helmet, workwear, boots, gloves
- PBR textures left on the meshes (the loader does not repaint them grey)
- At least one animation clip

The same model is placed six times. Clip names are matched in this order when they exist:

| Role | Preferred clip names |
|------|----------------------|
| Ladder | `Climb`, `Climbing`, `Walk` |
| Drill / install | `Drill`, `Drilling`, `Work`, `Idle` |
| Carry | `Walk`, `Carry` |
| Blueprint | `Measure`, `Inspect`, `Idle` |

## Suggested CC0 sources

- Quaternius “Worker” on Poly Pizza (public domain), exported as GLB
- Innerscene “Drew” construction worker with hard hat and hi-vis (CC0 GLB)

Rename the download to `construction-worker.glb` and put it in `public/models/`. Refresh the page. No code change is required.
