const character = function() {
    this.str =  12;
    this.dex = 5;
    this.int = 4;
    this.luk = 4;
    this.wa = 17;
    this.ma = 23;
    this.magic = 44;
    this.max_attack = 24;
    this.min_attack = 2;
    this.mastery = 15/100;
    this.bonus = 0;

    this.fill = function(str,dex,int,luk,wa,ma,magic,mastery) {
        this.str = str;
        this.dex = dex;
        this.int = int;
        this.luk = luk;
        this.wa = wa;
        this.ma = ma;
        this.magic = magic;
        this.mastery = mastery;
    }
}

const item = function() {
    this.str = 0
    this.dex = 0
    this.int = 0
    this.luk = 0
    this.wa = 0
    this.ma = 0

    this.fill = function (str,dex,int,luk,wa,ma) {
        this.str = str;
        this.dex = dex;
        this.int = int;
        this.luk = luk;
        this.wa = wa;
        this.ma = ma;
    }
}

const range_formulas = function() {
    this.bow = 3.4
    this.crossbow = 3.6
    this.one_h_sword = 4.0
    this.two_h_sword = 4.6
    this.one_h_blunt = 4.4
    this.two_h_blunt = 4.8
    this.spear = 5.0
    this.polearm = 5.0
    this.gun = 3.6
    this.knucle = 4.8
    this.dagger = 3.6
    this.claw = 3.6
    this.staff = 3.6
    this.wand = 3.6

    this.general_max = function(main_stat, multiplier, sec_stat, wa) {
        return Math.ceil(((multiplier * main_stat  + sec_stat)  / 100 ) * wa);
    }

    this.general_min = function(main_stat, mastery, sec_stat, wa) {
        return (main_stat * 0.9 * mastery/100 + sec_stat) * wa / 100;
    }

    this.thief_max = function(main_stat, wa) {
        return (main_stat * 5) * wa / 100;
    }

    this.thief_min = function(main_stat, wa) {
        return (main_stat * 2.5) * wa / 100;
    }

    this.mage_max = function(main_stat, magic, ma) {
        let maxbasedamage = ma;
        if(main_stat > 2000) {
            maxbasedamage -= 2000;
            maxbasedamage += parseInt(((0.09033024267 * main_stat) + 3823.8038));
        }else {
            maxbasedamage -= main_stat;

            if(main_stat > 1700) {
                maxbasedamage += parseInt((0.1996049769 * Math.pow(main_stat, 1.300631341)));
            }else {
                maxbasedamage += parseInt((0.1996049769 * Math.pow(main_stat, 1.290631341)));
            }
        }
        return (maxbasedamage * 107) / 100;
    }

    this.mage_min = function(main_stat,magic,ma,mastery) {
        return (((magic*magic) + magic * mastery * 0.9)/30 + main_stat/200) * ma;
    }
}

var char = new character();
var selected_item = new item();
var range = new range_formulas();

const equips = ["hat","medal","fhead","ring1","ring2","ring3","ring4",
                            "eyeac","earac","cape","chest","bottom","pedant",
                            "weapon","shield","gloves","belt","shoes","total"];
const equips_size = equips.length;

function init() {
    document.getElementById("character_str").value = char.str;
    document.getElementById("character_dex").value = char.dex;
    document.getElementById("character_int").value = char.int;
    document.getElementById("character_luk").value = char.luk;
    document.getElementById("character_wa").value = char.wa;
    document.getElementById("character_ma").value = char.ma;
    document.getElementById("character_magic").value = char.magic;
    document.getElementById("character_mastery").value = char.mastery * 100;
    document.getElementById("character_bonus").value = char.bonus;

    document.getElementById("bow").checked = true;
    document.getElementById("item_1").checked = true;

    set_total_value()
}

init()

function get_attribute(id,attribute) {
    return parseInt(document.getElementById("item_"+id+"_"+attribute).value)
}

function load_selected_item() {
    let str = dex = int = luk = wa = ma = 0;
    if(document.getElementById("item_1").checked) {
        str = get_attribute("1","str");
        dex = get_attribute("1","dex");
        int = get_attribute("1","int");
        luk = get_attribute("1","luk");
        wa = get_attribute("1","wa");
        ma = get_attribute("1","ma");
    }else if(document.getElementById("item_2").checked) {
        str = get_attribute("2","str");
        dex = get_attribute("2","dex");
        int = get_attribute("2","int");
        luk = get_attribute("2","luk");
        wa = get_attribute("2","wa");
        ma = get_attribute("2","ma");
    }else if(document.getElementById("item_3").checked) {
        str = get_attribute("3","str");
        dex = get_attribute("3","dex");
        int = get_attribute("3","int");
        luk = get_attribute("3","luk");
        wa = get_attribute("3","wa");
        ma = get_attribute("3","ma");
    }
    selected_item.fill(str,dex,int,luk,wa,ma);
}

