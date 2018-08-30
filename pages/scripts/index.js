const app = new Vue({
    el: "#app",
    data: {
        characters: [],
        rarity: [],
        stats: {
            level: {
                value: 70,
                max: 70,
                min: 1,
                step: 1,
                color: "blue"
            },
            bs: {
                value: 40,
                max: 40,
                color: 'light-green'
            },
            spu: {
                value: 5,
                max: 5,
                color: 'deep-orange'
            },
            apu: {
                value: 0,
                max: 30,
                color: 'cyan'
            }
        },
        toggle: {
            lastEvo: true,
            special: false,
        },
        selected: {
            rarity: [],
            role: [],
            element: [],
            evolution: []
        },
        dataTable: {
            search: '',
            isLoading: true,
            pageRows: [15, 30, 50],
            headers: [{
                    text: 'Rank',
                    align: 'left',
                    sortable: false,
                    value: 'total_stats'
                }, {
                    text: 'Name',
                    align: 'left',
                    value: 'name'
                }, {
                    text: 'Rarity',
                    align: 'right',
                    value: 'rarity'
                }, {
                    text: 'Role',
                    align: 'right',
                    value: 'role'
                }, {
                    text: 'Element',
                    align: 'right',
                    value: 'element'
                }, {
                    text: 'Power',
                    align: 'right',
                    value: 'pow'
                }, {
                    text: 'Technique',
                    align: 'right',
                    value: 'tec'
                }, {
                    text: 'Vitality',
                    align: 'right',
                    value: 'vit'
                }, {
                    text: 'Speed',
                    align: 'right',
                    value: 'spd'
                },
                // {
                //     text: 'Dribble',
                //     align: 'left',
                //     value: 'drib'
                // }, {
                //     text: 'Steal',
                //     align: 'left',
                //     value: 'steal'
                // }, {
                //     text: 'Pass',
                //     align: 'left',
                //     value: 'pass'
                // }, {
                //     text: 'Action Speed',
                //     align: 'left',
                //     value: 'actSpd'
                // }, {
                //     text: 'Defense',
                //     align: 'left',
                //     value: 'def'
                // }, {
                //     text: 'Hit Points',
                //     align: 'left',
                //     value: 'hp'
                // }, {
                //     text: 'Critical',
                //     align: 'left',
                //     value: 'crit'
                // }, {
                //     text: 'Reflexes',
                //     align: 'left',
                //     value: 'refl'
                // }, {
                //     text: 'Recovery Rate',
                //     align: 'left',
                //     value: 'recRate'
                // }, 
                {
                    text: 'Total Stats',
                    align: 'right',
                    value: 'total_stats'
                }
            ],
            customFilter: function (items, search, filter) {
                search = _.lowerCase(search);
                return items.filter(function (item) {
                    const selected = app.selected;
                    const toggle = app.toggle;
                    return filter(item.name, search) &&
                        app.filterToggle(item.isLastEvo, toggle.lastEvo) &&
                        app.filterToggle(item.isSpecial, toggle.special) &&
                        app.filterArray(item.rarity, selected.rarity) &&
                        app.filterArray(item.role, selected.role) &&
                        app.filterArray(item.evolution, selected.evolution) &&
                        app.filterArray(item.element, selected.element);
                });
            }
        },

    },
    created: function () {
        this.getCharData();
        this.deb_getAllStats = _.debounce(this.getAllStats, 500);
    },
    watch: {
        stats: {
            handler: function () {
                this.deb_getAllStats();
            },
            deep: true
        }
    },
    methods: {
        filterToggle: function (val, toggle) {
            return (toggle && val) ||
                (toggle == false);
        },
        filterArray: function (obj, arr) {
            return (!arr.length >= 1) ||
                (arr.includes(obj.toString()));
        },
        isPlayer: function (character) {
            return (character === "Player") ? true : false;
        },
        getStat: function (minStat, maxStat, rarity) {
            let stLevel = this.stats.level.value / 10;
            let minStatRate = Math.pow(.176, (6 - (stLevel)) / 10);
            let stat = Math.round(minStat * minStatRate);
            let finalStat = Math.floor(stat + (maxStat - stat) * Math.pow((this.stats.level.value - 1) / (60 - 1), 1));
            let totalFinal = Math.floor(finalStat * this.getSpuBonus()) + this.getApuBonus(rarity) + this.stats.bs.value;
            return totalFinal;
        },
        getApuBonus: function (rarity) {
            return (rarity > 5) ?
                this.stats.apu.value :
                Math.floor(this.stats.apu.value * 1.2);
        },
        getSpuBonus: function () {
            return 1 + this.stats.spu.value * 0.1;
        },
        getAllStats: function () {
            this.dataTable.isLoading = true;
            this.characters.forEach(char => {
                let pow = this.getStat(char.min_pow, char.max_pow);
                let tec = this.getStat(char.min_tec, char.max_tec);
                let vit = this.getStat(char.min_vit, char.max_vit);
                let spd = this.getStat(char.min_spd, char.max_spd);
                let total_stats = pow + tec + vit + spd;

                char.pow = pow;
                char.tec = tec;
                char.vit = vit;
                char.spd = spd;

                // char.drib = this.getDrible(char.pow, char.spd);
                // char.steal = this.getSteal(char.tec, char.spd);
                // char.pass = this.getPass(char.tec);
                // char.actSpd = this.getActionSpeed(char.spd);
                // char.def = this.getDefense(char.tec, char.vit);
                // char.hp = this.getHitPoints(char.vit);
                // char.crit = this.geCritical(char.pow, char.tec, char.spd);
                // char.refl = this.getReflexes(char.tec, char.spd);
                // char.recRate = this.getRecoveryRate(char.pow, char.vit);

                char.total_stats = total_stats;
            });
            this.dataTable.isLoading = false;
        },
        getDrible: function (pow, spd) {
            return Math.floor(5 + pow + (spd * 0.2));
        },
        getSteal: function (tec, spd) {
            return Math.floor(5 + tec + (spd * 0.2));
        },
        getPass: function (tec) {
            return Math.floor(3 + (tec * 0.8));
        },
        getActionSpeed: function (spd) {
            return Math.floor(30 + (spd * 0.1));
        },
        getDefense: function (tec, vit) {
            return Math.floor(30 + (vit * 0.2) + (tec * 0.8));
        },
        getHitPoints: function (vit) {
            return Math.floor(20 + (this.stats.level.value * 0.8) + (vit * 1.8));
        },
        geCritical: function (pow, tec, spd) {
            return Math.floor((0.05 + ((pow * 0.3) + (tec * 0.8) + (spd * 0.4) * 0.001)) * 1000);
        },
        getReflexes: function (tec, spd) {
            return Math.floor(((5 + tec + (spd / 12)) / 4 / (this.stats.level.value + 30)) * 1000);
        },
        getRecoveryRate: function (pow, vit) {
            return Math.round((0.03 + (pow + vit) * 0.002) * 100) / 100;
        },
        getCharData: function () {
            axios.get('/api/characters/').then(response => {
                this.loadCharData(response.data);
                this.getAllStats();
                this.dataTable.isLoading = false;
            });
        },
        getEvoSuffix: function (id) {
            if (id == "3")
                return " (EE)";
            else if (id == "2")
                return " (E)";
            else
                return "";
        },
        isLastEvo: function (id, ids) {
            let isLast;
            id = id.toString().substring(1);
            isLast = !(ids.indexOf(id) >= 0);
            if (isLast)
                ids.push(id);
            return isLast;
        },
        loadCharData: function (data) {
            let playerIds = [];
            this.characters = [];

            for (var x = data.length - 1; x >= 0; x--) {
                let player = data[x];

                if (this.isPlayer(player.category)) {
                    let evoLevel = player.id.toString().substring(0, 1);

                    this.characters.push({
                        name: player.name + this.getEvoSuffix(evoLevel),
                        rarity: player.rarity,
                        role: player.role,
                        element: player.element,
                        evolution: evoLevel,
                        isLastEvo: this.isLastEvo(player.id, playerIds),
                        isSpecial: player.is_special,
                        max_pow: player.max_pow,
                        max_tec: player.max_tec,
                        max_vit: player.max_vit,
                        max_spd: player.max_spd,
                        min_pow: player.min_pow,
                        min_tec: player.min_tec,
                        min_vit: player.min_vit,
                        min_spd: player.min_spd,
                        pow: 0,
                        tec: 0,
                        vit: 0,
                        spd: 0,
                        // drib: 0,
                        // steal: 0,
                        // actSpd: 0,
                        // def: 0,
                        // hp: 0,
                        // crit: 0,
                        // refl: 0,
                        // recRate: 0,
                        total_stats: 0
                    });
                }
            };
        }
    }
});