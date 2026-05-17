const fs = require('fs');

// Read the file
let content = fs.readFileSync('majors_info.json', 'utf8');

// Split into lines for manipulation
let lines = content.split(/\r?\n/);

// We need to fix multiple structural issues:
// 1. Line 171 (0-indexed 170): trailing comma "    }," -> should stay "    },"  but line 172 "}" closes root prematurely
// 2. Line 172 (0-indexed 171): "}" should be removed (premature close of root object)
// 3. Line 173 (0-indexed 172): blank line, can keep
// 4. Line 174 (0-indexed 173): "    \"eng_arch\":" needs to be inside root object (already is after removing line 172)
//
// 5. Line 310 (0-indexed 309): "    \"eng_environ\": " missing opening "{"
// 6. Line 342-343 (0-indexed 341-342): eng_environ not closed, eng_food starts
//    Line 342 ends with ","  -- need to add "    }," before eng_food and change line 342 appropriately
//
// 7. Line 479 (0-indexed 478): "    \"nursing\": " missing opening "{"  
// 8. Line 512 (0-indexed 511): nursing not closed, then med_lab starts nested (with wrong indentation)
//    Need to add "}" to close nursing before med_lab, and fix indentation of med_lab onward
//
// 9. Line 649 (0-indexed 648): "    \"marketing\": " missing opening "{"
// 10. Line 682 (0-indexed 681): marketing not closed properly, then a new "{" starts
//     Line 681: "            }," -- this is end of careers. But then line 682: "            {"
//     Lines 682-692: a whole new object block with "hotel" inside separate braces
//
// 11. Lines 737-738 (0-indexed 736-737): "}" closes group, "{" starts another
// 12. Lines 793-794 (0-indexed 792-793): "}" closes group, "{" starts another

// Let me identify exact line numbers (1-indexed) and fix them

// Fix 1: Line 171 has trailing comma which is fine (eng_civil ends)
// Fix 2: Line 172 "}" - this is the premature root close. Remove it.
// Fix 3: Line 173 blank line - remove or keep (remove to be clean)

// Let's work with 0-indexed
function trimRight(s) { return s.replace(/\s+$/, ''); }

// Let me do targeted replacements line by line
// First, let me log problematic lines to verify
console.log("Line 171:", JSON.stringify(lines[170]));
console.log("Line 172:", JSON.stringify(lines[171]));
console.log("Line 173:", JSON.stringify(lines[172]));
console.log("Line 174:", JSON.stringify(lines[173]));
console.log("Line 310:", JSON.stringify(lines[309]));
console.log("Line 342:", JSON.stringify(lines[341]));
console.log("Line 343:", JSON.stringify(lines[342]));
console.log("Line 479:", JSON.stringify(lines[478]));
console.log("Line 511:", JSON.stringify(lines[510]));
console.log("Line 512:", JSON.stringify(lines[511]));
console.log("Line 513:", JSON.stringify(lines[512]));
console.log("Line 649:", JSON.stringify(lines[648]));
console.log("Line 681:", JSON.stringify(lines[680]));
console.log("Line 682:", JSON.stringify(lines[681]));
console.log("Line 683:", JSON.stringify(lines[682]));
console.log("Line 692:", JSON.stringify(lines[691]));
console.log("Line 693:", JSON.stringify(lines[692]));
console.log("Line 736:", JSON.stringify(lines[735]));
console.log("Line 737:", JSON.stringify(lines[736]));
console.log("Line 738:", JSON.stringify(lines[737]));
console.log("Line 792:", JSON.stringify(lines[791]));
console.log("Line 793:", JSON.stringify(lines[792]));
console.log("Line 794:", JSON.stringify(lines[793]));
console.log("Line 860:", JSON.stringify(lines[859]));
console.log("Line 861:", JSON.stringify(lines[860]));
