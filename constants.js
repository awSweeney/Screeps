//List of player names that are to be considered friendly
global.FRIENDLY_PLAYERS = "slots,shay";

//Constants for creep speak icons
global.EMOJI_SLEEP = fixedFromCharCode(0x01F4A4)
global.EMOJI_HOURGLASS = '\u231B'
global.EMOJI_UPGRADE = '\u26A1'
global.EMOJI_BUILDING = fixedFromCharCode(0x01F528)
global.EMOJI_MINING = '\u26CF'
global.EMOJI_CONSTRUCTING = fixedFromCharCode(0x01F6E0)
global.EMOJI_ATTACKING = '\u2694'
global.EMOJI_RANGED = fixedFromCharCode(0x01F3F9)
global.EMOJI_WARNING = '\u26A0'
global.EMOJI_RECYCLE = '\u267B'
global.EMOJI_COMPLETE = '\u2714'
global.EMOJI_HEALING = fixedFromCharCode(0x0F49A)
global.EMOJI_WORKING = fixedFromCharCode(0x01F504)


/*Unicode workaround for Emojis. Javascript doesn't support 5 digit unicode characters by default and 
string.fromcharcode doesn't work since we don't have access to the right fonts. */
function fixedFromCharCode (codePt) {
    if (codePt > 0xFFFF) {
        codePt -= 0x10000;
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
    }
    else {
        return String.fromCharCode(codePt);
    }
}