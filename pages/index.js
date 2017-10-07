var app = new Vue({
    el: "#app",
    data: {
        bs: 40,
        stats: {
            bs: { value: 40, max: 40, color: 'light-green' },
            spu: { value: 5, max: 5, color: 'deep-orange' },
            apu: { value: 0, max: 30, color: 'cyan' }
        },
        selectedRarity: [],
        rarities: ['1', '2', '3', '4', '5', '6'],
        selectedRole: [],
        selectedElements: [],
        characters: [],
        charactersTable: [],
        characterHeaders: [
            { text: 'Name', align: 'left', value: 'name' },
            { text: 'Rarity', value: 'rarity' },
            { text: 'Role', value: 'role' },
            { text: 'Element', value: 'element' },
            { text: 'Max Power', value: 'max_pow' },
            { text: 'Max Technique', value: 'max_tec' },
            { text: 'Max Vitality', value: 'max_vit' },
            { text: 'Max Speed', value: 'max_spd' },
            { text: 'Total Stats', value: 'total_stat' }
        ],
        loading: true,
        search: '',
        pageRows: [15, 30, 50]
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
            return 1 + this.stats.spu.value * 0.1;
        },
        getCharData: function () {
            axios.get('/api/characters/').then(response => {
                this.loading = false;
                var data = response.data;
                charactersTable = [];
                for (var x = 0; x < data.length; x++) {
                    if (this.isPlayer(data[x].category)) {
                        var base = data[x].id.toString().substring(0, 1);
                        if (base == "3") {
                            data[x].name += " (EE)";
                        }
                        else if (base == "2") {
                            data[x].name += " (E)";
                        }
                        this.charactersTable.push({
                            name: data[x].name,
                            rarity: data[x].rarity,
                            role: data[x].role,
                            element: data[x].element,
                            max_pow: data[x].max_pow,
                            max_tec: data[x].max_tec,
                            max_vit: data[x].max_vit,
                            max_spd: data[x].max_spd
                        });
                    }
                };
                // this.characters = data;
            });
        }
    }
});