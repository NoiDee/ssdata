let app = new Vue({
    el: "#app",
    data: {
        showLastEvoOnly: true,
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
                    text: 'Power',
                    value: 'cur_pow'
                },
                {
                    text: 'Technique',
                    value: 'cur_tec'
                },
                {
                    text: 'Vitality',
                    value: 'cur_vit'
                },
                {
                    text: 'Speed',
                    value: 'cur_spd'
                },
                {
                    text: 'Total Stats',
                    value: 'cur_total'
                }
            ],
            customFilter: function (items, search, filter) {
                search = _.lowerCase(search);
                return items.filter(function (i) {
                    var data = app.selected;
                    return filter(i.name, search) &&
                        app.filterLastEvo(i.isLastEvo) &&
                        app.filterData(data.rarity, i.rarity) &&
                        app.filterData(data.role, i.role) &&
                        app.filterData(data.element, i.element);
                });
            }
        },

    },
    created: function () {
        this.getCharData();
        this.debouncedCalcCharsStats = _.debounce(this.calculateCharsStats, 500)
    },
    watch: {
        stats: {
            handler: function () {
                this.debouncedCalcCharsStats();
            },
            deep: true
        }
    },
    methods: {
        filterLastEvo: function (val) {
            return (this.showLastEvoOnly && val) ||
                (this.showLastEvoOnly == false);
        },
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
            let stLevel = this.stats.level.value / 10;
            let minStatRate = Math.pow(.176, (6 - (stLevel)) / 10);
            let stat = Math.round(minStat * minStatRate);
            let finalStat = Math.floor(stat + (maxStat - stat) * Math.pow((this.stats.level.value - 1) / (60 - 1), 1));
            let totalFinal = Math.floor(finalStat * this.getSpuBonus()) + this.getApuBonus(rarity) + this.stats.bs.value;
            return totalFinal;
        },
        getApuBonus: function (rarity) {
            return (rarity > 5) ? this.stats.apu.value : Math.floor(this.stats.apu.value * 1.2);
        },
        getSpuBonus: function () {
            return 1 + this.stats.spu.value * 0.1;
        },
        calculateCharsStats: function () {
            this.dataTable.isLoading = true;
            this.characters.forEach(char => {
                let cur_pow = this.calculateStat(char.min_pow, char.max_pow);
                let cur_tec = this.calculateStat(char.min_tec, char.max_tec);
                let cur_vit = this.calculateStat(char.min_vit, char.max_vit);
                let cur_spd = this.calculateStat(char.min_spd, char.max_spd);
                let cur_total = cur_pow + cur_tec + cur_vit + cur_spd;

                char.cur_pow = cur_pow;
                char.cur_tec = cur_tec;
                char.cur_vit = cur_vit;
                char.cur_spd = cur_spd;
                char.cur_total = cur_total;
            });
            this.dataTable.isLoading = false;
        },
        getCharData: function () {
            axios.get('/api/characters/').then(response => {
                this.loadCharData(response.data);
                this.calculateCharsStats();
                this.dataTable.isLoading = false;
            });
        },
        appendPlayerNameEvo: function (name, id) {
            let base = id.toString().substring(0, 1);
            if (base == "3") {
                name += " (EE)";
            } else if (base == "2") {
                name += " (E)";
            }
            return name;
        },
        isLastEvolution: function (id, ids) {
            let isLast;
            if (this.showLastEvoOnly) {
                id = id.toString().substring(1);
                isLast = !(ids.indexOf(id) >= 0);
                if (isLast)
                    ids.push(id);
            }
            return isLast;
        },
        loadCharData: function (data) {
            this.characters = [];

            for (var x = data.length - 1; x >= 0; x--) {
                if (this.isPlayer(data[x].category)) {
                    let ids = [];

                    this.characters.push({
                        name: this.appendPlayerNameEvo(data[x].name, data[x].id),
                        rarity: data[x].rarity,
                        role: data[x].role,
                        element: data[x].element,
                        isLastEvo: this.isLastEvolution(data[x].id, ids),
                        max_pow: data[x].max_pow,
                        max_tec: data[x].max_tec,
                        max_vit: data[x].max_vit,
                        max_spd: data[x].max_spd,
                        min_pow: data[x].min_pow,
                        min_tec: data[x].min_tec,
                        min_vit: data[x].min_vit,
                        min_spd: data[x].min_spd,
                        cur_pow: 0,
                        cur_tec: 0,
                        cur_vit: 0,
                        cur_spd: 0,
                        cur_total: 0
                    });
                }
            };
        }
    }
});