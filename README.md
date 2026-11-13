# apple-scroll-animation (Claude Code plugin)

Adds one skill, `apple-scroll-animation`, that teaches Claude to build Apple-style scroll-driven animation
in plain HTML/CSS/JS with no libraries: pinned (sticky) sections, items that fly in and assemble,
word-by-word reveals, a pinned stepper, a tilt-flat phone, rise-in cards and an expanding video.

## Install

From a GitHub repo containing this folder:

    /plugin marketplace add <github-user>/apple-scroll-animation
    /plugin install apple-scroll-animation@apple-scroll-animation

From a local folder:

    /plugin marketplace add /path/to/apple-scroll-animation-plugin
    /plugin install apple-scroll-animation@apple-scroll-animation

Then ask Claude for "Apple-style scroll animation", or call the skill by name.

## Layout

    .claude-plugin/plugin.json        plugin manifest
    .claude-plugin/marketplace.json   lets this folder act as its own marketplace
    skills/apple-scroll-animation/    SKILL.md + references/scroll-engine.js
