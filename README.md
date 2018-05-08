# Screeps AI

## What is Screeps?

[Screeps](https://screeps.com/) an open-source sandbox MMO RTS game for programmers, wherein the core mechanic is programming your units’ AI. You control your colony by writing JavaScript which operates 24/7 in the single persistent real-time world filled by other players

## What this is:

This is my WIP take on a Screeps AI. It by no means is the best example of the most efficient or best AI. Many things were hastily written to deal with rising situations on the fly before colony collapse. It works however and continues to evolve into something better.

## Automation Features

In it's current state creep scaling and automated base building for most buildings up to level 8 are all taken care of with a few exceptions. Expansion and war actions can be carried out with the help of user placed flags as follows.

## Flag Usage

### Creeps

**attack** to gather an offensive force.

**standby** to have an army rally to a location during peace.

**claim** to send an expeditionary force to claim a room.

### Structures

Place a **collectLink** on a link to set as collection point.

Place a **depositLink** on a link to set as deposit point.

Link flags will disapear once points are assigned.

## How to use

Part of the fun of Screeps is encountering and solving situations on your own. If you are however still set on using this bot as a framework simply copy the scripts into the top level of the Screeps script directory.