function update_character_attributes() {
    char.str = ! isNaN(document.getElementById("character_str").value) ? parseInt(document.getElementById("character_str").value) : 0;
    char.dex = ! isNaN(document.getElementById("character_dex").value) ? parseInt(document.getElementById("character_dex").value) : 0;
    char.int = ! isNaN(document.getElementById("character_int").value) ? parseInt(document.getElementById("character_int").value) : 0;
    char.luk = ! isNaN(document.getElementById("character_luk").value) ? parseInt(document.getElementById("character_luk").value) : 0;
    char.wa = ! isNaN(document.getElementById("character_wa").value) ? parseInt(document.getElementById("character_wa").value) : 0;
    char.ma = ! isNaN(document.getElementById("character_ma").value) ? parseInt(document.getElementById("character_ma").value) : 0;
    char.magic = ! isNaN(document.getElementById("character_magic").value) ? parseInt(document.getElementById("character_magic").value) : 0;
    char.mastery = ! isNaN(document.getElementById("character_mastery").value) ? parseFloat(document.getElementById("character_mastery").value) : 0;
    char.bonus = ! isNaN(document.getElementById("character_bonus").value) ? parseFloat(document.getElementById("character_bonus").value) : 0;
}

function get_attribute_sum(att) {
    let attribute = 0;
    if(att == "str") {
        attribute += ! isNaN(char.str) ? char.str: 0;
        attribute += parseInt((! isNaN(selected_item.str) ? selected_item.str : 0) + char.bonus * (! isNaN(selected_item.str) ? selected_item.str : 0)/100);
    }else if(att == "dex") {
        attribute += ! isNaN(char.dex) ? char.dex: 0;
        attribute += parseInt((! isNaN(selected_item.dex) ? selected_item.dex : 0) + char.bonus * (! isNaN(selected_item.dex) ? selected_item.dex : 0)/100);
    }else if(att == "int") {
        attribute += ! isNaN(char.int) ? char.int: 0;
        attribute += parseInt((! isNaN(selected_item.int) ? selected_item.int : 0) + char.bonus * (! isNaN(selected_item.int) ? selected_item.int : 0)/100);
    }else if(att == "luk") {
        attribute += ! isNaN(char.luk) ? char.luk: 0;
        attribute += parseInt((! isNaN(selected_item.luk) ? selected_item.luk : 0) + char.bonus * (! isNaN(selected_item.luk) ? selected_item.luk : 0)/100);
    }else if(att == "wa") {
        attribute += ! isNaN(char.wa) ? char.wa  : 0;
        attribute += parseInt((! isNaN(selected_item.wa) ? selected_item.wa : 0) + char.bonus *(! isNaN(selected_item.wa) ? selected_item.wa : 0)/100);
    }else if(att == "ma") {
        attribute +=! isNaN(char.ma) ? char.ma : 0;
        attribute += parseInt((! isNaN(selected_item.ma) ? selected_item.ma : 0) + char.bonus * (! isNaN(selected_item.ma) ? selected_item.ma : 0)/100);
    }else if(att == "magic") {
        attribute += ! isNaN(char.magic) ? char.magic : 0;
    }else if(att == "mastery") {
        attribute += ! isNaN(char.mastery) ? char.mastery : 0;
    }else if(att == "bonus") {
        attribute += ! isNaN(char.bonus) ? char.bonus : 0;
    }
    return attribute;
}

function set_total_value() {
    load_selected_item();
    update_character_attributes();
    document.getElementById("total_str").innerHTML = get_attribute_sum("str");
    document.getElementById("total_dex").innerHTML = get_attribute_sum("dex");
    document.getElementById("total_int").innerHTML = get_attribute_sum("int");
    document.getElementById("total_luk").innerHTML = get_attribute_sum("luk");
    document.getElementById("total_wa").innerHTML = get_attribute_sum("wa");
    document.getElementById("total_ma").innerHTML = get_attribute_sum("ma");
    document.getElementById("total_magic").innerHTML = get_attribute_sum("magic");
    document.getElementById("total_mastery").innerHTML = get_attribute_sum("mastery");
}

function check_weapon_radio(id) {
    return document.getElementById(id).checked == true;
}

