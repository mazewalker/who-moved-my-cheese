# Who Moved My Cheese?

A browser maze game inspired by the "Who Moved My Cheese?" parable, presented as a faithfully recreated Commodore 64 program — from the `**** COMMODORE 64 BASIC V2 ****` boot screen and the authentic 8×8 charset to chunky light-blue maze walls, PETSCII-style pixel sprites, and a CRT scanline overlay. Navigate a shifting maze, grab cheese before it relocates, dodge enemy mice, chain combos, and unlock achievements — solo or local 2-player.

No build step, no dependencies, no framework — just static HTML/CSS/JS served directly by a browser.

## Running it

```bash
./serve.sh          # picks the first free port starting at 8080
./serve.sh 8090      # or force a specific port
```

Then open the printed URL (or forward the port through VSCode's **Ports** tab if running inside Remote-SSH/Codespaces/a devcontainer). Any static file server works too — `python3 -m http.server` is just what `serve.sh` uses.

## Controls

| Input | Action |
|---|---|
| Arrow Keys / WASD | Move (Player 1 uses Arrow Keys, Player 2 uses WASD in 2-player mode) |
| Space | Pause / resume |
| Touch D-pad / swipe | Move (single-player only, shown automatically on touch devices) |
| Gamepad / USB joystick | D-pad or stick to move, Start button to pause/resume — see below |

### Gamepad support

Plug in up to two controllers before or during play. **Press any button on the joystick once** so the browser detects it (a browser security quirk — gamepads stay invisible until the first input). Controllers are then assigned dynamically: the first detected joystick drives **P1**, the second drives **P2**. It does not matter which internal slot the browser assigns the device to — stale/disconnected entries and high slot indices are handled. A toast confirms each connection, and a "Joystick Assigned" toast names which pad drives which player when a game starts.

Because many simple/older USB joysticks (e.g. Competition Pro–style controllers, THEC64 Joystick) don't register with the browser's "standard" gamepad mapping, direction detection checks the standard D-pad buttons (12–15), a low-index button fallback (0–3), and *every* axis pair, rather than assuming one fixed layout. Pause/resume works from the Start button (index 9, with fallbacks at 8 and 10 for non-standard pads).

If a controller isn't responding, open the browser console — a live diagnostic log (`[gamepad N] "<id>" pressed buttons: [...] axes: [...]`) prints whenever any button or axis is active, and the assignment of each detected pad to P1/P2 is logged as well.

## Player identity (P1 / P2)

- In 2-player games, **P1 is cyan** and **P2 is light red** everywhere: on-canvas labels above each sprite, the backing plate under each sprite, the HUD score panels, the character-select badges and the turn prompt.
- The HUD shows a panel per player with their tag (P1/P2), character sprite, name, and score.
- During character choosing, the subtitle announces whose turn it is ("Player 1: Choose your character!" in cyan, then "Player 2: …" in red), and every picked character card gets a visible P1/P2 ribbon.

## Characters

| Character | Ability |
|---|---|
| Sniff | Cheese-move warning appears 2 seconds earlier |
| Scurry | Moves at double speed |
| Hem | +1 extra life |
| Haw | Sees a line to the cheese on the minimap |

## Gameplay

- **Maze**: regenerated each level via recursive backtracking, then "braided" to add loops so there's rarely just one path.
- **Cheese**: regular, double (2x), and (from level 3+) rare golden cheese; it periodically relocates with a warning beforehand.
- **Combo scoring**: chaining cheese pickups within 8 seconds scales the score bonus, up to +100%.
- **Enemies**: wanderer (roams randomly), thief (chases and steals score, then flees), guardian (patrols near the cheese) — composition scales with difficulty and level.
- **Power-ups**: shield (blocks one hit) and apple (restores a life, or +15s if already at full lives).
- **Lives**: enemy contact costs a life and knocks you back to your spawn corner; reaching 0 ends the game.
- **Achievements**: 7 milestones tracked across sessions via `localStorage`.
- **Sound**: procedural Web Audio effects (no audio files) plus optional text-to-speech narration of the maze quotes via the Web Speech API — each quote is read aloud at most once per session.

## The C64 look

- **Boot screen**: an authentic BASIC startup sequence (`LOAD"CHEESE",8,1` and all), with a blinking block cursor. Click or press any key to skip.
- **Font**: the actual MOS 901225-01 character set, converted into a local webfont (`fonts/c64.woff2` / `c64.ttf`) — no network font needed at runtime. Font sizes are snapped to multiples of 8 px for crisp pixels.
- **Sprites**: players, cheese, enemies, and power-ups are PETSCII-style 16×16 pixel bitmaps drawn on the canvas (mouse recolors per character, an owl for Haw, bat/raccoon/wolf enemies), also reused in menus, cards, and the HUD.
- **Screen**: classic blue border / light-blue paper on menus, black playfield in game, chunky maze walls, reverse-video style buttons, and a CRT overlay with scanlines, aperture grille, vignette, and a slight flicker.

## Files

| File | Purpose |
|---|---|
| `index.html` | Screens/modals markup |
| `styles.css` | C64-authentic styling (16-color palette, boot screen, blocky UI, CRT scanline overlay) |
| `game.js` | Game state, maze generation, enemies, scoring, pixel-sprite rendering, input (keyboard/touch/gamepad) |
| `sound.js` | `SoundEngine` — procedural SFX + speech synthesis, independent of `game.js` |
| `fonts/` | C64 charset webfont (woff2 + ttf), generated from the MOS 901225-01 character set |
| `serve.sh` | Local static file server |

## Persistence

Leaderboards, achievements, and the mute preference are stored in `localStorage` (`cheese_leaderboard_*`, `cheese_achievements`, `cheese_achievements_chars_played`, `cheese_sound_muted`) — no backend.
