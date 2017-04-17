

var json;

let $ = require('jQuery');

var icons = {
    c75za: "../img/weapons/C75a_hud_csgo.png",
    deagle: "../img/weapons/Deagle_hud_go.png",
    elite: "../img/weapons/Elite_hud_csgo.png",
    fiveseven: "../img/weapons/Fiveseven_hud_csgo.png",
    glock: "../img/weapons/Glock18_hud_csgo.png",
    p250: "../img/weapons/P250_hud.png",
    hkp2000: "../img/weapons/Hkp2000_hud.png",
    tec9: "../img/weapons/Tec9_hud_csgo.png",
    usp_silencer: "../img/weapons/Usps_hud_csgo.png",
    mag7: "../img/weapons/Mag7_hud_csgo.png",
    revolver: "../img/weapons/Deagle_hud_go.png",
    nova: "../img/weapons/Nova_hud_csgo.png",
    sawedoff: "../img/weapons/Sawedoff_hud_csgo.png",
    xm1014: "../img/weapons/Xm1014_hud_csgo.png",
    mac10: "../img/weapons/Mac10_hud_csgo.png",
    mp7: "../img/weapons/Mp7_hud_csgo.png",
    mp9: "../img/weapons/Mp9_hud_csgo.png",
    p90: "../img/weapons/P90_hud_csgo.png",
    bizon: "../img/weapons/Bizon_hud_csgo.png",
    ump45: "../img/weapons/Ump45_hud_csgo.png",
    ak47: "../img/weapons/Ak47_hud_csgo.png",
    aug: "../img/weapons/Aug_hud_csgo.png",
    famas: "../img/weapons/Famas_hud_csgo.png",
    galilar: "../img/weapons/Galilar_hud.png",
    m4a1_silencer: "../img/weapons/M4a1s_hud_csgo.png",
    m4a1: "../img/weapons/M4a4_hud.png",
    sg556: "../img/weapons/Sg556_hud_csgo.png",
    awp: "../img/weapons/Awp_hud_csgo.png",
    g3sg1: "../img/weapons/G3sg1_hud_csgo.png",
    ssg08: "../img/weapons/Ssg08_hud_csgo.png",
    scar20: "../img/weapons/Scar20_hud_csgo.png",
    m249: "../img/weapons/M249_hud_csgo.png",
    negev: "../img/weapons/Negev_hud.png",

    c4: "../img/weapons/C4_ticking_source.png",
    hegrenade: "http://vignette1.wikia.nocookie.net/cswikia/images/6/60/Ammo_hegrenade_css.png/revision/latest/scale-to-width-down/75",
    molotov: "http://vignette3.wikia.nocookie.net/cswikia/images/f/fc/Molotov_hud_csgo.png/revision/latest/scale-to-width-down/75",
    flashbang: "http://vignette2.wikia.nocookie.net/cswikia/images/a/af/Flashbang_hud_csgo.png/revision/latest/scale-to-width-down/75",
    decoy: "http://vignette1.wikia.nocookie.net/cswikia/images/7/78/Decoy_hud.png/revision/latest/scale-to-width-down/75",
    smokegrenade: "http://vignette3.wikia.nocookie.net/cswikia/images/4/48/Smokegrenade_hud_csgo.png/revision/latest/scale-to-width-down/75",
    incgrenade: "http://vignette2.wikia.nocookie.net/cswikia/images/4/45/Incgrenade_hud_csgo.png/revision/latest/scale-to-width-down/75",

    knife: "../img/weapons/Knife_ct_hud_outline_csgo.png",
    knife_t: "../img/weapons/Knife_t_hud_outline_csgo.png",
    knife_bayonet: "../img/weapons/Csgo_knife_Bayonet.png",
    knife_butterfly: "../img/weapons/Knife_butterfly_hud_outline_csgo.png",
    knife_falchion: "../img/weapons/Falchion_Knife_hud_outline_csgo.png",
    knife_flip: "../img/weapons/Knife_flip_hud_outline_csgo.png",
    knife_gut: "../img/weapons/Knife_gut_hud_outline_csgo.png",
    knife_tactical: "../img/weapons/Knife_hustman_hud_outline_csgo.png",
    knife_karambit: "../img/weapons/Knife_karambit_hud_outline_csgo.png",
    knife_m9_bayonet: "../img/weapons/Csgo_knife_M9_Bayonet.png",
    knife_shadow_dagger: "../img/weapons/Knife_push_hud_outline_csgo.png"

}


function parseData(data) {

    json = JSON.parse(data);


    var gsiPlayer = {

        steam_id: "",
        name: "",
        team: "",

        round_stats: {
            kills: 0,
            hs_kills: 0,
            money: 0,
            health: 0,
            armor: 0,
            helmet: false
        },

        match_stats: {
            kills: 0,
            deaths: 0,
            assists: 0,
            mvps: 0,
            score: 0
        },

        player_weapons: []
    }

    var gsi = {

        timestamp: "",
        steam_id: "",

        game: {
            mode: "",
            map: "",
            t_score: 0,
            ct_score: 0,
            round: 0,
            phase: ""
        },

        round: {
            phase: "",
            win_team: "",
            bomb_status : ""
        },

        player: gsiPlayer

    }


    console.log("parsing data.......")

    gsi.steam_id = json.provider.steamid;
    gsi.timestamp = json.provider.timestamp;

    if(json.round) {

        if(json.round.bomb) {
            gsi.round.bomb_status = json.round.bomb;
        }

        gsi.round.phase = json.round.phase;

        if(json.round.win_team) {
            gsi.round.win_team = json.round.win_team;
        }
    }

    if(json.map) {
        if(json.map.mode) {
            gsi.game.mode = json.map.mode;
        }
        gsi.game.map = json.map.name;
        gsi.game.round = json.map.round;
        gsi.game.phase = json.map.phase;
        gsi.game.ct_score = json.map.team_ct.score;
        gsi.game.t_score = json.map.team_t.score;
    }

    if(json.player) {

        gsi.player.steam_id = json.player.steamid;

        if(json.player.name) {
            gsi.player.name = json.player.name;
        }

        if(json.player.team) {
            gsi.player.team = json.player.team;
        }

        if(json.player.state) {
            gsi.player.round_stats.money = json.player.state.money;
            gsi.player.round_stats.kills = json.player.state.round_kills;
            gsi.player.round_stats.hs_kills = json.player.state.round_killhs;
            gsi.player.round_stats.health = json.player.state.health;
            gsi.player.round_stats.armor = json.player.state.armor;
            gsi.player.round_stats.helmet = json.player.state.helmet;
        }

        if(json.player.match_stats) {
            gsi.player.match_stats.kills = json.player.match_stats.kills;
            gsi.player.match_stats.deaths = json.player.match_stats.deaths;
            gsi.player.match_stats.assists = json.player.match_stats.assists;
            gsi.player.match_stats.mvps = json.player.match_stats.mvps;
            gsi.player.match_stats.score = json.player.match_stats.score;
        }
    }


    if(json.player.weapons) {
        for (let key in json.player.weapons) {

            if (json.player.weapons.hasOwnProperty(key)) {

                var weapon = json.player.weapons[key];
                var name = weapon.name.replace("weapon_", "");
                var type = weapon.type.toLowerCase();

                var weaponModel = {
                    type: type,
                    name: name
                };

                if(type != "grenade") {
                    gsi.player.player_weapons.push(weaponModel)
                }

            }
        }
    }

    return gsi;
}


exports.parseData = parseData;
exports.icons = icons;
