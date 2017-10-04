var app = new Vue({
    el: "#app",
    data: {
        characterHeaders: [
            { text: 'Name', align: 'left', value: 'name' },
            { text: 'Element', value: 'element' },
            { text: 'Max Power', value: 'max_pow' },
            { text: 'Max Technique', value: 'max_tec' },
            { text: 'Max Vitality', value: 'max_vit' },
            { text: 'Max Speed', value: 'max_spd' },
            { text: 'Average Stats', value: 'avg_stat' },
            { text: 'Total Stats', value: 'total_stat' }
        ],
        "pageRows": [50, 100, 200, { text: "All", value: -1 }],
        characters: []
    },
    created: function () {
        this.getCharData();
    },
    methods: {
        getCharData: function () {
            axios.get('/api/characters/').then(response => {
                var data = response.data
                for (var x = 0; x < data.length; x++) {
                    data[x].total_stat = data[x].max_pow + data[x].max_tec + data[x].max_vit + data[x].max_spd;
                    data[x].avg_stat = (data[x].max_pow + data[x].max_tec + data[x].max_vit + data[x].max_spd) / 4;
                }
                this.characters = data;
            });
        }
    }
})