function calculate_range() {
    let mastery = wa = ma = main_stat = sec_stat = max = min = 0;
    load_selected_item();
    update_character_attributes();
    if(check_weapon_radio("bow")) {
        main_stat = get_attribute_sum("dex");
        sec_stat = get_attribute_sum("str");
        wa = get_attribute_sum("wa");
        mastery = get_attribute_sum("mastery");
        max = range.general_max(main_stat,range.bow,sec_stat,wa);
        min = range.general_min(main_stat,mastery,sec_stat,wa);
    }else if(check_weapon_radio("crossbow")) {
        main_stat = get_attribute_sum("dex");
        sec_stat = get_attribute_sum("str");
        wa = get_attribute_sum("wa");
        mastery = get_attribute_sum("mastery");
        max = range.general_max(main_stat,range.crossbow,sec_stat,wa);
        min = range.general_min(main_stat,mastery,sec_stat,wa);
    }else if(check_weapon_radio("1h_sword")) {
        main_stat = get_attribute_sum("str");
        sec_stat = get_attribute_sum("dex");
        wa = get_attribute_sum("wa");
        mastery = get_attribute_sum("mastery");
        max = range.general_max(main_stat,range.one_h_sword,sec_stat,wa);
        min = range.general_min(main_stat,mastery,sec_stat,wa);
    }else if(check_weapon_radio("2h_sword")) {
        main_stat = get_attribute_sum("str");
        sec_stat = get_attribute_sum("dex");
        wa = get_attribute_sum("wa");
        mastery = get_attribute_sum("mastery");
        max = range.general_max(main_stat,range.two_h_sword,sec_stat,wa);
        min = range.general_min(main_stat,mastery,sec_stat,wa);
    }else if(check_weapon_radio("1h_blunt")) {
        main_stat = get_attribute_sum("str");
        sec_stat = get_attribute_sum("dex");
        wa = get_attribute_sum("wa");
        mastery = get_attribute_sum("mastery");
        max = range.general_max(main_stat,range.one_h_blunt,sec_stat,wa);
        min = range.general_min(main_stat,mastery,sec_stat,wa);
    }else if(check_weapon_radio("2h_blunt")) {
        main_stat = get_attribute_sum("str");
        sec_stat = get_attribute_sum("dex");
        wa = get_attribute_sum("wa");
        mastery = get_attribute_sum("mastery");
        max = range.general_max(main_stat,range.two_h_blunt,sec_stat,wa);
        min = range.general_min(main_stat,mastery,sec_stat,wa);
    }else if(check_weapon_radio("polearm")) {
        main_stat = get_attribute_sum("str");
        sec_stat = get_attribute_sum("dex");
        wa = get_attribute_sum("wa");
        mastery = get_attribute_sum("mastery");
        max = range.general_max(main_stat,range.polearm,sec_stat,wa);
        min = range.general_min(main_stat,mastery,sec_stat,wa);
    }else if(check_weapon_radio("spear")) {
        main_stat = get_attribute_sum("str");
        sec_stat = get_attribute_sum("dex");
        wa = get_attribute_sum("wa");
        mastery = get_attribute_sum("mastery");
        max = range.general_max(main_stat,range.spear,sec_stat,wa);
        min = range.general_min(main_stat,mastery,sec_stat,wa);
    }else if(check_weapon_radio("gun")) {
        main_stat = get_attribute_sum("dex");
        sec_stat = get_attribute_sum("str");
        wa = get_attribute_sum("wa");
        mastery = get_attribute_sum("mastery");
        max = range.general_max(main_stat,range.gun,sec_stat,wa);
        min = range.general_min(main_stat,mastery,sec_stat,wa);
    }else if(check_weapon_radio("claw")) {
        main_stat = get_attribute_sum("luk");
        sec_stat = get_attribute_sum("str") + get_attribute_sum("dex");
        wa = get_attribute_sum("wa");
        max = range.thief_max(main_stat,wa);
        min =range.thief_min(main_stat,wa);
    }else if(check_weapon_radio("knucle")) {
        main_stat = get_attribute_sum("str");
        sec_stat = get_attribute_sum("dex");
        wa = get_attribute_sum("wa");
        mastery = get_attribute_sum("mastery");
        max = range.general_max(main_stat,range.knucle,sec_stat,wa);
        min = range.general_min(main_stat,mastery,sec_stat,wa);
    }else if(check_weapon_radio("dagger")) {
        main_stat = get_attribute_sum("luk");
        sec_stat = get_attribute_sum("dex");
        wa = get_attribute_sum("wa");
        mastery = get_attribute_sum("mastery");
        max = range.general_max(main_stat,range.dagger,sec_stat,wa);
        min = range.general_min(main_stat,mastery,sec_stat,wa);
    }else if(check_weapon_radio("staff")) {
        main_stat = get_attribute_sum("int");
        sec_stat = get_attribute_sum("luk");
        ma = get_attribute_sum("ma");
        magic = get_attribute_sum("magic");
        mastery = get_attribute_sum("mastery");
        max = range.mage_max(main_stat,magic,ma);
        min = range.mage_min(main_stat,magic,ma,mastery);
    }else if(check_weapon_radio("wand")) {
        main_stat = get_attribute_sum("int");
        sec_stat = get_attribute_sum("luk");
        ma = get_attribute_sum("ma");
        magic = get_attribute_sum("magic");
        mastery = get_attribute_sum("mastery");
        max = range.mage_max(main_stat,magic,ma);
        min = range.mage_min(main_stat,magic,ma,mastery);
    }
    document.getElementById("max").innerHTML = max.toFixed(0);
    //document.getElementById("min").innerHTML = min.toFixed(0);
}