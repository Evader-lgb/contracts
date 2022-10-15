// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract LabLootTokenResource {
    string[] private weapons = [
        "Warhammer",
        "Quarterstaff",
        "Maul",
        "Mace",
        "Club",
        "Katana",
        "Falchion",
        "Scimitar",
        "Long Sword",
        "Short Sword",
        "Ghost Wand",
        "Grave Wand",
        "Bone Wand",
        "Wand",
        "Grimoire",
        "Chronicle",
        "Tome",
        "Book"
    ];

    string[] private chestArmor = [
        "Divine Robe",
        "Silk Robe",
        "Linen Robe",
        "Robe",
        "Shirt",
        "Demon Husk",
        "Dragonskin Armor",
        "Studded Leather Armor",
        "Hard Leather Armor",
        "Leather Armor",
        "Holy Chestplate",
        "Ornate Chestplate",
        "Plate Mail",
        "Chain Mail",
        "Ring Mail"
    ];

    string[] private headArmor = [
        "Ancient Helm",
        "Ornate Helm",
        "Great Helm",
        "Full Helm",
        "Helm",
        "Demon Crown",
        "Dragon's Crown",
        "War Cap",
        "Leather Cap",
        "Cap",
        "Crown",
        "Divine Hood",
        "Silk Hood",
        "Linen Hood",
        "Hood"
    ];

    string[] private waistArmor = [
        "Ornate Belt",
        "War Belt",
        "Plated Belt",
        "Mesh Belt",
        "Heavy Belt",
        "Demonhide Belt",
        "Dragonskin Belt",
        "Studded Leather Belt",
        "Hard Leather Belt",
        "Leather Belt",
        "Brightsilk Sash",
        "Silk Sash",
        "Wool Sash",
        "Linen Sash",
        "Sash"
    ];

    string[] private footArmor = [
        "Holy Greaves",
        "Ornate Greaves",
        "Greaves",
        "Chain Boots",
        "Heavy Boots",
        "Demonhide Boots",
        "Dragonskin Boots",
        "Studded Leather Boots",
        "Hard Leather Boots",
        "Leather Boots",
        "Divine Slippers",
        "Silk Slippers",
        "Wool Shoes",
        "Linen Shoes",
        "Shoes"
    ];

    string[] private handArmor = [
        "Holy Gauntlets",
        "Ornate Gauntlets",
        "Gauntlets",
        "Chain Gloves",
        "Heavy Gloves",
        "Demon's Hands",
        "Dragonskin Gloves",
        "Studded Leather Gloves",
        "Hard Leather Gloves",
        "Leather Gloves",
        "Divine Gloves",
        "Silk Gloves",
        "Wool Gloves",
        "Linen Gloves",
        "Gloves"
    ];

    string[] private necklaces = ["Necklace", "Amulet", "Pendant"];

    string[] private rings = [
        "Gold Ring",
        "Silver Ring",
        "Bronze Ring",
        "Platinum Ring",
        "Titanium Ring"
    ];

    string[] private quality = [
        "(Common)",
        "(Uncommon)",
        "(Rare)",
        "(Epic)",
        "(Legendary)",
        "(Mythic)"
    ];

    string[] private suffixes = [
        "of Power",
        "of Giants",
        "of Titans",
        "of Skill",
        "of Perfection",
        "of Brilliance",
        "of Enlightenment",
        "of Protection",
        "of Anger",
        "of Rage",
        "of Fury",
        "of Vitriol",
        "of the Fox",
        "of Detection",
        "of Reflection",
        "of the Twins"
    ];

    string[] private namePrefixes = [
        "Agony",
        "Apocalypse",
        "Armageddon",
        "Beast",
        "Behemoth",
        "Blight",
        "Blood",
        "Bramble",
        "Brimstone",
        "Brood",
        "Carrion",
        "Cataclysm",
        "Chimeric",
        "Corpse",
        "Corruption",
        "Damnation",
        "Death",
        "Demon",
        "Dire",
        "Dragon",
        "Dread",
        "Doom",
        "Dusk",
        "Eagle",
        "Empyrean",
        "Fate",
        "Foe",
        "Gale",
        "Ghoul",
        "Gloom",
        "Glyph",
        "Golem",
        "Grim",
        "Hate",
        "Havoc",
        "Honour",
        "Horror",
        "Hypnotic",
        "Kraken",
        "Loath",
        "Maelstrom",
        "Mind",
        "Miracle",
        "Morbid",
        "Oblivion",
        "Onslaught",
        "Pain",
        "Pandemonium",
        "Phoenix",
        "Plague",
        "Rage",
        "Rapture",
        "Rune",
        "Skull",
        "Sol",
        "Soul",
        "Sorrow",
        "Spirit",
        "Storm",
        "Tempest",
        "Torment",
        "Vengeance",
        "Victory",
        "Viper",
        "Vortex",
        "Woe",
        "Wrath",
        "Light's",
        "Shimmering"
    ];

    string[] private nameSuffixes = [
        "Bane",
        "Root",
        "Bite",
        "Song",
        "Roar",
        "Grasp",
        "Instrument",
        "Glow",
        "Bender",
        "Shadow",
        "Whisper",
        "Shout",
        "Growl",
        "Tear",
        "Peak",
        "Form",
        "Sun",
        "Moon"
    ];

    constructor() {}

    function getItemRandom(
        uint256 tokenId,
        string memory _tokenURI,
        string memory keyPrefix
    ) private pure returns (uint256) {
        return
            random(
                string(
                    abi.encodePacked(
                        keyPrefix,
                        Strings.toString(tokenId),
                        _tokenURI
                    )
                )
            );
    }

    function getItemGreatness(uint256 rand) private pure returns (uint256) {
        return rand % 21;
    }

    function getItemGreatness(
        uint256 tokenId,
        string memory _tokenURI,
        string memory keyPrefix
    ) private pure returns (uint256) {
        return getItemGreatness(getItemRandom(tokenId, _tokenURI, keyPrefix));
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function getScore(uint256 tokenId, string memory _tokenURI)
        public
        pure
        returns (string memory)
    {
        //compute total score
        uint256 _score = getItemGreatness(tokenId, _tokenURI, "WEAPON") +
            getItemGreatness(tokenId, _tokenURI, "HEAD") +
            getItemGreatness(tokenId, _tokenURI, "CHEST") +
            getItemGreatness(tokenId, _tokenURI, "WAIST") +
            getItemGreatness(tokenId, _tokenURI, "FOOT") +
            getItemGreatness(tokenId, _tokenURI, "HAND") +
            getItemGreatness(tokenId, _tokenURI, "NECK") +
            getItemGreatness(tokenId, _tokenURI, "RING");

        string memory score = string(
            abi.encodePacked("SCORE:", Strings.toString(_score), " of 160")
        );
        return
            string(
                abi.encodePacked(
                    '<text x="10" y="20" class="base">',
                    score,
                    "</text>"
                )
            );
    }

    function getWeapon(uint256 tokenId, string memory _tokenURI)
        public
        view
        returns (string memory)
    {
        string memory _originURI = pluck(tokenId, _tokenURI, "WEAPON", weapons);
        return _formatItemURI(tokenId, _tokenURI, "WEAPON", 1, _originURI);
    }

    function getChest(uint256 tokenId, string memory _tokenURI)
        public
        view
        returns (string memory)
    {
        string memory _originURI = pluck(
            tokenId,
            _tokenURI,
            "CHEST",
            chestArmor
        );
        return _formatItemURI(tokenId, _tokenURI, "CHEST", 2, _originURI);
    }

    function getHead(uint256 tokenId, string memory _tokenURI)
        public
        view
        returns (string memory)
    {
        string memory _originURI = pluck(tokenId, _tokenURI, "HEAD", headArmor);
        return _formatItemURI(tokenId, _tokenURI, "HEAD", 3, _originURI);
    }

    function getWaist(uint256 tokenId, string memory _tokenURI)
        public
        view
        returns (string memory)
    {
        string memory _originURI = pluck(
            tokenId,
            _tokenURI,
            "WAIST",
            waistArmor
        );
        return _formatItemURI(tokenId, _tokenURI, "WAIST", 4, _originURI);
    }

    function getFoot(uint256 tokenId, string memory _tokenURI)
        public
        view
        returns (string memory)
    {
        string memory _originURI = pluck(tokenId, _tokenURI, "FOOT", footArmor);
        return _formatItemURI(tokenId, _tokenURI, "FOOT", 5, _originURI);
    }

    function getHand(uint256 tokenId, string memory _tokenURI)
        public
        view
        returns (string memory)
    {
        string memory _originURI = pluck(tokenId, _tokenURI, "HAND", handArmor);
        return _formatItemURI(tokenId, _tokenURI, "HAND", 6, _originURI);
    }

    function getNeck(uint256 tokenId, string memory _tokenURI)
        public
        view
        returns (string memory)
    {
        string memory _originURI = pluck(tokenId, _tokenURI, "NECK", necklaces);
        return _formatItemURI(tokenId, _tokenURI, "NECK", 7, _originURI);
    }

    function getRing(uint256 tokenId, string memory _tokenURI)
        public
        view
        returns (string memory)
    {
        string memory _originURI = pluck(tokenId, _tokenURI, "RING", rings);
        return _formatItemURI(tokenId, _tokenURI, "RING", 8, _originURI);
    }

    function pluck(
        uint256 tokenId,
        string memory _tokenURI,
        string memory keyPrefix,
        string[] memory sourceArray
    ) internal view returns (string memory) {
        uint256 rand = getItemRandom(tokenId, _tokenURI, keyPrefix);
        string memory output = sourceArray[rand % sourceArray.length];
        uint256 greatness = getItemGreatness(rand);
        // 套装
        if (greatness > 14) {
            output = string(
                abi.encodePacked(output, " ", suffixes[rand % suffixes.length])
            );
        }
        // 前缀+后缀+套装
        if (greatness >= 19) {
            string[2] memory name;
            name[0] = namePrefixes[rand % namePrefixes.length];
            name[1] = nameSuffixes[rand % nameSuffixes.length];
            if (greatness == 19) {
                output = string(
                    abi.encodePacked('"', name[0], " ", name[1], '" ', output)
                );
            } else {
                // 前缀+后缀+套装 +1
                output = string(
                    abi.encodePacked(
                        '"',
                        name[0],
                        " ",
                        name[1],
                        '" ',
                        output,
                        " +1"
                    )
                );
            }
        }

        //品质
        output = string(
            abi.encodePacked(
                output,
                " ",
                quality[_pluckQualityValue(greatness)]
            )
        );

        return string(abi.encodePacked(keyPrefix, ":", output));
    }

    function getItemQualityValue(
        uint256 tokenId,
        string memory _tokenURI,
        string memory keyPrefix
    ) private pure returns (uint256) {
        uint256 greatness = getItemGreatness(tokenId, _tokenURI, keyPrefix);
        return _pluckQualityValue(greatness);
    }

    function _pluckQualityValue(uint256 greetness)
        private
        pure
        returns (uint256)
    {
        if (greetness == 20) {
            return 5;
        } else if (greetness > 18) {
            return 4;
        } else if (greetness > 14) {
            return 3;
        } else if (greetness > 9) {
            return 2;
        } else if (greetness > 4) {
            return 1;
        } else {
            return 0;
        }
    }

    function _formatItemURI(
        uint256 tokenId,
        string memory _tokenURI,
        string memory keyPrefix,
        uint256 position,
        string memory originURI
    ) private pure returns (string memory) {
        uint256 qualityValue = getItemQualityValue(
            tokenId,
            _tokenURI,
            keyPrefix
        );

        string memory _qulityStyle = "base";
        if (qualityValue == 0) {
            _qulityStyle = "base";
        } else if (qualityValue == 1) {
            _qulityStyle = "green";
        } else if (qualityValue == 2) {
            _qulityStyle = "blue";
        } else if (qualityValue == 3) {
            _qulityStyle = "purple";
        } else if (qualityValue == 4) {
            _qulityStyle = "orange";
        } else if (qualityValue == 5) {
            _qulityStyle = "red";
        }
        uint256 posY = (position + 1) * 20;
        return
            string(
                abi.encodePacked(
                    '<text x="10" y="',
                    Strings.toString(posY),
                    '" class="',
                    _qulityStyle,
                    '">',
                    originURI,
                    "</text>"
                )
            );
    }

    function tokenURI(uint256 tokenId, string memory _tokenURI)
        public
        view
        returns (string memory)
    {
        string[11] memory parts;
        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 400 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }.green { fill: green; }.blue { fill: blue; }.purple { fill: purple; }.orange { fill: orange; }.red { fill: red; }</style><rect width="100%" height="100%" fill="black" />';

        parts[1] = getScore(tokenId, _tokenURI);

        parts[2] = getWeapon(tokenId, _tokenURI);
        parts[3] = getChest(tokenId, _tokenURI);
        parts[4] = getHead(tokenId, _tokenURI);
        parts[5] = getWaist(tokenId, _tokenURI);
        parts[6] = getFoot(tokenId, _tokenURI);
        parts[7] = getHand(tokenId, _tokenURI);
        parts[8] = getNeck(tokenId, _tokenURI);
        parts[9] = getRing(tokenId, _tokenURI);

        parts[10] = "</svg>";

        string memory output = string(
            abi.encodePacked(
                parts[0],
                parts[1],
                parts[2],
                parts[3],
                parts[4],
                parts[5],
                parts[6],
                parts[7],
                parts[8],
                parts[9],
                parts[10]
            )
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Bag #',
                        Strings.toString(tokenId),
                        '", "description": "Loot is randomized adventurer gear generated and stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Loot in any way you want.", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(output)),
                        '"}'
                    )
                )
            )
        );
        output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }
}
