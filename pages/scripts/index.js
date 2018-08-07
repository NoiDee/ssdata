var app = new Vue({
    el: "#app",
    data: {
        latestChar: true,
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
        selected: {
            rarity: [],
            role: [],
            element: []
        },
        dataTable: {
            search: '',
            isLoading: true,
            pageRows: [15, 30, 50],
            headers: [{
                    text: 'Name',
                    align: 'left',
                    value: 'name'
                },
                {
                    text: 'Rarity',
                    value: 'rarity'
                },
                {
                    text: 'Role',
                    value: 'role'
                },
                {
                    text: 'Element',
                    value: 'element'
                },
                {
                    text: 'Max Power',
                    value: 'max_pow'
                },
                {
                    text: 'Max Technique',
                    value: 'max_tec'
                },
                {
                    text: 'Max Vitality',
                    value: 'max_vit'
                },
                {
                    text: 'Max Speed',
                    value: 'max_spd'
                },
                {
                    text: 'Total Stats',
                    value: 'total_stat'
                }
            ],
            customFilter: function (items, search, filter) {
                search = search.toString().toLowerCase();
                return items.filter(function (i) {
                    var data = app.selected;
                    return filter(i.name, search) &&
                        app.filterData(data.rarity, i.rarity) &&
                        app.filterData(data.role, i.role) &&
                        app.filterData(data.element, i.element);
                });
            }
        },

    },
    mounted: function () {
        this.getCharData();
    },
    methods: {
        filterData: function (arr, obj) {
            if (arr.length >= 1) {
                if (!arr.includes(obj.toString()))
                    return false;
            }
            return true;
        },
        isPlayer: function (character) {
            return (character === "Player") ? true : false;
        },
        calculateStat: function (minStat, maxStat, rarity) {
            var stLevel = this.stats.level.value / 10;
            var minStatRate = Math.pow(.176, (6 - (stLevel)) / 10);
            var stat = Math.round(minStat * minStatRate);
            var finalStat = Math.floor(stat + (maxStat - stat) * Math.pow((this.stats.level.value - 1) / (60 - 1), 1));
            var totalFinal = Math.floor(finalStat * this.getSpuBonus()) + this.getApuBonus(rarity) + this.stats.bs.value;
            return totalFinal;
        },
        getApuBonus: function (rarity) {
            return (rarity > 5) ? this.stats.apu.value : Math.floor(this.stats.apu.value * 1.2);
        },
        getSpuBonus: function () {
            return 1 + this.stats.spu.value * 0.1;
        },
        getCharData: function () {
            axios.get('/api/characters/').then(response => {
                var data = response.data;
                var ids = [];
                this.characters = [];
                for (var x = data.length - 1; x >= 0; x--) {
                    if (this.isPlayer(data[x].category)) {
                        var base = data[x].id.toString().substring(0, 1);
                        if (base == "3") {
                            data[x].name += " (EE)";
                        } else if (base == "2") {
                            data[x].name += " (E)";
                        }

                        // if (this.latestChar) {
                        //     var id = data[x].id.toString().substring(1);

                        //     if (ids.indexOf(id) === -1) {
                        //         continue;
                        //     } else {
                        //         ids.push(id);
                        //     }
                        // }

                        this.characters.push({
                            name: data[x].name,
                            rarity: data[x].rarity,
                            role: data[x].role,
                            element: data[x].element,
                            max_pow: data[x].max_pow,
                            max_tec: data[x].max_tec,
                            max_vit: data[x].max_vit,
                            max_spd: data[x].max_spd,
                            min_pow: data[x].min_pow,
                            min_tec: data[x].min_tec,
                            min_vit: data[x].min_vit,
                            min_spd: data[x].min_spd,
                            total_stat: this.calculateStat(data[x].min_pow, data[x].max_pow) +
                                this.calculateStat(data[x].min_tec, data[x].max_tec) +
                                this.calculateStat(data[x].min_vit, data[x].max_vit) +
                                this.calculateStat(data[x].min_spd, data[x].max_spd)
                        });
                    }
                };
                this.dataTable.isLoading = false;
            });
        }
    }
});