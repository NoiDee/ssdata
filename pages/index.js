var app = new Vue({
    el: "#app",
    data: {
        toolbar: true,
        spu: 5,
        plusStat: 40,
        selectedRarity: [],
        rarities: ['1', '2', '3', '4', '5', '6'],
        selectedElements: [],
        elements: [
            { text: 'Ardor' },
            { text: 'Whirlwind' },
            { text: 'Thunder' },
            { text: 'Light' },
            { text: 'Dark' }
        ],
        characterHeaders: [
            { text: 'Name', align: 'left', value: 'name' },
            { text: 'Rarity', value: 'rarity' },
            { text: 'Element', value: 'element' },
            { text: 'Max Power', value: 'max_pow' },
            { text: 'Max Technique', value: 'max_tec' },
            { text: 'Max Vitality', value: 'max_vit' },
            { text: 'Max Speed', value: 'max_spd' },
            { text: 'Average Stats', value: 'avg_stat' },
            { text: 'Total Stats', value: 'total_stat' }
        ],
        loading: true,
        search: '',
        pageRows: [25, 50, 100, { text: "All", value: -1 }],
        characters: []
    },
    mounted: function () {
        this.getCharData();
    },
    methods: {
        isPlayer: function (character) {
            return (character === "Player") ? true : false;
        },
        origin_stat: function (min, max, RARITY, LEVEL) {
            rarity_scale_thing = Math.round(min * Math.pow(.176, (6 - RARITY) / 10));
            return Math.floor(min + (max - rarity_scale_thing) * Math.pow((LEVEL - 1) / (60 - 1), 1))
        },
        superb_stat_bonus: function () {
            return 1 + this.spu * 0.1;
        },
        getCharData: function () {
            this.loading = true
            axios.get('/api/characters/').then(response => {
                var data = response.data
                console.log(data)
                for (var x = 0; x < data.length; x++) {
                    if (this.isPlayer(data[x].category)) {
                        var namePrefix = data[x].id.toString().substring(0, 1);
                        if (namePrefix == "3") {
                            namePrefix = " (EE)";
                        }
                        else if (namePrefix == "2") {
                            namePrefix = " (E)";
                        }
                        else
                            namePrefix = "";
                        var max_pow = Math.floor(data[x].max_pow * this.superb_stat_bonus() + this.plusStat);
                        var max_tec = Math.floor(data[x].max_tec * this.superb_stat_bonus() + this.plusStat);
                        var max_vit = Math.floor(data[x].max_vit * this.superb_stat_bonus() + this.plusStat);
                        var max_spd = Math.floor(data[x].max_spd * this.superb_stat_bonus() + this.plusStat);
                        this.characters.push({
                            name: data[x].name + namePrefix,
                            rarity: data[x].rarity,
                            element: data[x].element,
                            max_pow: max_pow,
                            max_tec: max_tec,
                            max_vit: max_vit,
                            max_spd: max_spd,
                            total_stat: max_pow + max_tec + max_vit + max_spd,
                            avg_stat: (max_pow + max_tec + max_vit + max_spd) / 4
                        });
                    }
                };
                this.loading = false;
            });
        }
    }
})

